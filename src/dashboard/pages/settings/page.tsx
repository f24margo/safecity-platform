import React, { useState, useEffect } from 'react';

type Lang = 'uk' | 'en';

const COMMUNITY_NAMES: Record<string, { uk: string; en: string }> = {
  all:      { uk: '🌍 Весь регіон', en: '🌍 All Region' },
  pivdenne: { uk: 'Південне',       en: 'Pivdenne'      },
  chorno:   { uk: 'Чорноморськ',    en: 'Chornomorsk'   },
  teplo:    { uk: 'Теплодар',       en: 'Teplodar'      },
};

const COMMUNITY_PROFILES: Record<string, {
  name: string; region: string; site: string; telegram: string; population: string; district: string;
  manager: string; managerEmail: string; since: string;
}> = {
  all: {
    name: 'Одеська область', region: 'Одеська область', site: 'od.gov.ua',
    telegram: '@odesa_region', population: '140000', district: 'Одеський район',
    manager: 'Адміністратор', managerEmail: 'admin@safecity.ua', since: '01.03.2026',
  },
  pivdenne: {
    name: 'Південне МТГ', region: 'Одеська область', site: 'pivdenne.gov.ua',
    telegram: '@pivdenne_info', population: '45000', district: 'Одеський район',
    manager: 'Іван Коваль', managerEmail: 'i.koval@pivdenne.gov.ua', since: '01.03.2026',
  },
  chorno: {
    name: 'Чорноморська МТГ', region: 'Одеська область', site: 'od.cmr.gov.ua',
    telegram: '@chornomorsk_info', population: '63000', district: 'Одеський район',
    manager: 'Марія Петренко', managerEmail: 'm.petrenko@cmr.gov.ua', since: '05.03.2026',
  },
  teplo: {
    name: 'Теплодарська МТГ', region: 'Одеська область', site: 'teplodar.gov.ua',
    telegram: '@teplodar_info', population: '32000', district: 'Одеський район',
    manager: 'Олег Бондаренко', managerEmail: 'o.bondarenko@teplodar.gov.ua', since: '10.03.2026',
  },
};

const TEAM_DATA: Record<string, Array<{ name: string; role: string; email: string; since: string; status: 'active' | 'pending' }>> = {
  all: [
    { name: 'Микола Філатов', role: 'Власник', email: 'mfilatov@gmail.com', since: '01.03.2026', status: 'active' },
  ],
  pivdenne: [
    { name: 'Микола Філатов', role: 'Власник', email: 'mfilatov@gmail.com', since: '01.03.2026', status: 'active' },
    { name: 'Іван Коваль', role: 'Менеджер безпеки', email: 'i.koval@pivdenne.gov.ua', since: '01.03.2026', status: 'active' },
  ],
  chorno: [
    { name: 'Микола Філатов', role: 'Власник', email: 'mfilatov@gmail.com', since: '01.03.2026', status: 'active' },
    { name: 'Марія Петренко', role: 'Менеджер безпеки', email: 'm.petrenko@cmr.gov.ua', since: '05.03.2026', status: 'active' },
    { name: 'Олена Коваль', role: 'Аудитор прозорості', email: 'o.koval@expert.ua', since: '10.03.2026', status: 'pending' },
  ],
  teplo: [
    { name: 'Микола Філатов', role: 'Власник', email: 'mfilatov@gmail.com', since: '01.03.2026', status: 'active' },
    { name: 'Олег Бондаренко', role: 'Менеджер безпеки', email: 'o.bondarenko@teplodar.gov.ua', since: '10.03.2026', status: 'active' },
  ],
};

