// Velo код для сторінки /zvrennennya (Моя громада)
// Підключає Leaflet карту та обробляє звернення

import wixData from 'wix-data';
import wixMembersFrontend from 'wix-members-frontend';
import wixLocation from 'wix-location';
import { mediaManager } from 'wix-media-backend';

let currentMember = null;
let userCommunity = '';

$w.onReady(async function () {
    // Перевірка авторизації
    const isLoggedIn = await wixMembersFrontend.currentMember.loggedIn();
    
    if (!isLoggedIn) {
        // Перенаправляємо на login
        wixLocation.to('/login');
        return;
    }
    
    // Отримуємо дані Member
    currentMember = await wixMembersFrontend.currentMember.getMember();
    userCommunity = currentMember.customFields?.community;
    
    if (!userCommunity) {
        // Показуємо повідомлення про необхідність вибрати громаду
        $w('#errorMessage').text = 'Будь ласка, оберіть вашу громаду в профілі';
        $w('#errorMessage').show();
        return;
    }
    
    // Завантажуємо події громади
    await loadCommunityIncidents();
    
    // Слухаємо повідомлення від карти
    $w('#mapWidget').onMessage(async (event) => {
        if (event.data.type === 'GET_INCIDENTS') {
            // Карта запитує події
            await loadCommunityIncidents();
        }
        
        if (event.data.type === 'OPEN_REPORT_FORM') {
            // Відкриваємо форму звернення
            openReportForm();
        }
    });
});

// Завантажуємо події громади на карту
async function loadCommunityIncidents() {
    try {
        const incidents = await wixData.query("Incidents")
            .eq("zone", userCommunity)
            .descending("createdDate")
            .limit(100)
            .find();
        
        // Відправляємо події на карту
        $w('#mapWidget').postMessage({
            type: 'LOAD_INCIDENTS',
            data: incidents.items
        });
        
        console.log(`✅ Завантажено ${incidents.items.length} подій для ${userCommunity}`);
        
    } catch (err) {
        console.error('❌ Помилка завантаження подій:', err);
    }
}

// Відкриваємо форму звернення
function openReportForm() {
    // Показуємо lightbox з формою
    $w('#reportLightbox').show();
    
    // Або перенаправляємо на окрему сторінку
    // wixLocation.to('/report');
}

// Обробка нового звернення (якщо форма на цій же сторінці)
export async function submitIncident(data) {
    try {
        // Завантажуємо фото (якщо є)
        let photoUrl = null;
        
        if (data.photo) {
            const base64Data = data.photo.split(',')[1];
            const blob = base64ToBlob(base64Data, 'image/jpeg');
            
            const fileName = `${currentMember._id}_${Date.now()}.jpg`;
            const uploadResult = await mediaManager.upload(
                `incidents/${userCommunity}`,
                blob,
                fileName
            );
            
            photoUrl = uploadResult.fileUrl;
        }
        
        // Створюємо звернення
        const incident = {
            title: data.title,
            code: 'PENDING', // Менеджер класифікує вручну
            category: 'Не класифіковано',
            riskLevel: 2, // За замовчуванням
            status: 'pending',
            zone: userCommunity, // ← Автоматично з профілю!
            latitude: data.lat || 0,
            longitude: data.lng || 0,
            address: data.address || 'Локацію не визначено',
            photo: photoUrl,
            photoSize: data.photo ? getFileSizeKB(data.photo) + ' KB' : null,
            reportedBy: currentMember.loginEmail,
            authorName: `${currentMember.name} ${currentMember.lastName || ''}`.trim(),
            memberId: currentMember._id,
            createdDate: new Date(),
            source: 'map_button'
        };
        
        await wixData.insert("Incidents", incident);
        
        console.log('✅ Звернення створено');
        
        // Оновлюємо карту
        await loadCommunityIncidents();
        
        // Закриваємо форму
        $w('#reportLightbox').hide();
        
        // Показуємо успіх
        $w('#successMessage').show();
        setTimeout(() => $w('#successMessage').hide(), 3000);
        
        return true;
        
    } catch (err) {
        console.error('❌ Помилка створення звернення:', err);
        return false;
    }
}

// Утиліти
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
}

function getFileSizeKB(base64String) {
    return (base64String.length * 0.75 / 1024).toFixed(0);
}
