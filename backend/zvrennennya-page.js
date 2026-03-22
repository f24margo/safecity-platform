/**
 * Velo код для сторінки "Звернення"
 * SafeCity Platform v1.2 - Simplified Photo Version
 * @date 2026-03-22
 */

import wixData from 'wix-data';
import { currentMember } from 'wix-members-frontend';
import { fetch } from 'wix-fetch';

let memberData = null;
let userCommunity = '';

const TELEGRAM_WEBHOOK = 'https://hook.eu2.make.com/m8w7xc9g151193pekrfghjms7tlbvuvu';

$w.onReady(async function () {
    console.log('🟢 Сторінка "Звернення" завантажена');
    
    try {
        memberData = await currentMember.getMember();
        
        if (!memberData) {
            console.log('❌ Користувач не авторизований');
            return;
        }
        
        const email = memberData.loginEmail || 
                     memberData.contactDetails?.loginEmail || 
                     'unknown';
        
        userCommunity = memberData.contactDetails?.customFields?.community || 
                       'Південне';
        
        console.log('✅ Email:', email);
        console.log('🏘️ Громада:', userCommunity);
        
        console.log('⏳ Чекаємо iframe...');
        await new Promise(r => setTimeout(r, 2000));
        
        const iframe = $w('#html1');
        console.log('🖼️ iframe тип:', iframe.type);
        
        iframe.postMessage({
            type: 'SET_USER_COMMUNITY',
            community: userCommunity
        });
        console.log('📤 Відправлено SET_USER_COMMUNITY');
        
        await loadCommunityIncidents();
        
        iframe.onMessage(async (event) => {
            console.log('📩 Отримано:', event.data.type);
            
            if (event.data.type === 'SUBMIT_REPORT') {
                console.log('🚨 Створюємо звернення!');
                await handleNewReport(event.data.data);
            }
            
            if (event.data.type === 'GET_INCIDENTS') {
                await loadCommunityIncidents();
            }
            
            if (event.data.type === 'GET_USER_COMMUNITY') {
                iframe.postMessage({
                    type: 'SET_USER_COMMUNITY',
                    community: userCommunity
                });
            }
        });
        
        console.log('✅ Ініціалізація завершена');
        
    } catch (err) {
        console.error('❌ Помилка:', err.message);
    }
});

async function loadCommunityIncidents() {
    console.log('📊 Завантаження подій...');
    
    try {
        const incidents = await wixData.query("Incidents")
            .descending("createdDate")
            .limit(100)
            .find();
        
        console.log(`✅ Знайдено ${incidents.items.length} подій`);
        
        $w('#html1').postMessage({
            type: 'LOAD_INCIDENTS',
            data: incidents.items
        });
        
    } catch (err) {
        console.error('❌ Помилка завантаження:', err.message);
    }
}

async function sendToTelegram(incident) {
    console.log('📱 Відправка в Telegram...');
    
    try {
        const message = {
            id: incident._id,
            title: incident.title,
            zone: incident.zone,
            category: incident.category,
            status: incident.status,
            reportedBy: incident.reportedBy,
            authorName: incident.authorName,
            latitude: incident.latitude,
            longitude: incident.longitude,
            address: incident.address,
            createdDate: incident.createdDate,
            source: incident.source,
            hasPhoto: !!incident.image_fld
        };
        
        console.log('📦 Дані для Telegram:', message);
        
        const response = await fetch(TELEGRAM_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        
        if (response.ok) {
            console.log('✅ Telegram: повідомлення відправлено!');
            return true;
        } else {
            console.error('❌ Telegram помилка:', response.status, response.statusText);
            return false;
        }
        
    } catch (err) {
        console.error('❌ Помилка відправки в Telegram:', err.message);
        return false;
    }
}

async function handleNewReport(data) {
    console.log('🔔 === СТВОРЕННЯ ЗВЕРНЕННЯ ===');
    console.log('📦 Дані від форми:', data);
    console.log('Назва:', data.title);
    console.log('Громада:', userCommunity);
    console.log('🖼️ Є фото?', !!data.photo);
    
    try {
        const email = memberData?.loginEmail || 
                     memberData?.contactDetails?.loginEmail || 
                     'unknown';
        
        const name = memberData?.profile?.nickname || 
                    memberData?.contactDetails?.firstName || 
                    'Анонім';
        
        // Обробка фото (зберігаємо інфо про наявність)
        let photoInfo = '';
        if (data.photo) {
            const photoLength = data.photo.length;
            const photoSizeMB = (photoLength * 0.75 / 1024 / 1024).toFixed(2);
            console.log('📸 Фото отримано!');
            console.log('🖼️ Розмір фото:', photoSizeMB, 'MB');
            
            photoInfo = `PHOTO_RECEIVED:${photoSizeMB}MB`;
        } else {
            console.log('ℹ️ Звернення без фото');
        }
        
        const incident = {
            title: data.title || 'Без назви',
            code: 'PENDING',
            category: 'Не класифіковано',
            riskLevel: 2,
            status: 'pending',
            zone: userCommunity,
            latitude: data.lat || 0,
            longitude: data.lng || 0,
            address: data.address || 'Адреса не визначена',
            reportedBy: email,
            authorName: name,
            memberId: memberData?._id || 'unknown',
            createdDate: new Date(),
            source: 'map_button',
            image_fld: photoInfo
        };
        
        console.log('📦 Об\'єкт для збереження:', incident);
        console.log('💾 Зберігаємо в Collection Incidents...');
        
        const saved = await wixData.insert("Incidents", incident);
        
        console.log('✅✅✅ ЗБЕРЕЖЕНО В COLLECTION! ID:', saved._id);
        console.log('📊 Повний об\'єкт:', saved);
        
        console.log('📱 Відправка в Telegram...');
        await sendToTelegram(saved);
        
        console.log('🗺️ Оновлюємо карту...');
        await loadCommunityIncidents();
        
        console.log('🎉 ВСЕ ГОТОВО!');
        
    } catch (err) {
        console.error('❌ КРИТИЧНА ПОМИЛКА:', err.message);
        console.error('Stack:', err.stack);
    }
}
