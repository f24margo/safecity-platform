import React, { useState } from 'react';

type Lang = 'uk' | 'en';

const communities = [
  { name: 'Південне',    score: 84, prev: 79, manager: 'Іван Коваль',       appeals: 18, resolved: 16, pending: 1,  trend: +5, color: '#34D399', medal: '🥇' },
  { name: 'Чорноморськ', score: 71, prev: 71, manager: 'Марія Петренко',    appeals: 15, resolved: 12, pending: 2,  trend:  0, color: '#FBBF24', medal: '🥈' },
  { name: 'Теплодар',    score: 65, prev: 68, manager: 'Олег Бондаренко',   appeals: 14, resolved: 10, pending: 4,  trend: -3, color: '#CD7F32', medal: '🥉' },
];

const history = [
  { week: 'Тиж 1', scores: [78, 68, 62] },
  { week: 'Тиж 2', scores: [80, 69, 64] },
  { week: 'Тиж 3', scores: [81, 70, 66] },
  { week: 'Тиж 4', scores: [84, 71, 65] },
];

const T = {
  uk: {
    title: 'Рейтинг громад', subtitle: 'Порівняльний аналіз Security Score по регіону',
    rank: 'Місце', community: 'Громада', manager: 'Менеджер', score: 'Score',
    appeals: 'Звернень', resolved: 'Вирішено', pending: 'Очікує', trend: 'Тренд',
    dynamics: 'Динаміка рейтингу — 4 тижні', podium: 'П\'єдестал пошани',
    updated: 'Оновлено', vsLastWeek: 'vs минулий тиждень',
    resolvedRate: 'відсоток вирішення', pendingAlert: 'потребують уваги',
  },
  en: {
    title: 'Community Leaderboard', subtitle: 'Comparative Security Score analysis by region',
    rank: 'Rank', community: 'Community', manager: 'Manager', score: 'Score',
    appeals: 'Appeals', resolved: 'Resolved', pending: 'Pending', trend: 'Trend',
    dynamics: 'Rating dynamics — 4 weeks', podium: 'Honor Podium',
    updated: 'Updated', vsLastWeek: 'vs last week',
    resolvedRate: 'resolution rate', pendingAlert: 'need attention',
  },
};

function scoreColor(s: number) {
  if (s >= 75) return '#34D399';
  if (s >= 50) return '#FBBF24';
  return '#F87171';
}

export default function LeaderboardPage() {
  const [lang, setLang] = useState<Lang>('uk');
  const t = T[lang];

  const sorted = [...communities].sort((a, b) => b.score - a.score);

  const sectionStyle: React.CSSProperties = {
    background: '#1E293B', border: '1px solid #334155', borderRadius: 12,
    padding: '20px 22px', marginBottom: 16,
  };
  const sectionTitle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, marginBottom: 16,
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', padding: '24px 28px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#F1F5F9' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>🏆 {t.title}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#475569' }}>{t.updated} {new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
          <button onClick={() => setLang(l => l === 'uk' ? 'en' : 'uk')}
            style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: '6px 14px', color: '#94A3B8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            {lang === 'uk' ? 'EN' : 'UA'}
          </button>
        </div>
      </div>

      {/* Podium */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>{t.podium}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
          {/* 2nd place */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 28 }}>🥈</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9' }}>{sorted[1].name}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{sorted[1].manager}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(sorted[1].score) }}>{sorted[1].score}%</div>
            <div style={{ width: 100, height: 60, background: '#334155', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#94A3B8' }}>2</span>
            </div>
          </div>
          {/* 1st place */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 32 }}>🥇</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#F1F5F9' }}>{sorted[0].name}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{sorted[0].manager}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: scoreColor(sorted[0].score) }}>{sorted[0].score}%</div>
            <div style={{ width: 110, height: 80, background: 'linear-gradient(180deg, #854D0E 0%, #713F12 100%)', borderRadius: '6px 6px 0 0', border: '2px solid #FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#FBBF24' }}>1</span>
            </div>
          </div>
          {/* 3rd place */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 26 }}>🥉</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9' }}>{sorted[2].name}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{sorted[2].manager}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(sorted[2].score) }}>{sorted[2].score}%</div>
            <div style={{ width: 90, height: 44, background: '#1E293B', border: '1px solid #334155', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#64748B' }}>3</span>
            </div>
          </div>
        </div>
        {/* base line */}
        <div style={{ height: 3, background: '#334155', borderRadius: 2, margin: '0 20px' }} />
      </div>

      {/* Full table */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>{t.rank} · {t.community}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((c, i) => (
            <div key={c.name} style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 90px 70px 70px 60px 70px',
              alignItems: 'center', gap: 12, padding: '14px 16px',
              background: '#0F172A', borderRadius: 10,
              border: `1px solid ${i === 0 ? '#854D0E' : '#1E293B'}`,
            }}>
              {/* rank */}
              <div style={{ fontSize: 16, fontWeight: 800, color: i === 0 ? '#FBBF24' : i === 1 ? '#94A3B8' : '#CD7F32' }}>
                {i + 1}
              </div>
              {/* name + manager */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9' }}>{c.medal} {c.name}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.manager}</div>
              </div>
              {/* score bar */}
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: scoreColor(c.score), marginBottom: 4 }}>{c.score}%</div>
                <div style={{ height: 4, background: '#1E293B', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.score}%`, background: scoreColor(c.score), borderRadius: 2 }} />
                </div>
              </div>
              {/* appeals */}
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#60A5FA' }}>{c.appeals}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>{t.appeals}</div>
              </div>
              {/* resolved */}
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#34D399' }}>{c.resolved}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>{t.resolved}</div>
              </div>
              {/* pending */}
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: c.pending > 2 ? '#F87171' : '#FBBF24' }}>{c.pending}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>{t.pending}</div>
              </div>
              {/* trend */}
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.trend > 0 ? '#34D399' : c.trend < 0 ? '#F87171' : '#64748B' }}>
                  {c.trend > 0 ? `↑ +${c.trend}%` : c.trend < 0 ? `↓ ${c.trend}%` : '→ 0%'}
                </div>
                <div style={{ fontSize: 10, color: '#475569' }}>{t.vsLastWeek}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-week dynamics */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>{t.dynamics}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {communities.map((c, ci) => (
            <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{c.medal} {c.name}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 40 }}>
                {history.map((h, hi) => {
                  const val = h.scores[ci];
                  const maxH = 40;
                  const barH = Math.round((val / 100) * maxH);
                  const isLast = hi === history.length - 1;
                  return (
                    <div key={hi} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ fontSize: 9, color: '#475569' }}>{val}%</div>
                      <div style={{ width: '100%', height: `${barH}px`, background: isLast ? scoreColor(val) : `${scoreColor(val)}60`, borderRadius: '2px 2px 0 0' }} />
                      <div style={{ fontSize: 9, color: '#475569' }}>{h.week}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}