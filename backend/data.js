import { fetch } from 'wix-fetch';

// Эта функция запускается автоматически ПОСЛЕ вставки (afterInsert) 
// в коллекцию "Incidents"
export function Incidents_afterInsert(item, context) {
    // 1. Сюда вставь свой адрес из Make (Webhook URL)
    const url = "https://hook.eu2.make.com/m8w7xc9g151193pekrfghjms7tlbvuvu";

    // 2. Отправляем данные в Make
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
    .then(() => {
        console.log("✅ Данные успешно отправлены из Backend в Make");
    })
    .catch((err) => {
        console.error("❌ Ошибка отправки из Backend:", err);
    });

    // Важно вернуть item, чтобы Wix не выдал ошибку
    return item;
}