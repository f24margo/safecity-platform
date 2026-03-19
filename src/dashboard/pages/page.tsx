import React, { useState, useEffect } from 'react';

const T = {
  uk: {
    title: '🛡️ Security Hub', subtitle: 'Менеджер з безпеки • Регіональна платформа',
    overview: 'Загальний огляд регіону', securityScore: 'Security Score',
    weekDynamic: 'Динаміка за тиждень', communities: 'Громади',
    appeals: 'Звернень', resolved: 'Вирішено', monitoring: 'Моніторинг',
    newAppeals: 'нових', communityScore: 'Безпека по громадах',
    quickActions: '⚡ Швидкі дії', moderation: '📋 Модерація',
    analytics: '📊 Аналітика', leaderboard: '🏆 Рейтинг', settings: '⚙️ Налаштування',
    manager: 'Менеджер', goTo: 'Перейти →', allRegion: '🌍 Весь регіон',
    avgScore: 'Середній Score', activeRegion: 'Активна громада',
    region: 'Регіон', pendingAlert: 'очікують',
  },
  en: {
    title: '🛡️ Security Hub', subtitle: 'Security Manager • Regional Platform',
    overview: 'Regional Overview', securityScore: 'Security Score',
    weekDynamic: 'Weekly Dynamic', communities: 'Communities',
    appeals: 'Appeals', resolved: 'Resolved', monitoring: 'Monitoring',
    newAppeals: 'new', communityScore: 'Community Security',
    quickActions: '⚡ Quick Actions', moderation: '📋 Moderation',
    analytics: '📊 Analytics', leaderboard: '🏆 Leaderboard', settings: '⚙️ Settings',
    manager: 'Manager', goTo: 'Go to →', allRegion: '🌍 All Region',
    avgScore: 'Average Score', activeRegion: 'Active community',
    region: 'Region', pendingAlert: 'pending',
  },
};

const ALL_COMMUNITIES = [
  { id: 'all',      name: { uk: '🌍 Весь регіон', en: '🌍 All Region' },
    score: 73, totalAppeals: 47, resolved: 38, pending: 7,
    manager: '—', weekChart: [62, 65, 68, 65, 70, 74, 71] },
  { id: 'pivdenne', name: { uk: 'Південне',    en: 'Pivdenne'    },
    score: 84, totalAppeals: 18, resolved: 16, pending: 1,
    manager: 'Іван Коваль',     weekChart: [79, 80, 82, 81, 83, 85, 84] },
  { id: 'chorno',   name: { uk: 'Чорноморськ', en: 'Chornomorsk' },
    score: 71, totalAppeals: 15, resolved: 12, pending: 2,
    manager: 'Марія Петренко',  weekChart: [68, 69, 71, 70, 72, 73, 71] },
  { id: 'teplo',    name: { uk: 'Теплодар',    en: 'Teplodar'    },
    score: 65, totalAppeals: 14, resolved: 10, pending: 4,
    manager: 'Олег Бондаренко', weekChart: [68, 67, 66, 67, 65, 64, 65] },
];

const COMMUNITY_LIST = [
  { id: 'pivdenne', name: { uk: 'Південне',    en: 'Pivdenne'    }, score: 84, manager: 'Іван Коваль',     appeals: 18, pending: 1, trend: '📈' },
  { id: 'chorno',   name: { uk: 'Чорноморськ', en: 'Chornomorsk' }, score: 71, manager: 'Марія Петренко',  appeals: 15, pending: 2, trend: '→'  },
  { id: 'teplo',    name: { uk: 'Теплодар',    en: 'Teplodar'    }, score: 65, manager: 'Олег Бондаренко', appeals: 14, pending: 4, trend: '📉' },
];

