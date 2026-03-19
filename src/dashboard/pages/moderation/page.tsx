import React, { useState, useMemo, useEffect } from 'react';

type Lang = 'uk' | 'en';
type Status = 'pending' | 'approved' | 'resolved';
type RiskLevel = 1 | 2 | 3 | 4 | 5;

interface Incident {
  id: string; title: string; description: string; community: string;
  status: Status; eventCode: string; eventCategory: string;
  riskLevel: RiskLevel; riskWeight: number; source: string;
  reportedBy: string; createdAt: string; createdBy: string;
  createdByName: string; updatedAt?: string; updatedBy?: string;
  managerNotePrivate?: string; managerNotePublic?: string;
  isNotePublic: boolean; affectsScore: boolean; zone?: string;
}

const EVENT_MATRIX = [
  { code: 'CR01', label_uk: 'Крадіжка майна', label_en: 'Property theft', category: 'CR', risk: 2 },
  { code: 'CR02', label_uk: 'Пограбування', label_en: 'Robbery', category: 'CR', risk: 4 },
  { code: 'CR03', label_uk: 'Насилля або бійка', label_en: 'Violence or fight', category: 'CR', risk: 4 },
  { code: 'CR04', label_uk: 'Шахрайство', label_en: 'Fraud', category: 'CR', risk: 2 },
  { code: 'CR05', label_uk: 'Незаконна зброя', label_en: 'Illegal weapons', category: 'CR', risk: 5 },
  { code: 'CR06', label_uk: 'Наркотики', label_en: 'Narcotics', category: 'CR', risk: 4 },
  { code: 'EM07', label_uk: 'Пожежа в будинку', label_en: 'Building fire', category: 'EM', risk: 5 },
  { code: 'EM08', label_uk: 'Пожежа на вулиці', label_en: 'Outdoor fire', category: 'EM', risk: 3 },
  { code: 'EM09', label_uk: 'Вибух або детонація', label_en: 'Explosion', category: 'EM', risk: 5 },
  { code: 'EM10', label_uk: 'Обвал будівлі', label_en: 'Building collapse', category: 'EM', risk: 5 },
  { code: 'EM11', label_uk: 'Техногенна аварія', label_en: 'Industrial accident', category: 'EM', risk: 4 },
  { code: 'IN12', label_uk: 'Не працює освітлення', label_en: 'Lighting failure', category: 'IN', risk: 1 },
  { code: 'IN13', label_uk: 'Пошкоджена дорога', label_en: 'Damaged road', category: 'IN', risk: 2 },
  { code: 'IN14', label_uk: 'Аварія водопроводу', label_en: 'Water main break', category: 'IN', risk: 3 },
  { code: 'IN15', label_uk: 'Аварія електромережі', label_en: 'Power grid failure', category: 'IN', risk: 3 },
  { code: 'IN16', label_uk: 'Пошкодження мостів', label_en: 'Bridge damage', category: 'IN', risk: 4 },
  { code: 'TR17', label_uk: 'ДТП', label_en: 'Road accident', category: 'TR', risk: 3 },
  { code: 'TR18', label_uk: 'Блокування дороги', label_en: 'Road blockage', category: 'TR', risk: 2 },
  { code: 'TR19', label_uk: 'Аварія транспорту', label_en: 'Transport accident', category: 'TR', risk: 4 },
  { code: 'EC20', label_uk: 'Забруднення води', label_en: 'Water contamination', category: 'EC', risk: 4 },
  { code: 'EC21', label_uk: 'Незаконне звалище', label_en: 'Illegal dump', category: 'EC', risk: 2 },
  { code: 'EC22', label_uk: 'Викиди або дим', label_en: 'Emissions', category: 'EC', risk: 3 },
  { code: 'EC23', label_uk: 'Загибель тварин', label_en: 'Animal deaths', category: 'EC', risk: 2 },
  { code: 'MD24', label_uk: 'Спалах інфекції', label_en: 'Infection outbreak', category: 'MD', risk: 5 },
  { code: 'MD25', label_uk: 'Масове отруєння', label_en: 'Mass poisoning', category: 'MD', risk: 5 },
  { code: 'MD26', label_uk: 'Дефіцит медичної допомоги', label_en: 'Medical shortage', category: 'MD', risk: 3 },
  { code: 'SO27', label_uk: 'Масовий конфлікт', label_en: 'Mass conflict', category: 'SO', risk: 4 },
  { code: 'SO28', label_uk: 'Протест або заворушення', label_en: 'Protest', category: 'SO', risk: 3 },
  { code: 'SO29', label_uk: 'Гуманітарна проблема', label_en: 'Humanitarian issue', category: 'SO', risk: 2 },
  { code: 'ML30', label_uk: 'Повітряна тривога', label_en: 'Air alert', category: 'ML', risk: 5 },
];

