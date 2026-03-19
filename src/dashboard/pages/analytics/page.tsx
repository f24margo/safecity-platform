import React, { useState, useEffect } from 'react';

type Lang = 'uk' | 'en';

// ─── COMMUNITY DATA ────────────────────────────────────────────────────────────

const COMMUNITIES_DATA = {
  all: {
    name: { uk: '🌍 Весь регіон', en: '🌍 All Region' },
    score: 73, totalAppeals: 47, resolved: 38, pending: 7,
    weekScores: [62, 65, 68, 65, 70, 74, 71],
    monthScores: [58,60,63,61,65,67,64,66,68,65,70,72,69,71,73,70,68,72,74,71,73,75,72,70,71,74,73,71,72,71],
    categoryStats: [
      { code: 'IN', label_uk: 'Інфраструктура', label_en: 'Infrastructure', count: 14, color: '#60A5FA', pct: 30 },
      { code: 'CR', label_uk: 'Кримінальна',    label_en: 'Criminal',       count: 10, color: '#F87171', pct: 21 },
      { code: 'TR', label_uk: 'Транспорт',      label_en: 'Transport',      count:  8, color: '#A78BFA', pct: 17 },
      { code: 'EC', label_uk: 'Екологія',       label_en: 'Ecology',        count:  6, color: '#34D399', pct: 13 },
      { code: 'EM', label_uk: 'Пожежі/НС',      label_en: 'Emergency',      count:  5, color: '#FB923C', pct: 11 },
      { code: 'SO', label_uk: 'Соціальні',      label_en: 'Social',         count:  3, color: '#FBBF24', pct:  6 },
      { code: 'MD', label_uk: 'Медичні',        label_en: 'Medical',        count:  1, color: '#F472B6', pct:  2 },
    ],
  },
  pivdenne: {
    name: { uk: 'Південне', en: 'Pivdenne' },
    score: 84, totalAppeals: 18, resolved: 16, pending: 1,
    weekScores: [79, 80, 82, 81, 83, 85, 84],
    monthScores: [75,76,78,77,79,80,79,81,82,80,83,84,82,83,85,84,82,84,85,84,85,86,84,83,84,85,84,83,84,84],
    categoryStats: [
      { code: 'IN', label_uk: 'Інфраструктура', label_en: 'Infrastructure', count: 6, color: '#60A5FA', pct: 33 },
      { code: 'CR', label_uk: 'Кримінальна',    label_en: 'Criminal',       count: 5, color: '#F87171', pct: 28 },
      { code: 'TR', label_uk: 'Транспорт',      label_en: 'Transport',      count: 4, color: '#A78BFA', pct: 22 },
      { code: 'EC', label_uk: 'Екологія',       label_en: 'Ecology',        count: 3, color: '#34D399', pct: 17 },
    ],
  },
  chorno: {
    name: { uk: 'Чорноморськ', en: 'Chornomorsk' },
    score: 71, totalAppeals: 15, resolved: 12, pending: 2,
    weekScores: [68, 69, 71, 70, 72, 73, 71],
    monthScores: [65,66,68,67,69,70,68,70,71,69,72,73,71,72,74,72,70,72,73,71,72,74,71,69,70,73,72,70,71,71],
    categoryStats: [
      { code: 'EM', label_uk: 'Пожежі/НС',   label_en: 'Emergency',      count: 5, color: '#FB923C', pct: 33 },
      { code: 'IN', label_uk: 'Інфраструктура', label_en: 'Infrastructure', count: 4, color: '#60A5FA', pct: 27 },
      { code: 'ML', label_uk: 'Військові',    label_en: 'Military',       count: 3, color: '#FF4444', pct: 20 },
      { code: 'CR', label_uk: 'Кримінальна', label_en: 'Criminal',       count: 3, color: '#F87171', pct: 20 },
    ],
  },
  teplo: {
    name: { uk: 'Теплодар', en: 'Teplodar' },
    score: 65, totalAppeals: 14, resolved: 10, pending: 4,
    weekScores: [68, 67, 66, 67, 65, 64, 65],
    monthScores: [70,69,68,69,67,66,65,66,67,65,66,68,66,67,68,67,65,66,67,65,66,67,65,63,64,66,65,63,64,65],
    categoryStats: [
      { code: 'EC', label_uk: 'Екологія',       label_en: 'Ecology',        count: 5, color: '#34D399', pct: 36 },
      { code: 'IN', label_uk: 'Інфраструктура', label_en: 'Infrastructure', count: 4, color: '#60A5FA', pct: 28 },
      { code: 'SO', label_uk: 'Соціальні',      label_en: 'Social',         count: 3, color: '#FBBF24', pct: 22 },
      { code: 'TR', label_uk: 'Транспорт',      label_en: 'Transport',      count: 2, color: '#A78BFA', pct: 14 },
    ],
  },
};

