<div align="center">

# 🚀 2026-DjangoBlog

> **一個基於 Django 架構打造的高效、簡潔部落格系統**

</div>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/gshan1209-cell/2026-DjangoBlog?style=for-the-badge&color=blue)](https://github.com/gshan1209-cell/2026-DjangoBlog/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-%E6%AD%A1%E8%BF%8E%E6%8F%90%E4%BA%A4-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Stars](https://img.shields.io/github/stars/gshan1209-cell/2026-DjangoBlog?style=for-the-badge&color=gold)](https://github.com/gshan1209-cell/2026-DjangoBlog/stargazers)

</div>

---

> **🤖 Antigravity AI Agent 提示**
>
> 本 `README.md` 由 **Antigravity IDE AI Agent** 自動構建與維護。內容直接同步自專案程式碼與結構元資料，確保提供最新且精準的安裝指南與架構資訊。

---

## 📌 目錄

- [📖 關於專案](#-關於專案)
- [✨ 主要功能](#-主要功能)
- [🛠️ 核心技術棧](#️-核心技術棧)
- [📁 專案結構](#-專案結構)
- [🚀 快速開始](#-快速開始)
  - [前置需求](#前置需求)
  - [安裝與啟動步驟](#安裝與啟動步驟)
- [🤝 貢獻指南](#-貢獻指南)
- [📄 開源協議](#-開源協議)

---

## 📖 關於專案

`2026-DjangoBlog` 是一個輕量級且全功能的 Django 部落格應用程式。專案具備完整文章管理、靜態頁面渲染與模板系統，適合個人部落格展示、技術文章發表或作為 Django MVC 模式學習的範例。

---

## ✨ 主要功能

- ⚡ **高效文章管理**：支援 Django Admin 後台對文章進行新增、編輯與刪除。
- 🎨 **現代化樣式**：基於模板 HTML 渲染，提供清晰俐落的文章列表與單篇文章瀏覽體驗。
- 🔒 **資料庫整合**：支援預設 SQLite 資料庫開箱即用，方便快速部署開發。

---

## 🛠️ 核心技術棧

| 類別 | 技術標籤 |
| :--- | :--- |
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white) |
| **Database** | ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) |

---

## 📁 專案結構

```
2026-DjangoBlog/
├── DjangoBlog/          # Django 專案核心設定目錄
│   ├── settings.py      # 全局設定檔
│   ├── urls.py          # 全局路由入口
│   ├── wsgi.py          # WSGI 伺服器設定
│   └── asgi.py          # ASGI 伺服器設定
├── article/             # 文章模組 (App)
│   ├── models.py        # 文章資料模型定義
│   ├── views.py         # 視圖邏輯與頁面渲染
│   ├── admin.py         # 後台管理註冊
│   └── apps.py          # App 設定檔
├── templates/           # 前端 HTML 模板目錄
├── documents/           # 文件資源與範例說明
├── manage.py            # Django 命令行管理工具
├── requirements.txt     # Python 專案依賴套件列表
└── README.md            # 專案說明文件
```

---

## 🚀 快速開始

### 前置需求

請確保環境已安裝以下基礎工具：
- Python 3.10+
- Git

### 安裝與啟動步驟

1. **克隆專案庫**
   ```bash
   git clone https://github.com/gshan1209-cell/2026-DjangoBlog.git
   cd 2026-DjangoBlog
   ```

2. **建立並啟用虛擬環境**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **安裝依賴套件**
   ```bash
   pip install -r requirements.txt
   ```

4. **執行資料庫遷移與啟動開發伺服器**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   啟動成功後，可在瀏覽器存取 `http://127.0.0.1:8000/`。

---

## 🤝 貢獻指南

歡迎提交 PR 或 Issue 來改善專案內容！

---

## 📄 開源協議

本專案採用 [MIT License](LICENSE) 授權。