const RISK_WEIGHTS: Record<number, number> = { 1:1, 2:3, 3:7, 4:15, 5:30 };
const CATEGORY_COLORS: Record<string, string> = {
  CR:'#F87171', EM:'#FB923C', IN:'#60A5FA', TR:'#A78BFA',
  EC:'#34D399', MD:'#F472B6', SO:'#FBBF24', ML:'#FF4444',
};
const RISK_COLORS: Record<number, string> = {
  1:'#94A3B8', 2:'#60A5FA', 3:'#FBBF24', 4:'#FB923C', 5:'#F87171',
};

const COMMUNITY_NAMES: Record<string, { uk: string; en: string }> = {
  all:      { uk: '🌍 Весь регіон', en: '🌍 All Region' },
  pivdenne: { uk: 'Південне',       en: 'Pivdenne'      },
  chorno:   { uk: 'Чорноморськ',    en: 'Chornomorsk'   },
  teplo:    { uk: 'Теплодар',       en: 'Teplodar'      },
};

const DEMO_INCIDENTS: Incident[] = [
  {
    id: '1', title: 'Яма на дорозі біля школи',
    description: 'Велика яма на перехресті вул. Шевченка та Незалежності.',
    community: 'Південне', status: 'pending', eventCode: 'IN13', eventCategory: 'IN',
    riskLevel: 2, riskWeight: 3, source: 'Житель', reportedBy: 'Ірина Савченко',
    createdAt: '2026-03-12T09:15:00', createdBy: 'member_001', createdByName: 'Іван Коваль',
    affectsScore: true, isNotePublic: false, zone: 'вул. Шевченка 12',
  },
  {
    id: '2', title: 'Пожежа в покинутому будинку',
    description: 'Горить покинута будівля по вул. Морській. Викликано ДСНС.',
    community: 'Чорноморськ', status: 'approved', eventCode: 'EM07', eventCategory: 'EM',
    riskLevel: 5, riskWeight: 30, source: 'ДСНС', reportedBy: 'Чергова ДСНС',
    createdAt: '2026-03-11T22:40:00', createdBy: 'member_002', createdByName: 'Марія Петренко',
    updatedAt: '2026-03-11T23:10:00', updatedBy: 'member_002',
    managerNotePrivate: 'Підозра на підпал. Поліція відкрила провадження.',
    managerNotePublic: 'Пожежу ліквідовано. Місце оточено.',
    isNotePublic: true, affectsScore: true, zone: 'вул. Морська 7',
  },
  {
    id: '3', title: 'Збій електропостачання в районі',
    description: 'Відключення електроенергії у 3 кварталах після грози.',
    community: 'Теплодар', status: 'resolved', eventCode: 'IN15', eventCategory: 'IN',
    riskLevel: 3, riskWeight: 7, source: 'Житель / Служби', reportedBy: 'Олег Бондаренко',
    createdAt: '2026-03-10T14:20:00', createdBy: 'member_003', createdByName: 'Олег Бондаренко',
    updatedAt: '2026-03-10T17:45:00', updatedBy: 'member_003',
    managerNotePublic: 'Електропостачання відновлено о 17:45.',
    isNotePublic: true, affectsScore: true, zone: 'мікрорайон Новий',
  },
  {
    id: '4', title: 'Підозрілі особи біля школи',
    description: 'Мешканці повідомляють про осіб, що пропонують речовини підліткам.',
    community: 'Південне', status: 'pending', eventCode: 'CR06', eventCategory: 'CR',
    riskLevel: 4, riskWeight: 15, source: 'Житель', reportedBy: 'Анонім',
    createdAt: '2026-03-12T16:30:00', createdBy: 'member_001', createdByName: 'Іван Коваль',
    isNotePublic: false, affectsScore: true,
    managerNotePrivate: 'Передано до поліції. Патруль направлено.',
    zone: 'вул. Сонячна 3',
  },
  {
    id: '5', title: 'Повітряна тривога — наслідки',
    description: 'Під час нічної тривоги пошкоджено дах адміністративної будівлі.',
    community: 'Чорноморськ', status: 'approved', eventCode: 'ML30', eventCategory: 'ML',
    riskLevel: 5, riskWeight: 30, source: 'Офіційні канали', reportedBy: 'ДСНС Одеська',
    createdAt: '2026-03-11T03:15:00', createdBy: 'member_002', createdByName: 'Марія Петренко',
    updatedAt: '2026-03-11T08:00:00', updatedBy: 'member_002',
    managerNotePrivate: 'Фіксується на підставі офіційного повідомлення ДСНС.',
    managerNotePublic: 'Інцидент зафіксовано. Будівля огороджена.',
    isNotePublic: true, affectsScore: true,
  },
  {
    id: '6', title: 'Незаконне сміттєзвалище',
    description: 'Виявлено стихійний смітник ~20 м куб за межами промзони.',
    community: 'Теплодар', status: 'pending', eventCode: 'EC21', eventCategory: 'EC',
    riskLevel: 2, riskWeight: 3, source: 'Житель', reportedBy: 'Микола Ткач',
    createdAt: '2026-03-09T11:00:00', createdBy: 'member_003', createdByName: 'Олег Бондаренко',
    isNotePublic: false, affectsScore: true, zone: 'промзона пн.',
  },
  {
    id: '7', title: 'ДТП з постраждалими',
    description: 'Зіткнення двох автомобілів. Двоє постраждалих госпіталізовані.',
    community: 'Південне', status: 'resolved', eventCode: 'TR17', eventCategory: 'TR',
    riskLevel: 3, riskWeight: 7, source: 'Житель / Поліція', reportedBy: 'Патрульна поліція',
    createdAt: '2026-03-08T18:55:00', createdBy: 'member_001', createdByName: 'Іван Коваль',
    updatedAt: '2026-03-08T20:00:00', updatedBy: 'member_001',
    managerNotePublic: 'Постраждалі госпіталізовані, стан стабільний.',
    isNotePublic: true, affectsScore: true, zone: 'пр. Миру / вул. Гагаріна',
  },
];