const T = {
  uk: {
    title: 'Налаштування', subtitle: 'Менеджер з безпеки • Регіональна платформа',
    activeCommunity: 'Активна громада', allRegion: '🌍 Весь регіон',
    profile: '🏘️ ПРОФІЛЬ ГРОМАДИ', communityName: 'НАЗВА ГРОМАДИ', region: 'ОБЛАСТЬ',
    site: 'ОФІЦІЙНИЙ САЙТ', telegram: 'TELEGRAM КАНАЛ', population: 'НАСЕЛЕННЯ', district: 'РАЙОН',
    team: '👥 КОМАНДА БЕЗПЕКИ', owner: 'Власник', active: 'Активний', pending: 'Очікує',
    remove: 'Видалити', cancel_invite: 'Скасувати', invite_placeholder: 'email@example.com — надіслати запрошення Wix',
    role_manager: 'Менеджер безпеки', role_auditor: 'Аудитор прозорості', invite_btn: '+ Запросити',
    score_section: '📊 РОЗРАХУНОК SECURITY SCORE',
    formula: 'RiskSum = Σ (кількість подій × коефіцієнт ризику)\nScore = MAX(0, 100 − (RiskSum ÷ MaxExpected × 100))',
    formula_note: 'де MaxExpected = Період (днів) × Поріг навантаження',
    period_label: 'ПЕРІОД РОЗРАХУНКУ (ДНІВ)', threshold_label: 'ПОРІГ НАВАНТАЖЕННЯ', max_expected: 'MAXEXPECTED (АВТО)',
    notifications: '🔔 СПОВІЩЕННЯ',
    notif_telegram: 'Telegram сповіщення', notif_email: 'Email сповіщення',
    notif_critical: 'Критичні події (рівень 5)', notif_score: 'Падіння Score нижче порогу',
    about: 'ℹ️ ПРО ПЛАТФОРМУ',
    version: 'Версія', platform: 'Платформа', standard: 'Стандарт', license: 'Ліцензія',
    cancel: 'Скасувати', save: 'Зберегти зміни', saved: '✓ Збережено',
    access_since: 'Доступ з',
  },
  en: {
    title: 'Settings', subtitle: 'Security Manager • Regional Platform',
    activeCommunity: 'Active community', allRegion: '🌍 All Region',
    profile: '🏘️ COMMUNITY PROFILE', communityName: 'COMMUNITY NAME', region: 'REGION',
    site: 'OFFICIAL SITE', telegram: 'TELEGRAM CHANNEL', population: 'POPULATION', district: 'DISTRICT',
    team: '👥 SECURITY TEAM', owner: 'Owner', active: 'Active', pending: 'Pending',
    remove: 'Remove', cancel_invite: 'Cancel', invite_placeholder: 'email@example.com — send Wix invitation',
    role_manager: 'Security Manager', role_auditor: 'Transparency Auditor', invite_btn: '+ Invite',
    score_section: '📊 SECURITY SCORE CALCULATION',
    formula: 'RiskSum = Σ (event count × risk coefficient)\nScore = MAX(0, 100 − (RiskSum ÷ MaxExpected × 100))',
    formula_note: 'where MaxExpected = Period (days) × Load threshold',
    period_label: 'CALCULATION PERIOD (DAYS)', threshold_label: 'LOAD THRESHOLD', max_expected: 'MAXEXPECTED (AUTO)',
    notifications: '🔔 NOTIFICATIONS',
    notif_telegram: 'Telegram notifications', notif_email: 'Email notifications',
    notif_critical: 'Critical events (level 5)', notif_score: 'Score drops below threshold',
    about: 'ℹ️ ABOUT PLATFORM',
    version: 'Version', platform: 'Platform', standard: 'Standard', license: 'License',
    cancel: 'Cancel', save: 'Save changes', saved: '✓ Saved',
    access_since: 'Access since',
  },
};

