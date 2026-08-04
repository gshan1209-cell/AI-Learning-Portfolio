"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CompanionRole = "guide" | "hint" | "tutor";

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  actionText?: string;
  targetElementId?: string;
  previewSnippet?: string;
  previewBullets?: string[];
}

interface WizardContextType {
  enabled: boolean;
  toggleEnabled: () => void;
  role: CompanionRole;
  setRole: (role: CompanionRole) => void;
  companionOpen: boolean;
  setCompanionOpen: (open: boolean) => void;
  activeHint: string | null;
  setActiveHint: (hint: string | null) => void;
  steps: WizardStep[];
  currentStepIndex: number;
  setSteps: (steps: WizardStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  clearSteps: () => void;
  completedCourses: string[];
  markCourseCompleted: (title: string) => void;
  isCourseCompleted: (title: string) => boolean;
}

const STORAGE_KEY = "alp_wizard_mode_enabled";
const COMPLETED_KEY = "alp_wizard_completed_courses";

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [role, setRole] = useState<CompanionRole>("guide");
  const [companionOpen, setCompanionOpen] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [steps, setStepsState] = useState<WizardStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setEnabled(saved === "true");
      }
      const savedCompleted = localStorage.getItem(COMPLETED_KEY);
      if (savedCompleted) {
        setCompletedCourses(JSON.parse(savedCompleted));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleEnabled = () => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore localStorage write error
      }
      return next;
    });
  };

  const markCourseCompleted = (title: string) => {
    setCompletedCourses((prev) => {
      if (prev.includes(title)) return prev;
      const next = [...prev, title];
      try {
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
      } catch {
        // Ignore write error
      }
      return next;
    });
  };

  const isCourseCompleted = (title: string) => completedCourses.includes(title);

  const setSteps = (newSteps: WizardStep[]) => {
    setStepsState(newSteps);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const clearSteps = () => {
    setStepsState([]);
    setCurrentStepIndex(0);
  };

  return (
    <WizardContext.Provider
      value={{
        enabled,
        toggleEnabled,
        role,
        setRole,
        companionOpen,
        setCompanionOpen,
        activeHint,
        setActiveHint,
        steps,
        currentStepIndex,
        setSteps,
        nextStep,
        prevStep,
        goToStep,
        clearSteps,
        completedCourses,
        markCourseCompleted,
        isCourseCompleted,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
