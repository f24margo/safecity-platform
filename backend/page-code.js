// Wix Velo Page Code
// Приймає дані з HTML віджету та зберігає в Wix Data + відправляє в Make.com

import wixData from 'wix-data';
import wixMembersFrontend from 'wix-members-frontend';
import { fetch } from 'wix-fetch';

$w.onReady(function () {
  $w("#html1").onMessage(async (event) => {
    if (event.data.type === 'SUBMIT_REPORT') {
      const d = event.data.data;
      
      // 1. Отримуємо дані автора (Member)
      let authorEmail = "Анонім";
      try {
        const member = await wixMembersFrontend.currentMember.getMember();
        if (member && member.loginEmail) {
          authorEmail = member.loginEmail;
        }
      } catch (err) {
        console.log("Працюємо як гість");
      }

      const itemToInsert = {
        "title": d.title || 'Нове звернення',
        "latitude": d.lat || 0,
        "longitude": d.lng || 0,
        "address": d.address || 'Локацію не визначено',
        "zone": d.zone || 'Не визначено',
        "reportedBy": authorEmail,
        "createdDate": new Date(),
        "status": 'pending',
        "source": 'public_form'
      };

      // 2. ЗАПИС У БАЗУ WIX ТА ВІДПРАВКА В MAKE
      try {
        const savedItem = await wixData.insert("Incidents", itemToInsert);
        console.log('✅ Записано в CMS Wix');

        // 3. WEBHOOK MAKE.COM
        const webhookUrl = "https://hook.eu2.make.com/m8w7xc9g151193pekrfghjms7tlbvuvu";
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemToInsert)
        });

        if (response.ok) {
          console.log('🚀 Дані успішно отримані Make.com');
        } else {
          console.error('⚠️ Make прийняв запит, але повернув помилку:', response.status);
        }
      } catch (err) {
        console.error('❌ Помилка процесу:', err);
      }
    }
  });
});
