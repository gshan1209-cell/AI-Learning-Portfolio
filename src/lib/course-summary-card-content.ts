import type { Course } from "@/types/course";

export interface SummaryCardItem {
  title: string;
  detail: string;
}

export interface CourseSummaryCardContent {
  title: string;
  subtitle: string;
  speech: string;
  process: SummaryCardItem[];
  capabilities: string[];
  keyPhrase: string;
  keyNote: string;
  examples: SummaryCardItem[];
  learnings: string[];
  tools: string[];
  footerFormula: string;
  footerNote: string;
}

export const COURSE_SUMMARY_CARD_CONTENT: Record<
  string,
  CourseSummaryCardContent
> = {
  "linear-regression-for-beginners": {
    title: "什麼是線性迴歸？",
    subtitle: "用一條線看懂資料趨勢與預測",
    speech: "線性迴歸會從資料中找出最合理的趨勢線，幫助我們做預測！",
    process: [
      { title: "資料", detail: "收集數值資料" },
      { title: "找趨勢線", detail: "找出整體方向" },
      { title: "做預測", detail: "估計新的結果" },
    ],
    capabilities: ["從資料中找趨勢", "理解變數之間的關係", "做出預測與判斷"],
    keyPhrase: "給資料，找直線",
    keyNote: "讓模型找出最能代表整體資料趨勢的線。",
    examples: [
      { title: "廣告費增加", detail: "營收可能上升" },
      { title: "坪數越大", detail: "房價通常越高" },
      { title: "溫度變化", detail: "用電量可能改變" },
    ],
    learnings: ["斜率：變化方向與快慢", "截距：起始位置", "殘差：實際值與預測值的差距", "離群值：偏離趨勢的資料"],
    tools: ["Python", "scikit-learn", "Streamlit", "Matplotlib"],
    footerFormula: "線性迴歸 = 資料 → 趨勢線 → 預測",
    footerNote: "先看懂資料方向，再做更聰明的預測！",
  },
  "svm-kernel-trick-3d": {
    title: "什麼是 SVM Kernel Trick？",
    subtitle: "當直線分不開資料，就換個空間看",
    speech: "SVM 會把資料換到更好分開的空間，再找到最清楚的分隔邊界！",
    process: [
      { title: "看資料", detail: "先看到 2D 上分不開" },
      { title: "換空間", detail: "進行特徵映射" },
      { title: "找邊界", detail: "分出不同類別" },
    ],
    capabilities: ["處理線性不可分問題", "建立清楚的分類邊界", "用參數調整模型彈性"],
    keyPhrase: "換空間，好分開",
    keyNote: "原本分不開的資料，換個角度後就可能被清楚分類。",
    examples: [
      { title: "圓圈內外分類", detail: "普通直線很難分" },
      { title: "手寫數字辨識", detail: "找出不同數字邊界" },
      { title: "瑕疵檢測", detail: "區分正常與異常" },
    ],
    learnings: ["線性不可分：為什麼直線不夠", "特徵映射：資料如何變成立體", "C 與 gamma：邊界的彈性", "過擬合：邊界太複雜的風險"],
    tools: ["Python", "Manim", "Plotly", "Streamlit"],
    footerFormula: "SVM = 資料 → 換空間 → 分類",
    footerNote: "看懂資料邊界，才能做出更準確的分類！",
  },
  "cwa-open-data-first-api": {
    title: "什麼是政府資料 API？",
    subtitle: "從網址、參數到 JSON，向資料櫃台拿資料",
    speech: "API 就像資料櫃台，只要帶對參數與金鑰，就能拿到最新資料！",
    process: [
      { title: "準備金鑰", detail: "取得 API Key" },
      { title: "送出請求", detail: "帶網址與參數" },
      { title: "拿到資料", detail: "回傳 JSON 或 XML" },
    ],
    capabilities: ["理解網址與查詢參數", "安全保存 API Key", "下載並整理資料內容"],
    keyPhrase: "給參數，拿資料",
    keyNote: "API 讓程式用標準方式，自動取得最新資訊。",
    examples: [
      { title: "天氣查詢", detail: "取得最新預報" },
      { title: "空氣品質", detail: "顯示各地指標" },
      { title: "地震資訊", detail: "快速更新資料" },
    ],
    learnings: ["API Key：驗證使用者身分", "Query 參數：控制資料範圍", "JSON／XML：常見資料格式", "環境變數：避免金鑰寫死"],
    tools: ["Python", "requests", "JSON", "CLI"],
    footerFormula: "API = 金鑰 → 請求 → 資料",
    footerNote: "先學會怎麼問，才能自動取得正確資料！",
  },
  "ml-top-10-algorithms": {
    title: "什麼是機器學習前十大演算法？",
    subtitle: "先懂問題，再選出適合的模型",
    speech: "不同演算法像不同工具，重點不是背名字，而是知道什麼問題該用什麼方法！",
    process: [
      { title: "看問題", detail: "分類、回歸或分群" },
      { title: "認識模型", detail: "了解演算法特色" },
      { title: "比較應用", detail: "選出適合的方法" },
    ],
    capabilities: ["快速建立演算法地圖", "知道常見模型用途", "理解模型之間的差異"],
    keyPhrase: "先懂問題，再選模型",
    keyNote: "演算法沒有萬能冠軍，重點是對應資料與任務需求。",
    examples: [
      { title: "房價預測", detail: "使用回歸模型" },
      { title: "垃圾郵件判斷", detail: "使用分類模型" },
      { title: "客群分析", detail: "使用分群模型" },
    ],
    learnings: ["線性迴歸：看趨勢與預測", "決策樹：用規則做判斷", "KNN：看誰最像誰", "SVM：建立清楚邊界"],
    tools: ["Next.js", "Python", "Quiz", "Machine Learning"],
    footerFormula: "演算法 = 問題類型 → 模型選擇 → 應用",
    footerNote: "先建立全局地圖，學演算法才不會亂！",
  },
  "crisp-dm-regression": {
    title: "什麼是 CRISP-DM？",
    subtitle: "從商業問題一路走到模型部署",
    speech: "做資料科學不只是在訓練模型，而是要從問題、資料到結果一路串起來！",
    process: [
      { title: "懂問題", detail: "先確認商業目標" },
      { title: "看資料", detail: "整理與理解資料" },
      { title: "建模型", detail: "評估並部署結果" },
    ],
    capabilities: ["用流程管理資料專案", "避免只顧模型忽略需求", "反覆驗證並持續改善"],
    keyPhrase: "先懂問題，再做模型",
    keyNote: "好的資料科學流程，要讓模型真正解決實際問題。",
    examples: [
      { title: "營收預測", detail: "先定義想改善什麼" },
      { title: "房價分析", detail: "先理解資料來源" },
      { title: "風險評估", detail: "先看結果如何落地" },
    ],
    learnings: ["Business Understanding：釐清需求", "Data Preparation：清洗與整理", "Modeling：建模與調參", "Evaluation／Deployment：驗證上線"],
    tools: ["Python", "FastAPI", "Optuna", "Dashboard"],
    footerFormula: "CRISP-DM = 問題 → 資料 → 模型",
    footerNote: "流程清楚，模型成果才真正有價值！",
  },
  "startup-profit-prediction": {
    title: "什麼是利潤預測模型？",
    subtitle: "用 Random Forest 找出影響獲利的關鍵",
    speech: "把公司的研發、行銷與管理成本交給模型，就能估出可能的利潤方向！",
    process: [
      { title: "整理資料", detail: "讀取 50 Startups" },
      { title: "訓練模型", detail: "建立 Random Forest" },
      { title: "做預測", detail: "估計新創利潤" },
    ],
    capabilities: ["處理多個成本變數", "學習非線性關係", "比較不同模型表現"],
    keyPhrase: "給公司資料，估未來利潤",
    keyNote: "模型從歷史資料學習，找出哪些因素最影響獲利。",
    examples: [
      { title: "研發費增加", detail: "利潤可能改變" },
      { title: "行銷費調整", detail: "營收表現不同" },
      { title: "不同州別", detail: "經營結果可能有差異" },
    ],
    learnings: ["Random Forest：多樹投票預測", "Pipeline：整理流程更穩定", "特徵工程：欄位如何影響結果", "MAE／RMSE：評估模型好壞"],
    tools: ["Python", "scikit-learn", "Streamlit", "Random Forest"],
    footerFormula: "利潤預測 = 公司資料 → 模型學習 → 結果估計",
    footerNote: "先看懂影響因子，才能做出更好的商業判斷！",
  },
  "stock-manim-animation": {
    title: "什麼是技術分析動畫？",
    subtitle: "用動畫看懂 K 線、均線與支撐壓力",
    speech: "把原本難懂的股價圖動起來，就更容易看懂趨勢、訊號與風險！",
    process: [
      { title: "看 K 線", detail: "理解價格漲跌" },
      { title: "看指標", detail: "加入均線與成交量" },
      { title: "看訊號", detail: "理解支撐壓力" },
    ],
    capabilities: ["用動畫說明抽象概念", "看懂價格與成交量變化", "建立技術分析直覺"],
    keyPhrase: "把走勢畫活，更快看懂",
    keyNote: "動態視覺化幫助新手理解圖表，不只死背名詞。",
    examples: [
      { title: "黃金交叉", detail: "趨勢可能轉強" },
      { title: "支撐反彈", detail: "價格可能止跌" },
      { title: "爆量變化", detail: "市場情緒升高" },
    ],
    learnings: ["K 線：一天的價格資訊", "均線：看整體趨勢方向", "成交量：觀察市場熱度", "支撐壓力：判斷可能轉折"],
    tools: ["Python", "Manim", "Charts", "Animation"],
    footerFormula: "技術分析 = 價格 → 指標 → 判讀",
    footerNote: "看懂圖形語言，才知道市場可能在說什麼！",
  },
  "boston-feature-selection": {
    title: "什麼是特徵選擇？",
    subtitle: "比較九種方法，找出最有用的欄位",
    speech: "不是欄位越多越好，好的模型要知道哪些資訊真正有幫助！",
    process: [
      { title: "準備欄位", detail: "先整理房價資料" },
      { title: "比較方法", detail: "評估欄位重要性" },
      { title: "建模驗證", detail: "看哪組表現更好" },
    ],
    capabilities: ["刪除雜訊與多餘欄位", "提升模型可解釋性", "比較不同選擇方法差異"],
    keyPhrase: "不是欄位越多越好",
    keyNote: "找出真正重要的特徵，模型更簡潔，也可能更準確。",
    examples: [
      { title: "房價預測", detail: "找最關鍵條件" },
      { title: "醫療判斷", detail: "篩出重要變數" },
      { title: "問卷分析", detail: "留下代表性題目" },
    ],
    learnings: ["Pearson：看線性相關", "Mutual Info：看資訊量", "RFE：反覆挑選特徵", "Ethical Mode：避開敏感欄位"],
    tools: ["Python", "scikit-learn", "Feature Ranking", "Regression"],
    footerFormula: "特徵選擇 = 全部欄位 → 篩重點 → 更好模型",
    footerNote: "先選對資訊，模型學習才更有效率！",
  },
  "cosmos-text-to-image": {
    title: "什麼是文字生成圖片？",
    subtitle: "輸入提示詞，讓 AI 畫出想像中的畫面",
    speech: "只要寫下想像的內容，生成式 AI 就能幫你把文字變成圖片！",
    process: [
      { title: "輸入描述", detail: "寫下提示詞" },
      { title: "模型生成", detail: "AI 根據文字作畫" },
      { title: "展示結果", detail: "查看與調整圖片" },
    ],
    capabilities: ["用提示詞控制畫面方向", "呼叫模型產生內容", "處理展示與備援模式"],
    keyPhrase: "給描述，出圖片",
    keyNote: "提示詞越清楚，生成結果通常越接近想要的畫面。",
    examples: [
      { title: "海報設計", detail: "快速產生概念圖" },
      { title: "角色設定", detail: "生成視覺草圖" },
      { title: "商品示意", detail: "做出展示圖片" },
    ],
    learnings: ["Prompt：如何寫清楚需求", "API 呼叫：串接生成服務", "圖片展示：呈現生成結果", "錯誤備援：服務失敗時怎麼辦"],
    tools: ["Hugging Face", "Streamlit", "Python", "Prompt"],
    footerFormula: "文生圖 = 提示詞 → 模型生成 → 視覺結果",
    footerNote: "先說清楚想像，AI 才畫得更接近期望！",
  },
  "movie-scraper-nextjs": {
    title: "什麼是電影資料收集工作台？",
    subtitle: "爬蟲、API、篩選與分頁一次學會",
    speech: "先把電影資料收進來，再整理成好搜尋、好瀏覽的網站，就是這堂課的重點！",
    process: [
      { title: "取得資料", detail: "爬蟲或 API 收集" },
      { title: "整理資料", detail: "清洗欄位並整合" },
      { title: "前端展示", detail: "搜尋、篩選與分頁" },
    ],
    capabilities: ["整合多來源電影資訊", "建立搜尋與篩選功能", "用網站清楚展示結果"],
    keyPhrase: "先收集，再整理，再展示",
    keyNote: "資料取得只是第一步，真正價值在整理後讓人好使用。",
    examples: [
      { title: "找熱門電影", detail: "快速瀏覽榜單" },
      { title: "依類型篩選", detail: "找到想看的片" },
      { title: "查看評分", detail: "比較不同作品" },
    ],
    learnings: ["Crawler：抓取外部資料", "REST API：取得標準化內容", "Next.js：建立前端介面", "Pagination：資料太多怎麼分頁"],
    tools: ["Next.js", "Crawler", "REST API", "Filters"],
    footerFormula: "電影工作台 = 收資料 → 整理 → 搜尋展示",
    footerNote: "資料整理得越好，網站體驗就越順手！",
  },
  "agri-weather-dashboard": {
    title: "什麼是農事天氣儀表板？",
    subtitle: "把 OpenData 變成農民看得懂的天氣與風險提醒",
    speech: "把天氣資料整理成農民一眼看懂的提醒，才是真正有用的儀表板！",
    process: [
      { title: "取得資料", detail: "抓取 CWA OpenData" },
      { title: "整理資訊", detail: "整合地圖、預報與風險" },
      { title: "顯示提醒", detail: "做成決策儀表板" },
    ],
    capabilities: ["整合天氣與農事資訊", "用地圖呈現區域風險", "提供實用決策提醒"],
    keyPhrase: "先看天氣，再做農事決策",
    keyNote: "資料不是只拿來看，而是要轉成可行動的提醒。",
    examples: [
      { title: "降雨機率高", detail: "提前防積水" },
      { title: "高溫來襲", detail: "注意作物熱害" },
      { title: "強風警示", detail: "安排防護措施" },
    ],
    learnings: ["CWA OpenData", "農事風險提示", "Leaflet 地圖", "前後端資料整合"],
    tools: ["Next.js", "FastAPI", "Leaflet", "OpenData"],
    footerFormula: "農事天氣儀表板 = 天氣資料 → 風險整理 → 行動提醒",
    footerNote: "先看懂天氣風險，農事判斷才更安心！",
  },
  "django-blog-basics": {
    title: "什麼是 Django Blog 入門？",
    subtitle: "從虛擬環境到後台管理，理解 Django 網站基礎",
    speech: "Django 最厲害的地方，就是幫你快速搭好網站骨架與後台管理！",
    process: [
      { title: "建立專案", detail: "安裝 Django 與虛擬環境" },
      { title: "建立功能", detail: "models、views、templates" },
      { title: "管理內容", detail: "admin 與 migration" },
    ],
    capabilities: ["理解 Django 專案結構", "學會 Migration 與資料庫操作", "使用 Admin 後台管理內容"],
    keyPhrase: "先建架構，再做內容",
    keyNote: "Django 幫你準備網站骨架，讓你專注在功能與內容。",
    examples: [
      { title: "部落格文章管理", detail: "後台新增與編輯" },
      { title: "留言或頁面內容", detail: "透過模型儲存" },
      { title: "網站首頁", detail: "用 template 呈現資料" },
    ],
    learnings: ["虛擬環境", "Migration", "Django Admin", "Template 與 Routing"],
    tools: ["Python", "Django", "SQLite", "Admin"],
    footerFormula: "Django Blog = 專案架構 → 資料模型 → 網站管理",
    footerNote: "先打好基礎，網站開發才會更順！",
  },
  "ensemble-income-predictor": {
    title: "什麼是 Ensemble 收入分類模型？",
    subtitle: "從模型比較到公平性提醒，建立可部署的分類網站",
    speech: "好的分類模型不只要會預測，還要知道怎麼降低偏差與風險！",
    process: [
      { title: "整理資料", detail: "處理 Adult Income 資料" },
      { title: "比較模型", detail: "多模型集成與分類" },
      { title: "輸出結果", detail: "預測收入類別" },
    ],
    capabilities: ["比較多種分類模型", "用集成方法提升穩定度", "加入公平性與 Responsible AI"],
    keyPhrase: "不只要準，還要更公平",
    keyNote: "分類模型除了追求準確率，也要注意偏差與風險。",
    examples: [
      { title: "收入分類", detail: "預測是否高收入" },
      { title: "履歷或背景資料", detail: "可能影響模型判斷" },
      { title: "公平性檢查", detail: "避免敏感欄位偏誤" },
    ],
    learnings: ["Ensemble", "Classification", "Fairness", "模型評估"],
    tools: ["Python", "scikit-learn", "Classification", "Fairness"],
    footerFormula: "Ensemble 分類 = 資料整理 → 模型集成 → 公平判斷",
    footerNote: "先顧準確，也顧公平，AI 才更值得信任！",
  },
  "ai-visual-story": {
    title: "什麼是 AI 圖文故事播放器？",
    subtitle: "從生成素材到前端展示，做出會說故事的圖文體驗",
    speech: "把圖片、文字與閱讀流程整合起來，就能做出更有沉浸感的故事體驗！",
    process: [
      { title: "準備素材", detail: "圖片、文字與故事段落" },
      { title: "排版展示", detail: "做成播放器介面" },
      { title: "呈現內容", detail: "依順序閱讀與播放" },
    ],
    capabilities: ["整合圖片與文字敘事", "建立前端互動展示", "把創作素材做成完整作品"],
    keyPhrase: "先有故事，再做展示",
    keyNote: "好的圖文作品不只要漂亮，也要讓讀者容易跟著情節走。",
    examples: [
      { title: "小說角色插圖", detail: "強化閱讀想像" },
      { title: "章節播放器", detail: "依段落切換內容" },
      { title: "靜態展示頁", detail: "做成作品集網站" },
    ],
    learnings: ["Story Layout", "AI Image", "Static Web", "圖文敘事"],
    tools: ["HTML／CSS", "GitHub Pages", "AI Image", "Story Player"],
    footerFormula: "AI 圖文故事 = 故事素材 → 視覺排版 → 閱讀體驗",
    footerNote: "先整理好故事節奏，作品展示才更有魅力！",
  },
};

function makeFallbackContent(course: Course): CourseSummaryCardContent {
  const highlights =
    course.learningObjectives.length > 0
      ? course.learningObjectives.slice(0, 4)
      : course.sections.length > 0
        ? course.sections.slice(0, 4).map((section) => section.title)
        : course.tags.slice(0, 4);

  return {
    title: course.title,
    subtitle: course.subtitle,
    speech: course.summary,
    process: [
      { title: "先理解", detail: course.category },
      { title: "再操作", detail: course.tags.slice(0, 2).join("、") },
      { title: "能應用", detail: `約 ${course.durationMinutes} 分鐘` },
    ],
    capabilities: highlights.slice(0, 3),
    keyPhrase: course.title,
    keyNote: course.summary,
    examples: highlights.slice(0, 3).map((highlight) => ({
      title: highlight,
      detail: "課程重點應用",
    })),
    learnings: highlights,
    tools: course.tags.slice(0, 4),
    footerFormula: `${course.title} = 理解 → 操作 → 應用`,
    footerNote: course.subtitle,
  };
}

export function getCourseSummaryCardContent(
  course: Course,
): CourseSummaryCardContent {
  return COURSE_SUMMARY_CARD_CONTENT[course.slug] ?? makeFallbackContent(course);
}