// Map community id → Ukrainian name
const COMMUNITY_ID_TO_NAME: Record<string, string> = {
  pivdenne: 'Південне',
  chorno:   'Чорноморськ',
  teplo:    'Теплодар',
};

const T = {
  uk: {
    title: 'Модерація звернень', subtitle: 'Класифікація, верифікація та управління інцидентами',
    all: 'Всі', status: 'Статус', category: 'Категорія', community: 'Громада', risk: 'Ризик',
    search: 'Пошук за назвою або описом...', pending: 'Очікує', approved: 'Підтверджено', resolved: 'Вирішено',
    total: 'всього', backToList: '← Назад до списку', classification: 'Класифікація події',
    eventCode: 'Код події (Матриця v1.0)', riskLevel: 'Рівень ризику', riskWeight: 'Коефіцієнт',
    affectsScore: 'Впливає на Score', notes: 'Нотатки менеджера',
    privateNote: 'Приватна нотатка (тільки команда)', publicNote: 'Публічна нотатка (бачить житель)',
    makePublic: 'Зробити публічну нотатку видимою жителям', audit: 'Аудит',
    reportedBy: 'Автор звернення', createdBy: 'Зареєстрував', updatedBy: 'Оновив',
    source: 'Джерело', zone: 'Зона / Адреса', description: 'Опис',
    cancel: 'Скасувати', save: 'Зберегти зміни', yes: 'Так', no: 'Ні',
    riskLabels: ['', 'Мінімальний', 'Низький', 'Середній', 'Високий', 'Критичний'],
    noResults: 'Звернень не знайдено', selectCode: 'Оберіть код події...', saved: 'Збережено',
    activeCommunity: 'Активна громада', allRegion: '🌍 Весь регіон',
  },
  en: {
    title: 'Incident Moderation', subtitle: 'Classification, verification and incident management',
    all: 'All', status: 'Status', category: 'Category', community: 'Community', risk: 'Risk',
    search: 'Search by title or description...', pending: 'Pending', approved: 'Approved', resolved: 'Resolved',
    total: 'total', backToList: '← Back to list', classification: 'Event Classification',
    eventCode: 'Event Code (Matrix v1.0)', riskLevel: 'Risk Level', riskWeight: 'Weight',
    affectsScore: 'Affects Score', notes: 'Manager Notes',
    privateNote: 'Private note (team only)', publicNote: 'Public note (visible to resident)',
    makePublic: 'Make public note visible to residents', audit: 'Audit Trail',
    reportedBy: 'Reported by', createdBy: 'Registered by', updatedBy: 'Updated by',
    source: 'Source', zone: 'Zone / Address', description: 'Description',
    cancel: 'Cancel', save: 'Save changes', yes: 'Yes', no: 'No',
    riskLabels: ['', 'Minimal', 'Low', 'Medium', 'High', 'Critical'],
    noResults: 'No incidents found', selectCode: 'Select event code...', saved: 'Saved',
    activeCommunity: 'Active community', allRegion: '🌍 All Region',
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status, t }: { status: Status; t: typeof T['uk'] }) {
  const cfg = {
    pending:  { color: '#FBBF24', bg: 'rgba(251,191,36,0.15)',  label: t.pending },
    approved: { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)',  label: t.approved },
    resolved: { color: '#34D399', bg: 'rgba(52,211,153,0.15)',  label: t.resolved },
  };
  const c = cfg[status];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const,
      color: c.color, background: c.bg, border: `1px solid ${c.color}40`, borderRadius: 4, padding: '2px 8px' }}>
      {c.label}
    </span>
  );
}

