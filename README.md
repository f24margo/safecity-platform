# 🛡️ SafeCity Regional Platform

**Система безпеки малих громад України**  
Версія: **v1.0.0** • Березень 2026

[![Wix](https://img.shields.io/badge/Wix-App-0C6EFC?style=flat&logo=wix)](https://wix.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-16.14-61DAFB?style=flat&logo=react)](https://reactjs.org/)

---

## 📖 Зміст

- [Про проект](#-про-проект)
- [Архітектура](#-архітектура)
- [Що реалізовано](#-що-реалізовано-v100)
- [Що планується](#-що-планується-v110--v200)
- [Встановлення](#-встановлення)
- [Структура проекту](#-структура-проекту)
- [Технології](#-технології)
- [Roadmap](#-roadmap)
- [Ліцензія](#-ліцензія)

---

## 🎯 Про проект

**SafeCity** — регіональна платформа для моніторингу безпеки малих громад України.

### Ключові можливості:
- 🔢 **Security Score** (0-100%) для кожної громади
- 📊 **Dashboard** для менеджера безпеки
- 🚨 **Форма звернень** для жителів (геолокація + фото + опис)
- 📈 **Аналітика** подій та трендів
- 🏆 **Рейтинг громад** по безпеці
- 🌐 **Матриця подій** — 30 типів, 8 категорій (UNDRR/OCHA сумісний)

---

## 🏗️ Архітектура
```
SafeCity Platform
│
├── Dashboard (CRM для менеджера)
│   ├── Analytics    — статистика подій
│   ├── Leaderboard  — рейтинг громад
│   ├── Moderation   — перегляд звернень
│   └── Settings     — налаштування
│
├── Site Widgets (для жителів)
│   ├── Report Widget     — форма звернень
│   └── Custom Elements   — вбудовувані компоненти
│
└── Backend (планується v1.1)
    ├── Wix Data Collections
    ├── Backend Modules
    ├── HTTP Functions (API)
    └── Telegram Webhook
```

---

## ✅ Що реалізовано (v1.0.0)

### **Frontend:**
- ✅ Dashboard з Security Score
- ✅ Переключення громад (Південне, Чорноморськ, Теплодар)
- ✅ KPI метрики (Score, Appeals, Monitoring)
- ✅ Графіки динаміки за тиждень
- ✅ Багатомовність (UA/EN)
- ✅ Report Widget — 3-крокова форма звернень
- ✅ Геолокація та завантаження фото

### **UI/UX:**
- ✅ Темна тема (#0F172A / #1E293B)
- ✅ Адаптивний дизайн
- ✅ Gradient кнопки та картки
- ✅ Прогрес-бари

---

## 🚧 Що планується (v1.1 → v2.0)

### **v1.1.0 — Backend Foundation** ⏳
- [ ] Wix Data Collections (Events, Communities, Users)
- [ ] Backend Modules (Security Score розрахунок)
- [ ] HTTP Functions для API
- [ ] Інтеграція з Матрицею подій v1.0

### **v1.2.0 — Event Matrix Integration** ⏳
- [ ] 30 типів подій (CR01-ML30)
- [ ] 8 категорій (CR, EM, IN, TR, EC, MD, SO, ML)
- [ ] 5 рівнів ризику (×1, ×3, ×7, ×15, ×30)
- [ ] Формула Security Score

### **v1.3.0 — Telegram Bot** ⏳
- [ ] Webhook endpoint
- [ ] AI-автокласифікація подій
- [ ] Збереження в Wix Data

### **v2.0.0 — AI & Automation** 🔮
- [ ] OpenAI класифікатор
- [ ] OSINT моніторинг
- [ ] Інтеграція з офіційними службами (Поліція, ДСНС, МОЗ)
- [ ] Real-time Security Score

---

## 🚀 Встановлення

### Вимоги:
- Node.js v18+
- npm v10+
- Wix CLI v1.1.167+

### Крок 1: Клонування
```bash
git clone https://github.com/your-username/safecity-platform.git
cd safecity-platform
```

### Крок 2: Встановлення залежностей
```bash
npm install
```

### Крок 3: Запуск dev-сервера
```bash
npm run dev
```

### Крок 4: Білд проекту
```bash
npm run build
```

---

## 📂 Структура проекту
```
security-manager-crm/
│
├── src/
│   ├── dashboard/              # Dashboard для менеджера
│   │   ├── pages/
│   │   │   ├── page.tsx        # Головна сторінка
│   │   │   ├── analytics/      # Аналітика
│   │   │   ├── leaderboard/    # Рейтинг
│   │   │   ├── moderation/     # Модерація
│   │   │   └── settings/       # Налаштування
│   │   ├── components/         # UI компоненти
│   │   ├── hooks/              # React hooks
│   │   └── withProviders.tsx   # Context providers
│   │
│   ├── site/                   # Публічні віджети
│   │   └── widgets/
│   │       ├── report-widget/         # Форма звернень
│   │       └── custom-elements/       # Кастомні елементи
│   │
│   └── assets/                 # Статичні файли
│
├── backend/                    # (планується v1.1)
│   ├── *.jsw                   # Backend модулі
│   └── http-functions.js       # API endpoints
│
├── package.json
├── tsconfig.json
├── wix.config.json
└── README.md
```

---

## 🛠️ Технології

### **Frontend:**
- React 16.14
- TypeScript 5.3
- Wix SDK (@wix/crm, @wix/data, @wix/dashboard)

### **Backend:**
- Wix Velo (планується)
- Wix Data (планується)
- HTTP Functions (планується)

### **Майбутнє:**
- OpenAI API (v2.0)
- Telegram Bot API (v1.3)

---

## 🗺️ Roadmap

| Версія | Статус | Функціонал | ETA |
|--------|--------|-----------|-----|
| **v1.0.0** | ✅ **Released** | Dashboard + Report Widget | Березень 2026 |
| **v1.1.0** | ⏳ In Progress | Backend + Wix Data | Квітень 2026 |
| **v1.2.0** | 📋 Planned | Матриця подій (30 типів) | Травень 2026 |
| **v1.3.0** | 📋 Planned | Telegram Bot + Webhook | Червень 2026 |
| **v2.0.0** | 🔮 Future | AI класифікатор + OSINT | Q3 2026 |

---

## 📄 Документація

- [Матриця подій v1.0](./docs/EVENT_MATRIX.md) — 30 типів подій
- [API Documentation](./docs/API.md) — (планується)
- [Architecture](./docs/ARCHITECTURE.md) — (планується)

---

## 📜 Ліцензія

Open Source — вільне використання громадами України  
**Сумісно з:** UNDRR / OCHA / Sendai Framework 2015-2030

---

## 👥 Автори

**SafeCity Team**  
GitHub: [safecity-ua](https://github.com/safecity-ua) *(планується)*

---

## 🤝 Внесок

Ми вітаємо внесок від громади!

1. Fork проект
2. Створи feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрий Pull Request

---

**Built with ❤️ for Ukrainian communities**