export default function SettingsPage() {
  const [lang, setLang] = useState<Lang>('uk');
  const [activeCommunityId, setActiveCommunityId] = useState<string>('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('manager');
  const [period, setPeriod] = useState(30);
  const [threshold, setThreshold] = useState(10);
  const [notifTelegram, setNotifTelegram] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);
  const [notifScore, setNotifScore] = useState(false);
  const [saved, setSaved] = useState(false);

  const t = T[lang];
  const maxExpected = period * threshold;

  // Читаємо активну громаду з localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem('safecity_community');
      if (s) setActiveCommunityId(s);
    } catch {}
  }, []);

  function handleCommunitySwitch(id: string) {
    setActiveCommunityId(id);
    try { localStorage.setItem('safecity_community', id); } catch {}
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const profile = COMMUNITY_PROFILES[activeCommunityId] || COMMUNITY_PROFILES.all;
  const team = TEAM_DATA[activeCommunityId] || TEAM_DATA.all;
  const isAll = activeCommunityId === 'all';

  const sectionStyle: React.CSSProperties = {
    background: '#1E293B', border: '1px solid #334155', borderRadius: 12,
    padding: '20px 22px', marginBottom: 16,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#64748B',
    letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0F172A', border: '1px solid #334155',
    borderRadius: 6, padding: '8px 12px', color: '#F1F5F9',
    fontSize: 13, outline: 'none', boxSizing: 'border-box' as const,
  };

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <div onClick={() => onChange(!value)} style={{
        width: 40, height: 22, borderRadius: 11, cursor: 'pointer', transition: 'background 0.2s',
        background: value ? '#2563EB' : '#334155', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: value ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
        }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', padding: '24px 28px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#F1F5F9' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#F1F5F9' }}>{t.title}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['uk','en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? '#2563EB' : 'transparent',
              border: `1px solid ${lang === l ? '#2563EB' : '#334155'}`,
              borderRadius: 6, padding: '6px 14px', color: lang === l ? '#fff' : '#64748B',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Community switcher */}
      <div style={{ background: '#162032', border: '1px solid #1E3A5F', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginRight: 4 }}>
          {t.activeCommunity}:
        </span>
        {Object.entries(COMMUNITY_NAMES).map(([id, name]) => {
          const isActive = activeCommunityId === id;
          const color = '#60A5FA';
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
      </div>

      {/* Profile */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', marginBottom: 16 }}>{t.profile}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: t.communityName, value: profile.name },
            { label: t.region,        value: profile.region },
            { label: t.site,          value: profile.site },
            { label: t.telegram,      value: profile.telegram },
            { label: t.population,    value: profile.population },
            { label: t.district,      value: profile.district },
          ].map((f, i) => (
            <div key={i}>
              <label style={labelStyle}>{f.label}</label>
              <input defaultValue={f.value} style={inputStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', marginBottom: 16 }}>{t.team}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {team.map((member, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#0F172A', borderRadius: 10, border: '1px solid #1E293B' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: member.role === 'Власник' || member.role === 'Owner' ? '#F59E0B' : member.role.includes('Менеджер') || member.role.includes('Manager') ? '#3B82F6' : '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{member.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: member.role === 'Власник' || member.role === 'Owner' ? '#F59E0B' : '#60A5FA', background: member.role === 'Власник' || member.role === 'Owner' ? 'rgba(245,158,11,0.15)' : 'rgba(96,165,250,0.15)', borderRadius: 4, padding: '1px 8px' }}>
                    {member.role}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#475569' }}>{member.email} • {t.access_since} {member.since}</div>
              </div>
              {member.status === 'active' && member.role !== 'Власник' && member.role !== 'Owner' && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 6, padding: '3px 10px' }}>{t.active}</span>
              )}
              {member.status === 'active' && (member.role === 'Власник' || member.role === 'Owner') && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 6, padding: '3px 10px' }}>{t.active}</span>
              )}
              {member.status === 'pending' && (
                <>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#FBBF24', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 6, padding: '3px 10px' }}>{t.pending}</span>
                  <button style={{ fontSize: 11, color: '#F87171', background: 'none', border: '1px solid #F8717140', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>{t.cancel_invite}</button>
                </>
              )}
              {member.status === 'active' && member.role !== 'Власник' && member.role !== 'Owner' && (
                <button style={{ fontSize: 11, color: '#F87171', background: 'none', border: '1px solid #F8717140', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', marginLeft: 4 }}>{t.remove}</button>
              )}
            </div>
          ))}
        </div>
        {!isAll && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              placeholder={t.invite_placeholder}
              style={{ ...inputStyle, flex: 1 }} />
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
              style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
              <option value="manager">{t.role_manager}</option>
              <option value="auditor">{t.role_auditor}</option>
            </select>
            <button style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
              {t.invite_btn}
            </button>
          </div>
        )}
      </div>

      {/* Score formula */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', marginBottom: 16 }}>{t.score_section}</div>
        <div style={{ background: '#0F172A', borderRadius: 8, padding: '14px 16px', marginBottom: 16, fontFamily: 'monospace', fontSize: 13, color: '#60A5FA', lineHeight: 1.8 }}>
          {t.formula.split('\n').map((line, i) => <div key={i}>{line}</div>)}
          <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontFamily: 'system-ui', fontStyle: 'italic' }}>{t.formula_note}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>{t.period_label}</label>
            <input type="number" value={period} onChange={e => setPeriod(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t.threshold_label}</label>
            <input type="number" value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t.max_expected}</label>
            <div style={{ ...inputStyle, color: '#60A5FA', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{maxExpected}</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', marginBottom: 16 }}>{t.notifications}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: t.notif_telegram, value: notifTelegram, onChange: setNotifTelegram },
            { label: t.notif_email,    value: notifEmail,    onChange: setNotifEmail    },
            { label: t.notif_critical, value: notifCritical, onChange: setNotifCritical },
            { label: t.notif_score,    value: notifScore,    onChange: setNotifScore    },
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#CBD5E1' }}>{n.label}</span>
              <Toggle value={n.value} onChange={n.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', marginBottom: 14 }}>{t.about}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
          {[
            { label: t.version,  value: 'v1.1.0' },
            { label: t.platform, value: 'SafeCity Regional Platform' },
            { label: t.standard, value: 'UNDRR / OCHA / Sendai Framework' },
            { label: t.license,  value: 'Open Source — громади України' },
          ].map((row, i) => (
            <div key={i} style={{ background: '#0F172A', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 4 }}>{row.label}</div>
              <div style={{ color: '#94A3B8', fontWeight: 600 }}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Save bar */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, paddingBottom: 24 }}>
        <button style={{ padding: '9px 20px', borderRadius: 7, border: '1px solid #334155', background: 'transparent', color: '#94A3B8', fontSize: 13, cursor: 'pointer' }}>{t.cancel}</button>
        <button onClick={handleSave} style={{ padding: '9px 22px', borderRadius: 7, border: 'none', background: saved ? '#166534' : '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s' }}>
          {saved ? t.saved : t.save}
        </button>
      </div>

    </div>
  );
}