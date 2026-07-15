import rawAlgorithms from "../data/algorithms.json";
import type { Algorithm, DisplayAlgorithm } from "./types";

const summaries: Record<string, string> = {
  "linear-regression": "用一條直線描述輸入與連續數值之間的關係，常用於預測價格、分數或趨勢。",
  "logistic-regression": "把特徵轉成機率，適合回答是/否、會/不會、通過/不通過這類分類問題。",
  "decision-tree": "用一連串像流程圖一樣的條件分支做判斷，優點是容易解釋。",
  "random-forest": "訓練很多棵決策樹，再用投票或平均得到更穩定的預測。",
  svm: "找出能把類別分開且間隔最大的邊界，對中小型分類任務很有用。",
  knn: "看新資料附近的鄰居多數屬於哪一類，再決定它的預測結果。",
  kmeans: "在沒有標籤的情況下，把相似資料自動分成 K 群。",
  "naive-bayes": "用機率快速分類，常見於垃圾郵件、文字分類與情緒分析。",
  pca: "把高維資料投影到較少維度，同時保留主要變異，方便視覺化與降維。",
  "gradient-descent": "一步步沿著誤差下降的方向調整參數，是許多模型訓練的核心方法。",
};

const details: Record<string, Partial<DisplayAlgorithm>> = {
  "linear-regression": {
    displayCategory: "監督式學習 / 回歸",
    displayDifficulty: "入門",
    cleanAnalogy: "像在散點圖上畫一條最能代表整體趨勢的線。",
    cleanHowItWorks: ["收集輸入特徵與目標數值。", "找出讓預測誤差最小的直線。", "用這條線預測新資料的數值。"],
    cleanUseCases: ["房價預測", "銷售額預估", "分數與成績趨勢分析"],
    cleanPros: ["容易理解", "訓練速度快", "適合作為回歸基準模型"],
    cleanCons: ["不擅長複雜非線性關係", "容易受離群值影響", "需要檢查特徵尺度與關聯性"],
  },
  "logistic-regression": {
    displayCategory: "監督式學習 / 分類",
    displayDifficulty: "入門",
    cleanAnalogy: "像把風險分數轉成一個介於 0 到 1 的機率。",
    cleanHowItWorks: ["計算特徵的加權分數。", "用 sigmoid 函數轉成機率。", "設定門檻後輸出類別。"],
    cleanUseCases: ["是否流失", "是否詐欺", "是否錄取"],
    cleanPros: ["輸出可解釋機率", "適合二元分類", "訓練快速"],
    cleanCons: ["線性邊界限制", "特徵工程很重要", "對複雜模式表現有限"],
  },
  "decision-tree": {
    displayCategory: "監督式學習 / 分類與回歸",
    displayDifficulty: "入門",
    cleanAnalogy: "像問答式流程圖，每個問題都把資料切得更清楚。",
    cleanHowItWorks: ["挑選最能分開資料的特徵。", "建立分支並持續切分。", "在葉節點輸出預測。"],
    cleanUseCases: ["規則決策", "信用審核", "客戶分群解釋"],
    cleanPros: ["容易視覺化", "可處理非線性", "不太需要特徵縮放"],
    cleanCons: ["容易過度擬合", "小變動可能造成樹大變", "單棵樹準確度可能不穩"],
  },
  "random-forest": {
    displayCategory: "集成學習",
    displayDifficulty: "中等",
    cleanAnalogy: "像讓一群決策樹一起投票，降低單一判斷的偏差。",
    cleanHowItWorks: ["抽樣建立多份資料。", "訓練多棵不同決策樹。", "彙整投票或平均結果。"],
    cleanUseCases: ["表格資料預測", "特徵重要性分析", "風險評分"],
    cleanPros: ["表現穩定", "不易過度擬合", "可估計特徵重要性"],
    cleanCons: ["較難完整解釋", "模型體積較大", "訓練與推論成本較高"],
  },
  svm: {
    displayCategory: "監督式學習 / 分類",
    displayDifficulty: "中等",
    cleanAnalogy: "像在兩群資料中間放一條最寬的分隔線。",
    cleanHowItWorks: ["尋找分類邊界。", "最大化邊界到樣本的距離。", "可用 kernel 處理非線性資料。"],
    cleanUseCases: ["文字分類", "影像分類", "中小型高維資料"],
    cleanPros: ["高維資料常有好表現", "邊界概念清楚", "kernel 彈性高"],
    cleanCons: ["大型資料訓練慢", "參數調整較敏感", "機率解釋不直覺"],
  },
  knn: {
    displayCategory: "監督式學習 / 分類與回歸",
    displayDifficulty: "入門",
    cleanAnalogy: "像問你身邊最近的幾位鄰居，多數人怎麼判斷就跟著判斷。",
    cleanHowItWorks: ["計算新資料與訓練資料的距離。", "找出最近的 K 個鄰居。", "用投票或平均得到預測。"],
    cleanUseCases: ["推薦系統入門", "簡單分類", "相似案例查找"],
    cleanPros: ["概念簡單", "不需明確訓練階段", "適合小型資料"],
    cleanCons: ["推論可能很慢", "特徵尺度影響大", "高維資料效果下降"],
  },
  kmeans: {
    displayCategory: "非監督式學習 / 分群",
    displayDifficulty: "中等",
    cleanAnalogy: "像把地圖上的點分給最近的 K 個中心。",
    cleanHowItWorks: ["先放置 K 個群中心。", "把資料分配到最近中心。", "更新中心並重複直到穩定。"],
    cleanUseCases: ["客戶分群", "圖片顏色量化", "探索資料結構"],
    cleanPros: ["速度快", "容易實作", "適合球狀群集"],
    cleanCons: ["要先決定 K", "受初始中心影響", "不適合形狀複雜的群"],
  },
  "naive-bayes": {
    displayCategory: "監督式學習 / 機率分類",
    displayDifficulty: "入門",
    cleanAnalogy: "像根據關鍵線索快速估算某事件最可能屬於哪一類。",
    cleanHowItWorks: ["計算每類出現機率。", "估計特徵在各類中的機率。", "用貝氏定理選最大機率類別。"],
    cleanUseCases: ["垃圾郵件偵測", "新聞分類", "情緒分析"],
    cleanPros: ["非常快速", "小資料也能用", "文字任務常表現不錯"],
    cleanCons: ["獨立假設很強", "特徵相關時可能失準", "機率校準不一定好"],
  },
  pca: {
    displayCategory: "非監督式學習 / 降維",
    displayDifficulty: "中等",
    cleanAnalogy: "像把立體物件投影到平面，保留最有資訊量的角度。",
    cleanHowItWorks: ["標準化資料。", "找出變異最大的方向。", "把資料投影到主要成分上。"],
    cleanUseCases: ["資料視覺化", "降維加速", "雜訊壓縮"],
    cleanPros: ["降低維度", "減少共線性", "方便視覺化"],
    cleanCons: ["成分較難解釋", "只捕捉線性結構", "需要特徵縮放"],
  },
  "gradient-descent": {
    displayCategory: "最佳化方法",
    displayDifficulty: "中等",
    cleanAnalogy: "像在山坡上一步步往最低點走，找到讓錯誤最小的位置。",
    cleanHowItWorks: ["計算目前誤差。", "求出誤差對參數的梯度。", "沿反方向更新參數並重複。"],
    cleanUseCases: ["神經網路訓練", "線性模型最佳化", "大型模型參數更新"],
    cleanPros: ["可擴展到大型問題", "是深度學習核心", "概念通用"],
    cleanCons: ["學習率很重要", "可能卡在局部低點", "需要多次迭代"],
  },
};

