# �� Telegram интеграция через Make.com

**Статус:** ✅ Работает (базовая версия v1.0)  
**Дата:** 19 марта 2026

---

## 📊 Архитектура
```
Wix Site (HTML Widget)
       ↓
   Velo Code
       ↓
  Wix Data (Incidents)
       ↓
   Webhook (Make.com)
       ↓
  Telegram Bot
       ↓
 Group Chat (-1002147235435)
```

---

## 🔧 Компоненты

### 1. HTML Виджет
- **Файл:** `public/report-widget.html`
- **Функции:**
  - 3-шаговая форма
  - GPS геолокация
  - Выбор громады (Південне, Чорноморськ, Теплодар)
  - Описание события

### 2. Wix Velo
- **Коллекция:** `Incidents`
- **Поля:**
  - `title` — опис події
  - `latitude`, `longitude` — GPS
  - `address` — адреса
  - `zone` — громада
  - `reportedBy` — email автора
  - `createdDate` — дата
  - `status` — статус (pending/resolved)
  - `source` — джерело (public_form)

### 3. Make.com Webhook
- **URL:** `https://hook.eu2.make.com/m8w7xc9g151193pekrfghjms7tlbvuvu`
- **Метод:** POST
- **Формат:** JSON

### 4. Telegram Bot
- **Connection:** My_telegram
- **Chat ID:** `-1002147235435`
- **Текст повідомлення:**
```
1. zone
1. title
1. _publishStatus
1. reportedBy
```

---

## ✅ Що працює

- ✅ Звернення з сайту зберігаються в Wix Data
- ✅ Webhook відправляє дані в Make.com
- ✅ Telegram бот публікує в груповий чат
- ✅ Архів звернень на Wix сайті

---

## ❌ Що НЕ реалізовано

- ❌ AI-класифікація подій (OpenAI)
- ❌ Матриця подій (CR01-ML30)
- ❌ Розрахунок Security Score
- ❌ Рівні ризику (1-5)
- ❌ Двостороння комунікація (бот → Wix)

---

## 🚀 План покращень (v1.3.1)

### Додати в Make.com:
1. **OpenAI модуль** — класифікація тексту
2. **Router** — розподіл по категоріях
3. **Data Store** — збереження статистики
4. **HTTP Module** — оновлення Score в Wix

### Приклад flow з AI:
```
Webhook
   ↓
OpenAI (класифікація)
   ↓
Router (по категоріях CR/EM/IN...)
   ↓
Telegram (з кодом події)
   ↓
Wix HTTP API (оновлення Score)
```

---

## 📝 Приклад промпту для OpenAI
```
Класифікуй подію по матриці SafeCity.

Текст: "{event.title}"
Локація: "{event.zone}"

Визнач:
1. Категорію (CR/EM/IN/TR/EC/MD/SO/ML)
2. Код події (наприклад: CR01, EM07)
3. Рівень ризику (1-5)

Формат відповіді: JSON
{
  "category": "CR",
  "code": "CR01",
  "risk": 2
}
```

---

## 🔗 Посилання

- **Wix Site:** https://safecity-demo.wixsite.com/community
- **Make.com:** https://eu2.make.com/
- **Telegram Group:** (приватна)
- **GitHub:** https://github.com/f24margo/safecity-platform

---

**Версія:** v1.0 (базова інтеграція)  
**Наступна:** v1.3.1 (з AI-класифікацією)
