// Velo код для сторінки /zvrennennya
// Підключає Leaflet карту та обробляє звернення
// ВАЖЛИВО: Громада визначається автоматично з member.customFields.community

import wixData from 'wix-data';
import wixMembersFrontend from 'wix-members-frontend';
import wixLocation from 'wix-location';

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
        console.error('❌ У користувача не вказана громада в профілі');
        // TODO: Показати UI повідомлення
        return;
    }
    
    console.log('✅ Користувач:', currentMember.loginEmail, '| Громада:', userCommunity);
    
    // Відправляємо громаду на карту
    $w('#mapWidget').postMessage({
        type: 'SET_USER_COMMUNITY',
        community: userCommunity
    });
    
    // Завантажуємо події громади
    await loadCommunityIncidents();
    
    // Слухаємо повідомлення від карти
    $w('#mapWidget').onMessage(async (event) => {
        if (event.data.type === 'GET_INCIDENTS') {
            // Карта запитує події
            await loadCommunityIncidents();
        }
        
        if (event.data.type === 'GET_USER_COMMUNITY') {
            // Карта запитує громаду користувача
            $w('#mapWidget').postMessage({
                type: 'SET_USER_COMMUNITY',
                community: userCommunity
            });
        }
        
        if (event.data.type === 'SUBMIT_REPORT') {
            // Обробка нового звернення
            await handleNewReport(event.data.data);
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

// Обробка нового звернення
async function handleNewReport(data) {
    try {
        // Створюємо звернення
        const incident = {
            title: data.title,
            code: 'PENDING', // Менеджер класифікує вручну
            category: 'Не класифіковано',
            riskLevel: 2, // За замовчуванням
            status: 'pending',
            zone: userCommunity, // ← АВТОМАТИЧНО з профілю!
            latitude: data.lat || 0,
            longitude: data.lng || 0,
            address: data.address || 'Локацію не визначено',
            photo: null, // TODO: Додати фото пізніше
            reportedBy: currentMember.loginEmail,
            authorName: `${currentMember.name || ''} ${currentMember.lastName || ''}`.trim() || 'Анонім',
            memberId: currentMember._id,
            createdDate: new Date(),
            source: 'map_button'
        };
        
        const saved = await wixData.insert("Incidents", incident);
        
        console.log('✅ Звернення створено:', saved._id);
        
        // Оновлюємо карту
        await loadCommunityIncidents();
        
        // TODO: Відправити в Telegram (опціонально)
        // await sendToTelegram(saved);
        
        return saved;
        
    } catch (err) {
        console.error('❌ Помилка створення звернення:', err);
        return null;
    }
}
