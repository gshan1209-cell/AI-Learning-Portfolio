import Link from "next/link";
import { notFound } from "next/navigation";
import VisualStoryPlayer from "@/components/visual-story-player";
import CosmosRuntimeLab from "@/components/runtime-labs/cosmos-runtime-lab";
import EnsembleRuntimeLab from "@/components/runtime-labs/ensemble-runtime-lab";
import StockManimLab from "@/components/runtime-labs/stock-manim-lab";

const labSlugs = [
  "stock-manim",
  "cosmos-prompt-lab",
  "ensemble-fairness-lab",
  "ai-visual-story",
] as const;

type LabSlug = (typeof labSlugs)[number];

export function generateStaticParams() {
  return labSlugs.map((slug) => ({ slug }));
}

export default function LearningLabPage({ params }: { params: { slug: string } }) {
  if (!labSlugs.includes(params.slug as LabSlug)) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/courses" className="text-sm font-bold text-brand hover:underline">
        ← 回到課程目錄
      </Link>
      <div className="mt-8">
        {params.slug === "stock-manim" && <StockManimLab />}
        {params.slug === "cosmos-prompt-lab" && <CosmosRuntimeLab />}
        {params.slug === "ensemble-fairness-lab" && <EnsembleRuntimeLab />}
        {params.slug === "ai-visual-story" && <VisualStoryPlayer />}
      </div>
    </main>
  );
}
