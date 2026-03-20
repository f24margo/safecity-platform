# 📦 Інструкція по встановленню SafeCity на Wix

## 🎯 Крок 1: Налаштування Member Custom Fields

1. Зайди в **Wix Dashboard** → **Contacts** → **Settings** → **Custom Fields**
2. Створи 2 поля:

### Поле 1: Community (Громада)
- **Field Name:** `community`
- **Display Name:** Громада
- **Type:** Dropdown
- **Options:**
  - Південне
  - Чорноморськ
  - Теплодар
- **Required:** ✅ Yes

### Поле 2: Role (Роль)
- **Field Name:** `role`
- **Display Name:** Роль
- **Type:** Dropdown
- **Options:**
  - resident (Житель)
  - security_manager (Менеджер безпеки)
  - regional_admin (Регіональний адмін)
- **Default Value:** resident

---

## 🗂️ Крок 2: Створення Wix Data Collections

### Collection: Incidents

**Permissions:** 
- Read: Anyone
- Create: Members
- Update: Admin
- Delete: Admin

**Fields:**

| Field Name | Type | Description |
|------------|------|-------------|
| `title` | Text | Заголовок звернення |
| `code` | Text | Код події (IN13, CR06...) |
| `category` | Text | Категорія |
| `riskLevel` | Number | Рівень ризику (1-5) |
| `status` | Text | pending / in_progress / resolved |
| `zone` | Text | Громада |
| `latitude` | Number | GPS координата |
| `longitude` | Number | GPS координата |
| `address` | Text | Адреса |
| `photo` | Image | Фото події |
| `photoSize` | Text | Розмір фото |
| `reportedBy` | Text | Email автора |
| `authorName` | Text | Ім'я автора |
| `memberId` | Reference | Посилання на Members |
| `createdDate` | Date | Дата створення |
| `source` | Text | map_button / telegram / manual |

### Collection: Communities (опціонально)

| Field Name | Type | Description |
|------------|------|-------------|
| `name` | Text | Південне / Чорноморськ / Теплодар |
| `score` | Number | Security Score (0-100) |
| `managerName` | Text | Ім'я менеджера |
| `managerEmail` | Text | Email менеджера |
| `managerId` | Reference | Посилання на Members |

---

## 📄 Крок 3: Створення сторінки "Звернення"

1. **Wix Editor** → **Pages** → **Add Page**
2. **Page Name:** Звернення
3. **URL:** `/zvrennennya`
4. **Permissions:** Members Only

### Додай елементи:

#### 1. HTML iFrame (для карти)
- **Element ID:** `mapWidget`
- **Source:** `public/map-community.html`
- **Size:** Full width, Full height

#### 2. Lightbox (для форми звернення)
- **Element ID:** `reportLightbox`
- **Content:** HTML iFrame з `public/photo-uploader.html`

#### 3. Text (повідомлення про помилку)
- **Element ID:** `errorMessage`
- **Hidden by default:** ✅

#### 4. Text (повідомлення про успіх)
- **Element ID:** `successMessage`
- **Text:** ✅ Звернення надіслано!
- **Hidden by default:** ✅

---

## 💻 Крок 4: Додавання Velo коду

1. **Wix Editor** → **Code Files** (Dev Mode)
2. **Pages** → `zvrennennya.js`
3. **Скопіюй код з:** `backend/community-page.js`
```javascript
// Вставити весь код з backend/community-page.js
```

---

## 🎨 Крок 5: Налаштування Dashboard App

Dashboard App вже працює з існуючою колекцією `Incidents`.

### Додаткова логіка для ролей:

В `src/dashboard/pages/page.tsx` додай перевірку ролі:
```typescript
const member = await wixMembersFrontend.currentMember.getMember();
const userRole = member.customFields?.role;
const userCommunity = member.customFields?.community;

if (userRole === 'security_manager') {
    // Показуємо ТІЛЬКИ події його громади
    setSelectedCommunity(userCommunity);
    setCanSwitchCommunities(false);
} else if (userRole === 'regional_admin') {
    // Показуємо всі громади з перемикачем
    setCanSwitchCommunities(true);
}
```

---

## 🧪 Крок 6: Тестування

### Test Case 1: Житель створює звернення
1. Зареєструй тестового користувача
2. Встанови `community: "Південне"`, `role: "resident"`
3. Зайди на `/zvrennennya`
4. Натисни "🚨 ПОВІДОМИТИ"
5. Заповни форму
6. Перевір що звернення з'явилось в Dashboard → Moderation

### Test Case 2: Менеджер бачить тільки свою громаду
1. Створи користувача з `role: "security_manager"`, `community: "Південне"`
2. Зайди в Dashboard
3. Перевір що бачить ТІЛЬКИ події Південного
4. Перемикач громад відсутній

### Test Case 3: Адмін бачить всі громади
1. Встанови собі `role: "regional_admin"`
2. Зайди в Dashboard
3. Перевір що є перемикач громад
4. Можеш вибрати "Весь регіон"

---

## 🔧 Налаштування Make.com (Telegram)

Webhook вже налаштований в `backend/page-code.js`:
```
https://hook.eu2.make.com/m8w7xc9g151193pekrfghjms7tlbvuvu
```

Events автоматично відправляються в Telegram групу після створення.

---

## ✅ Checklist

- [ ] Member Custom Fields створені
- [ ] Collection Incidents створена
- [ ] Сторінка /zvrennennya створена
- [ ] HTML віджети додані
- [ ] Velo код вставлений
- [ ] Dashboard налаштований
- [ ] Тестовий житель створений
- [ ] Тестовий менеджер створений
- [ ] Тестове звернення відправлено
- [ ] Звернення з'явилось в Dashboard

---

**Готово! Платформа SafeCity запущена! 🎉**