const riskStats = [
  { level: 5, label_uk: 'Критичний',   label_en: 'Critical', count:  4, color: '#F87171' },
  { level: 4, label_uk: 'Високий',     label_en: 'High',     count:  8, color: '#FB923C' },
  { level: 3, label_uk: 'Середній',    label_en: 'Medium',   count: 14, color: '#FBBF24' },
  { level: 2, label_uk: 'Низький',     label_en: 'Low',      count: 15, color: '#60A5FA' },
  { level: 1, label_uk: 'Мінімальний', label_en: 'Minimal',  count:  6, color: '#94A3B8' },
];

const topIncidents = [
  { title: 'Пожежа в покинутому будинку',  code: 'EM07', community: 'Чорноморськ', risk: 5, color: '#F87171' },
  { title: 'Повітряна тривога — наслідки', code: 'ML30', community: 'Чорноморськ', risk: 5, color: '#F87171' },
  { title: 'Підозрілі особи біля школи',   code: 'CR06', community: 'Південне',    risk: 4, color: '#FB923C' },
  { title: 'ДТП з постраждалими',          code: 'TR17', community: 'Південне',    risk: 3, color: '#FBBF24' },
  { title: 'Збій електропостачання',       code: 'IN15', community: 'Теплодар',    risk: 3, color: '#FBBF24' },
];

const weekDays_uk = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
const weekDays_en = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const T = {
  uk: {
    title: 'Аналітика безпеки', subtitle: 'Динаміка Security Score та розподіл інцидентів',
    updated: 'Оновлено', totalAppeals: 'Всього звернень', resolved: 'Вирішено',
    pending: 'Очікує', avgScore: 'Score', scoreWeek: 'Динаміка Score — 7 днів',
    scoreMonth: 'Динаміка Score — 30 днів', byCategory: 'Розподіл за категоріями',
    byRisk: 'Розподіл за рівнем ризику', topIncidents: 'Топ інциденти за ризиком',
    appeals: 'звернень', week: '7 днів', month: '30 днів',
    activeCommunity: 'Активна громада', allRegion: '🌍 Весь регіон',
  },
  en: {
    title: 'Security Analytics', subtitle: 'Security Score dynamics and incident distribution',
    updated: 'Updated', totalAppeals: 'Total appeals', resolved: 'Resolved',
    pending: 'Pending', avgScore: 'Score', scoreWeek: 'Score dynamics — 7 days',
    scoreMonth: 'Score dynamics — 30 days', byCategory: 'Distribution by category',
    byRisk: 'Distribution by risk level', topIncidents: 'Top incidents by risk',
    appeals: 'appeals', week: '7 days', month: '30 days',
    activeCommunity: 'Active community', allRegion: '🌍 All Region',
  },
};

function scoreColor(s: number) {
  if (s >= 75) return '#34D399';
  if (s >= 50) return '#FBBF24';
  return '#F87171';
}

function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '18px 20px', flex: '1 1 140px' }}>
      <div style={{ fontSize: 11, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, days }: { data: number[]; days: string[] }) {
  const max = 100;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, paddingTop: 8 }}>
      {data.map((val, i) => {
        const h = Math.round((val / max) * 100);
        const isLast = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 9, color: '#475569' }}>{val}%</div>
            <div style={{ width: '100%', height: `${h}px`, background: isLast ? scoreColor(val) : '#3B82F6', borderRadius: '3px 3px 0 0', opacity: isLast ? 1 : 0.8 }} />
            <div style={{ fontSize: 9, color: '#475569' }}>{days[i]}</div>
          </div>
        );
      })}
    </div>
  );
}

function MonthChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 600; const h = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 80 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaGrad)" />
        <polyline points={pts} fill="none" stroke="#3B82F6" strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 4 }}>
        <span>1</span><span>10</span><span>20</span><span>30</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [lang, setLang] = useState<Lang>('uk');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [communityId, setCommunityId] = useState<string>('all');
  const t = T[lang];
  const days = lang === 'uk' ? weekDays_uk : weekDays_en;

  // Читаємо активну громаду з localStorage (встановлює Security Hub)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('safecity_community');
      if (saved) setCommunityId(saved);
    } catch {}
  }, []);

  const data = COMMUNITIES_DATA[communityId as keyof typeof COMMUNITIES_DATA] || COMMUNITIES_DATA.all;
  const isAll = communityId === 'all';

  const sectionStyle: React.CSSProperties = {
    background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px 22px', marginBottom: 16,
  };
  const sectionTitle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, marginBottom: 16,
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', padding: '24px 28px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#F1F5F9' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>{t.title}</h1>
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

      {/* Active community badge */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{t.activeCommunity}:</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(data.score), background: `${scoreColor(data.score)}15`, border: `1px solid ${scoreColor(data.score)}40`, borderRadius: 20, padding: '3px 12px' }}>
          {data.name[lang]} — {data.score}%
        </span>
        {!isAll && (
          <button onClick={() => { setCommunityId('all'); try { localStorage.setItem('safecity_community', 'all'); } catch {} }}
            style={{ fontSize: 11, color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {t.allRegion}
          </button>
        )}
      </div>

      {/* KPI */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' as const }}>
        <KpiCard label={t.avgScore} value={`${data.score}%`} sub={data.name[lang]} color={scoreColor(data.score)} />
        <KpiCard label={t.totalAppeals} value={data.totalAppeals} sub="за 30 днів" color="#60A5FA" />
        <KpiCard label={t.resolved} value={data.resolved} sub={`${Math.round(data.resolved / data.totalAppeals * 100)}% вирішено`} color="#34D399" />
        <KpiCard label={t.pending} value={data.pending} sub="потребують уваги" color={data.pending > 3 ? '#F87171' : '#FBBF24'} />
      </div>

      {/* Score chart */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={sectionTitle}>{chartPeriod === 'week' ? t.scoreWeek : t.scoreMonth}</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['week', 'month'] as const).map(p => (
              <button key={p} onClick={() => setChartPeriod(p)} style={{
                padding: '4px 12px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${chartPeriod === p ? '#3B82F6' : '#334155'}`,
                background: chartPeriod === p ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: chartPeriod === p ? '#60A5FA' : '#64748B',
              }}>{p === 'week' ? t.week : t.month}</button>
            ))}
          </div>
        </div>
        {chartPeriod === 'week'
          ? <BarChart data={data.weekScores} days={days} />
          : <MonthChart data={data.monthScores} />
        }
      </div>

      {/* 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={sectionStyle}>
          <div style={sectionTitle}>{t.byCategory}</div>
          {data.categoryStats.map(c => (
            <div key={c.code} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#CBD5E1' }}>
                  <span style={{ fontWeight: 700, color: c.color, marginRight: 6 }}>{c.code}</span>
                  {lang === 'uk' ? c.label_uk : c.label_en}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{c.count} ({c.pct}%)</span>
              </div>
              <div style={{ height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitle}>{t.byRisk}</div>
          {riskStats.map(r => {
            const total = riskStats.reduce((s, x) => s + x.count, 0);
            const pct = Math.round(r.count / total * 100);
            return (
              <div key={r.level} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#CBD5E1' }}>
                    <span style={{ fontWeight: 700, color: r.color, marginRight: 6 }}>{r.level}</span>
                    {lang === 'uk' ? r.label_uk : r.label_en}
                  </span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{r.count} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top incidents */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>{t.topIncidents}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(isAll ? topIncidents : topIncidents.filter(i => i.community === data.name['uk'])).map((inc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0F172A', borderRadius: 8, border: '1px solid #1E293B' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${inc.color}20`, border: `2px solid ${inc.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: inc.color }}>
                {inc.risk}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{inc.title}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{inc.code} · {inc.community}</div>
              </div>
              <span style={{ fontSize: 11, color: inc.color, background: `${inc.color}15`, border: `1px solid ${inc.color}40`, borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>R{inc.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}