const weekDays = { uk: ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'], en: ['Mo','Tu','We','Th','Fr','Sa','Su'] };

function getColor(score: number) {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

export default function SecurityHub() {
  const [lang, setLang] = useState<'uk'|'en'>('uk');
  const [activeCommunityId, setActiveCommunityId] = useState<string>('all');
  const [ready, setReady] = useState(false);
  const t = T[lang];

  // Завантажити збережену громаду з localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('safecity_community');
      if (saved) setActiveCommunityId(saved);
    } catch {}
    setTimeout(() => setReady(true), 400);
  }, []);

  // Зберегти вибір в localStorage (читають інші сторінки)
  function handleCommunitySelect(id: string) {
    setActiveCommunityId(id);
    try { localStorage.setItem('safecity_community', id); } catch {}
  }

  const active = ALL_COMMUNITIES.find(c => c.id === activeCommunityId) || ALL_COMMUNITIES[0];
  const isAll = activeCommunityId === 'all';

  if (!ready) return (
    <div style={{ background: '#0F172A', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 48 }}>🛡️</div>
        <div style={{ color: '#64748B', marginTop: 12 }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'white' }}>

      {/* HEADER */}
      <div style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.title}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{t.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['uk','en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? '#EF4444' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${lang === l ? '#EF4444' : '#334155'}`,
              borderRadius: 6, padding: '4px 14px',
              color: lang === l ? 'white' : '#64748B',
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* COMMUNITY SWITCHER */}
      <div style={{ background: '#162032', borderBottom: '1px solid #1E3A5F', padding: '12px 28px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginRight: 4 }}>
            {t.activeRegion}:
          </span>
          {ALL_COMMUNITIES.map(c => {
            const isActive = activeCommunityId === c.id;
            const color = c.id === 'all' ? '#60A5FA' : getColor(c.score);
            return (
              <button key={c.id} onClick={() => handleCommunitySelect(c.id)} style={{
                padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
                border: `1px solid ${isActive ? color : '#334155'}`,
                background: isActive ? `${color}20` : 'transparent',
                color: isActive ? color : '#64748B',
              }}>
                {c.id === 'all' ? (lang === 'uk' ? '🌍 Весь регіон' : '🌍 All Region') : c.name[lang]}
                {c.id !== 'all' && (
                  <span style={{ marginLeft: 6, fontSize: 11, color: isActive ? color : '#475569' }}>{c.score}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* KPI */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: 12 }}>
            {isAll ? t.overview : active.name[lang]}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { value: `${active.score}%`,       label: isAll ? t.avgScore : t.securityScore, color: getColor(active.score) },
              { value: isAll ? COMMUNITY_LIST.length : '—', label: t.communities, color: '#3B82F6' },
              { value: active.totalAppeals,      label: t.appeals,    color: '#10B981' },
              { value: '24/7',                   label: t.monitoring, color: '#8B5CF6' },
            ].map((k, i) => (
              <div key={i} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '18px', textAlign: 'center' as const }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SCORE + CHART */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px', textAlign: 'center' as const }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: 16 }}>
              {t.securityScore}
            </div>
            <div style={{ width: 110, height: 110, borderRadius: '50%', border: `6px solid ${getColor(active.score)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: getColor(active.score) }}>{active.score}%</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Score</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#10B981' }}>{active.resolved}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{t.resolved}</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#EF4444' }}>{active.pending}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{t.pendingAlert}</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: 16 }}>
              {t.weekDynamic}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
              {active.weekChart.map((val, i) => {
                const isLast = i === active.weekChart.length - 1;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ fontSize: 9, color: '#64748B' }}>{val}%</div>
                    <div style={{ width: '100%', height: `${val}px`, borderRadius: '3px 3px 0 0', background: isLast ? getColor(val) : '#3B82F6' }} />
                    <div style={{ fontSize: 9, color: '#475569' }}>{weekDays[lang][i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COMMUNITY LIST — показуємо тільки для "Весь регіон" */}
        {isAll && (
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: 14 }}>
              {t.communityScore}
            </div>
            {COMMUNITY_LIST.map(c => (
              <div key={c.id} onClick={() => handleCommunitySelect(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid #334155',
                borderRadius: 10, marginBottom: 8, cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#475569')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
              >
                <div style={{ fontSize: 18 }}>🏘️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name[lang]}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{t.manager}: {c.manager} • {c.appeals} {t.appeals}</div>
                </div>
                <div style={{ width: 120 }}>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.score}%`, background: getColor(c.score), borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: getColor(c.score), width: 48, textAlign: 'right' as const }}>{c.score}%</div>
                <div style={{ fontSize: 13 }}>{c.trend}</div>
                {c.pending > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', borderRadius: 20, padding: '2px 10px', fontSize: 11, color: '#EF4444', fontWeight: 700 }}>
                    {c.pending} {t.newAppeals}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* INFO громади — показуємо для конкретної громади */}
        {!isAll && (
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: 14 }}>
              {active.name[lang]}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#0F172A', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{t.manager}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{active.manager}</div>
              </div>
              <div style={{ background: '#0F172A', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{t.appeals}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#60A5FA' }}>{active.totalAppeals}</div>
              </div>
              <div style={{ background: '#0F172A', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{t.resolved}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#34D399' }}>{active.resolved}</div>
              </div>
              <div style={{ background: '#0F172A', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{t.pendingAlert}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: active.pending > 2 ? '#F87171' : '#FBBF24' }}>{active.pending}</div>
              </div>
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: 14 }}>
            {t.quickActions}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { icon: '📋', label: t.moderation,  count: active.pending, color: '#EF4444' },
              { icon: '📊', label: t.analytics,   count: null,           color: '#3B82F6' },
              { icon: '🏆', label: t.leaderboard, count: null,           color: '#F59E0B' },
              { icon: '⚙️', label: t.settings,    count: null,           color: '#64748B' },
            ].map((btn, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #334155', borderRadius: 10, padding: '14px', textAlign: 'center' as const, cursor: 'pointer' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{btn.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{btn.label}</div>
                {btn.count !== null && btn.count > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                    {btn.count} {t.newAppeals}
                  </div>
                )}
                <div style={{ fontSize: 10, color: '#475569' }}>{t.goTo}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}