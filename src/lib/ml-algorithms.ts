import decisionTree from "../../modules/ml-top-10/data/algorithms/decision-tree.json";
import gradientDescent from "../../modules/ml-top-10/data/algorithms/gradient-descent.json";
import kmeans from "../../modules/ml-top-10/data/algorithms/kmeans.json";
import knn from "../../modules/ml-top-10/data/algorithms/knn.json";
import linearRegression from "../../modules/ml-top-10/data/algorithms/linear-regression.json";
import logisticRegression from "../../modules/ml-top-10/data/algorithms/logistic-regression.json";
import naiveBayes from "../../modules/ml-top-10/data/algorithms/naive-bayes.json";
import pca from "../../modules/ml-top-10/data/algorithms/pca.json";
import randomForest from "../../modules/ml-top-10/data/algorithms/random-forest.json";
import svm from "../../modules/ml-top-10/data/algorithms/svm.json";
import type { MlAlgorithm, MlAlgorithmQuery } from "@/types/ml-algorithm";

const algorithms: MlAlgorithm[] = [
  linearRegression,
  logisticRegression,
  decisionTree,
  randomForest,
  svm,
  knn,
  kmeans,
  naiveBayes,
  pca,
  gradientDescent,
] as MlAlgorithm[];

const relatedCourseBySlug: Record<string, string> = {
  "linear-regression": "linear-regression-for-beginners",
  svm: "svm-kernel-trick-3d",
};

export function getAllMlAlgorithms(filters: MlAlgorithmQuery = {}) {
  const query = filters.query?.trim().toLowerCase();

  return algorithms.filter((algorithm) => {
    const haystack = [
      algorithm.name_zh,
      algorithm.name_en,
      algorithm.category,
      algorithm.difficulty,
      algorithm.one_liner,
      algorithm.analogy,
      ...algorithm.use_cases,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || haystack.includes(query)) &&
      (!filters.category || algorithm.category === filters.category) &&
      (!filters.difficulty || algorithm.difficulty === filters.difficulty)
    );
  });
}

export function getMlAlgorithm(slug: string) {
  return algorithms.find((algorithm) => algorithm.slug === slug);
}

export function getMlAlgorithmCategories() {
  return Array.from(new Set(algorithms.map((algorithm) => algorithm.category))).sort();
}

export function getMlAlgorithmDifficulties() {
  return Array.from(new Set(algorithms.map((algorithm) => algorithm.difficulty))).sort();
}

export function getMlAlgorithmRelatedCourse(slug: string) {
  return relatedCourseBySlug[slug];
}

export function getMlAlgorithmStats() {
  return {
    algorithms: algorithms.length,
    quizzes: algorithms.reduce((total, algorithm) => total + algorithm.quiz.length, 0),
    categories: getMlAlgorithmCategories().length,
  };
}