const brokenPattern = /[?�]/g;

function cleanText(value: unknown, fallback: string) {
  if (typeof value !== "string" || value.trim().length === 0) return fallback;
  const broken = value.match(brokenPattern)?.length ?? 0;
  return broken > Math.max(2, value.length / 8) ? fallback : value;
}

export function normalizeAlgorithm(algorithm: Algorithm): DisplayAlgorithm {
  const extra = details[algorithm.slug] ?? {};
  return {
    ...algorithm,
    displayName: algorithm.name_en || cleanText(algorithm.name_zh, "Algorithm"),
    displayCategory: extra.displayCategory ?? cleanText(algorithm.category, "Machine Learning"),
    displayDifficulty: extra.displayDifficulty ?? cleanText(algorithm.difficulty, "Core"),
    summary: summaries[algorithm.slug] ?? cleanText(algorithm.one_liner, "Open this algorithm to review its notes."),
    cleanDescription: extra.cleanDescription ?? summaries[algorithm.slug] ?? cleanText(algorithm.description, "Study note unavailable."),
    cleanAnalogy: extra.cleanAnalogy ?? cleanText(algorithm.analogy, "Think of it as a pattern-finding tool."),
    cleanHowItWorks: extra.cleanHowItWorks ?? ["Read the data.", "Learn a useful pattern.", "Apply that pattern to new examples."],
    cleanUseCases: extra.cleanUseCases ?? ["Prediction", "Analysis", "Decision support"],
    cleanPros: extra.cleanPros ?? ["Useful baseline", "Widely taught", "Practical in real projects"],
    cleanCons: extra.cleanCons ?? ["Needs correct assumptions", "Needs validation", "Can fail on unsuitable data"],
    cleanMistakes: extra.cleanMistakes ?? ["Skipping validation", "Ignoring data leakage", "Not checking assumptions"],
  };
}

export function getAlgorithms() {
  return (rawAlgorithms as Algorithm[]).map(normalizeAlgorithm);
}

export function getAlgorithm(slug: string) {
  return getAlgorithms().find((algorithm) => algorithm.slug === slug);
}