function RiskBadge({ level, t }: { level: RiskLevel; t: typeof T['uk'] }) {
  const color = RISK_COLORS[level];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`,
      border: `1px solid ${color}40`, borderRadius: 4, padding: '2px 8px' }}>
      {level} — {t.riskLabels[level]}
    </span>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const color = CATEGORY_COLORS[cat] || '#94A3B8';
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`,
      border: `1px solid ${color}40`, borderRadius: 4, padding: '2px 8px' }}>
      {cat}
    </span>
  );
}

function IncidentRow({ inc, t, lang, onClick }: { inc: Incident; t: typeof T['uk']; lang: Lang; onClick: () => void }) {
  const event = EVENT_MATRIX.find(e => e.code === inc.eventCode);
  const eventLabel = event ? (lang === 'uk' ? event.label_uk : event.label_en) : inc.eventCode;
  return (
    <div onClick={onClick} style={{
      background: '#1E293B', border: '1px solid #334155', borderRadius: 10,
      padding: '14px 18px', cursor: 'pointer',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'start',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#475569')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' as const }}>
          <StatusBadge status={inc.status} t={t} />
          <CategoryBadge cat={inc.eventCategory} />
          <RiskBadge level={inc.riskLevel} t={t} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{inc.community}</span>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#F1F5F9', marginBottom: 4 }}>{inc.title}</div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{inc.eventCode} — {eventLabel}</div>
        <div style={{ fontSize: 11, color: '#475569' }}>
          {t.reportedBy}: {inc.reportedBy} · {formatDate(inc.createdAt)}{inc.zone && ` · ${inc.zone}`}
        </div>
        {inc.managerNotePublic && inc.isNotePublic && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#60A5FA', fontStyle: 'italic' }}>
            {inc.managerNotePublic.slice(0, 80)}{inc.managerNotePublic.length > 80 ? '...' : ''}
          </div>
        )}
      </div>
      <div style={{ color: '#475569', fontSize: 18 }}>›</div>
    </div>
  );
}

function IncidentCard({ inc, t, lang, onBack, onSave }: {
  inc: Incident; t: typeof T['uk']; lang: Lang;
  onBack: () => void; onSave: (u: Incident) => void;
}) {
  const [draft, setDraft] = useState<Incident>({ ...inc });
  const [saved, setSaved] = useState(false);
  const selectedEvent = EVENT_MATRIX.find(e => e.code === draft.eventCode);

  function handleEventCode(code: string) {
    const ev = EVENT_MATRIX.find(e => e.code === code);
    if (ev) setDraft(d => ({ ...d, eventCode: code, eventCategory: ev.category, riskLevel: ev.risk as RiskLevel, riskWeight: RISK_WEIGHTS[ev.risk] }));
  }

  function handleSave() {
    onSave({ ...draft, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, display: 'block' };
  const inputStyle: React.CSSProperties = { width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: 6, padding: '8px 12px', color: '#F1F5F9', fontSize: 13, outline: 'none', boxSizing: 'border-box' };
  const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: 'vertical' as const, fontFamily: 'inherit' };
  const sectionStyle: React.CSSProperties = { background: '#162032', border: '1px solid #1E3A5F', borderRadius: 10, padding: '16px 18px', marginBottom: 14 };
  const categories = ['CR','EM','IN','TR','EC','MD','SO','ML'];
  const catNames: Record<string,string> = { CR:'CR — Кримінал', EM:'EM — Пожежі/НС', IN:'IN — Інфраструктура', TR:'TR — Транспорт', EC:'EC — Екологія', MD:'MD — Медицина', SO:'SO — Соціальні', ML:'ML — Військові' };

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 16 }}>
        {t.backToList}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 10, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: '#F1F5F9', fontWeight: 700 }}>{inc.title}</h2>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>ID: {inc.id} · {inc.community}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}><StatusBadge status={draft.status} t={t} /><CategoryBadge cat={draft.eventCategory} /></div>
      </div>

      <div style={{ ...sectionStyle, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: 12, color: '#64748B' }}>{t.status}:</span>
        {(['pending','approved','resolved'] as Status[]).map(s => (
          <button key={s} onClick={() => setDraft(d => ({ ...d, status: s }))} style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: draft.status === s ? `1px solid ${s==='pending'?'#FBBF24':s==='approved'?'#60A5FA':'#34D399'}` : '1px solid #334155',
            background: draft.status === s ? (s==='pending'?'rgba(251,191,36,0.15)':s==='approved'?'rgba(96,165,250,0.15)':'rgba(52,211,153,0.15)') : 'transparent',
            color: draft.status === s ? (s==='pending'?'#FBBF24':s==='approved'?'#60A5FA':'#34D399') : '#64748B',
          }}>{s==='pending'?t.pending:s==='approved'?t.approved:t.resolved}</button>
        ))}
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>{t.description}</span>
        <p style={{ margin: 0, fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>{draft.description}</p>
        {draft.zone && <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>📍 {draft.zone}</div>}
      </div>

      <div style={sectionStyle}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{t.classification}</div>
        <span style={labelStyle}>{t.eventCode}</span>
        <select value={draft.eventCode} onChange={e => handleEventCode(e.target.value)}
          style={{ ...inputStyle, marginBottom: 14, cursor: 'pointer' }}>
          <option value="">{t.selectCode}</option>
          {categories.map(cat => (
            <optgroup key={cat} label={catNames[cat]}>
              {EVENT_MATRIX.filter(e => e.category === cat).map(ev => (
                <option key={ev.code} value={ev.code}>{ev.code} — {lang==='uk'?ev.label_uk:ev.label_en} (ризик {ev.risk})</option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedEvent && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div style={{ background: '#0F172A', borderRadius: 6, padding: '10px 12px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase' as const }}>{t.riskLevel}</div>
              <RiskBadge level={draft.riskLevel} t={t} />
            </div>
            <div style={{ background: '#0F172A', borderRadius: 6, padding: '10px 12px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase' as const }}>{t.riskWeight}</div>
              <span style={{ fontWeight: 700, fontSize: 16, color: RISK_COLORS[draft.riskLevel] }}>x{draft.riskWeight}</span>
            </div>
            <div style={{ background: '#0F172A', borderRadius: 6, padding: '10px 12px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase' as const }}>{t.affectsScore}</div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.affectsScore} onChange={e => setDraft(d => ({ ...d, affectsScore: e.target.checked }))} />
                <span style={{ fontSize: 12, color: draft.affectsScore ? '#34D399' : '#64748B' }}>{draft.affectsScore ? t.yes : t.no}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{t.notes}</div>
        <span style={labelStyle}>🔒 {t.privateNote}</span>
        <textarea value={draft.managerNotePrivate || ''} onChange={e => setDraft(d => ({ ...d, managerNotePrivate: e.target.value }))}
          placeholder="Внутрішня нотатка..." style={{ ...textareaStyle, marginBottom: 14, borderColor: '#4B2B1A' }} />
        <span style={labelStyle}>🌐 {t.publicNote}</span>
        <textarea value={draft.managerNotePublic || ''} onChange={e => setDraft(d => ({ ...d, managerNotePublic: e.target.value }))}
          placeholder="Публічна відповідь..." style={{ ...textareaStyle, marginBottom: 10, borderColor: '#1E3A5F' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94A3B8' }}>
          <input type="checkbox" checked={draft.isNotePublic} onChange={e => setDraft(d => ({ ...d, isNotePublic: e.target.checked }))} />
          {t.makePublic}
        </label>
      </div>

      <div style={sectionStyle}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{t.audit}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
          <div><span style={{ color: '#475569' }}>{t.reportedBy}: </span><span style={{ color: '#94A3B8' }}>{inc.reportedBy}</span></div>
          <div><span style={{ color: '#475569' }}>{t.source}: </span><span style={{ color: '#94A3B8' }}>{inc.source}</span></div>
          <div><span style={{ color: '#475569' }}>{t.createdBy}: </span><span style={{ color: '#94A3B8' }}>{inc.createdByName}</span></div>
          <div><span style={{ color: '#475569' }}>Створено: </span><span style={{ color: '#94A3B8' }}>{formatDate(inc.createdAt)}</span></div>
          {inc.updatedAt && <>
            <div><span style={{ color: '#475569' }}>{t.updatedBy}: </span><span style={{ color: '#94A3B8' }}>{inc.updatedBy}</span></div>
            <div><span style={{ color: '#475569' }}>Оновлено: </span><span style={{ color: '#94A3B8' }}>{formatDate(inc.updatedAt)}</span></div>
          </>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onBack} style={{ padding: '9px 20px', borderRadius: 7, border: '1px solid #334155', background: 'transparent', color: '#94A3B8', fontSize: 13, cursor: 'pointer' }}>{t.cancel}</button>
        <button onClick={handleSave} style={{ padding: '9px 22px', borderRadius: 7, border: 'none', background: saved ? '#166534' : '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {saved ? `✓ ${t.saved}` : t.save}
        </button>
      </div>
    </div>
  );
}

export default function ModerationPage() {
  const [lang, setLang] = useState<Lang>('uk');
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCommunity, setFilterCommunity] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [activeCommunityId, setActiveCommunityId] = useState<string>('all');

  const t = T[lang];

  // Читаємо активну громаду з localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('safecity_community');
      if (saved) {
        setActiveCommunityId(saved);
        // Якщо обрана конкретна громада — ставимо як дефолтний фільтр
        if (saved !== 'all') {
          const communityName = COMMUNITY_ID_TO_NAME[saved];
          if (communityName) setFilterCommunity(communityName);
        }
      }
    } catch {}
  }, []);

  function handleCommunitySwitch(id: string) {
    setActiveCommunityId(id);
    try { localStorage.setItem('safecity_community', id); } catch {}
    if (id === 'all') {
      setFilterCommunity('all');
    } else {
      const name = COMMUNITY_ID_TO_NAME[id];
      if (name) setFilterCommunity(name);
    }
  }

  const categories = [...new Set(incidents.map(i => i.eventCategory))];

  const filtered = useMemo(() => incidents.filter(inc => {
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (filterCategory !== 'all' && inc.eventCategory !== filterCategory) return false;
    if (filterCommunity !== 'all' && inc.community !== filterCommunity) return false;
    if (filterRisk !== 'all' && String(inc.riskLevel) !== filterRisk) return false;
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inc.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [incidents, filterStatus, filterCategory, filterCommunity, filterRisk, searchQuery]);

  const counts = {
    pending:  filtered.filter(i => i.status === 'pending').length,
    approved: filtered.filter(i => i.status === 'approved').length,
    resolved: filtered.filter(i => i.status === 'resolved').length,
  };

  const selectStyle: React.CSSProperties = {
    background: '#1E293B', border: '1px solid #334155', borderRadius: 6,
    padding: '6px 10px', color: '#CBD5E1', fontSize: 12, cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', padding: '24px 28px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#F1F5F9' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#F1F5F9' }}>{t.title}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>{t.subtitle}</p>
        </div>
        <button onClick={() => setLang(l => l === 'uk' ? 'en' : 'uk')}
          style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: '6px 14px', color: '#94A3B8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
          {lang === 'uk' ? 'EN' : 'UA'}
        </button>
      </div>

      {/* Community switcher */}
      <div style={{ background: '#162032', border: '1px solid #1E3A5F', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginRight: 4 }}>
          {t.activeCommunity}:
        </span>
        {Object.entries(COMMUNITY_NAMES).map(([id, name]) => {
          const isActive = activeCommunityId === id;
          const color = id === 'all' ? '#60A5FA' : '#34D399';
          return (
            <button key={id} onClick={() => handleCommunitySwitch(id)} style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: `1px solid ${isActive ? color : '#334155'}`,
              background: isActive ? `${color}20` : 'transparent',
              color: isActive ? color : '#64748B',
            }}>
              {name[lang]}
            </button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>
          {filtered.length} / {incidents.length} {t.total}
        </span>
      </div>

      {selected ? (
        <IncidentCard inc={selected} t={t} lang={lang} onBack={() => setSelected(null)}
          onSave={(updated) => { setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i)); setSelected(updated); }} />
      ) : (
        <>
          {/* Status chips */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {(['pending','approved','resolved'] as Status[]).map(s => {
              const color = s==='pending'?'#FBBF24':s==='approved'?'#60A5FA':'#34D399';
              const count = counts[s];
              return (
                <div key={s} onClick={() => setFilterStatus(filterStatus===s?'all':s)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: '#1E293B',
                  border: `1px solid ${filterStatus===s?color:'#334155'}`, borderRadius: 8,
                  padding: '8px 16px', cursor: 'pointer',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase' as const }}>
                    {s==='pending'?t.pending:s==='approved'?t.approved:t.resolved}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.search}
              style={{ ...selectStyle, flex: '1 1 220px', minWidth: 180 }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="all">{t.status}: {t.all}</option>
              <option value="pending">{t.pending}</option>
              <option value="approved">{t.approved}</option>
              <option value="resolved">{t.resolved}</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={selectStyle}>
              <option value="all">{t.category}: {t.all}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterCommunity} onChange={e => setFilterCommunity(e.target.value)} style={selectStyle}>
              <option value="all">{t.community}: {t.all}</option>
              <option value="Південне">Південне</option>
              <option value="Чорноморськ">Чорноморськ</option>
              <option value="Теплодар">Теплодар</option>
            </select>
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} style={selectStyle}>
              <option value="all">{t.risk}: {t.all}</option>
              {[1,2,3,4,5].map(r => <option key={r} value={String(r)}>{r} — {t.riskLabels[r]}</option>)}
            </select>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.length === 0
              ? <div style={{ textAlign: 'center' as const, padding: '60px 0', color: '#475569' }}>{t.noResults}</div>
              : filtered.map(inc => <IncidentRow key={inc.id} inc={inc} t={t} lang={lang} onClick={() => setSelected(inc)} />)
            }
          </div>
        </>
      )}
    </div>
  );
}