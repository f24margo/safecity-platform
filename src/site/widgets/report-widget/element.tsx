import React, { useState } from 'react';

type Step = 1 | 2 | 3;

interface ReportData {
  lat: number | null;
  lng: number | null;
  address: string;
  photo: string | null;
  message: string;
}

export default function ReportWidget() {
  const [step, setStep]         = useState<Step>(1);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [report, setReport]     = useState<ReportData>({
    lat: null, lng: null, address: '', photo: null, message: ''
  });

  async function getLocation() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setReport(r => ({ ...r, lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
        setLoading(false);
        setStep(2);
      },
      () => {
        setReport(r => ({ ...r, address: 'Локацію не визначено' }));
        setLoading(false);
        setStep(2);
      }
    );
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReport(r => ({ ...r, photo: ev.target?.result as string }));
      setStep(3);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  }

  if (success) return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>Дякуємо!</h2>
          <p style={{ color: '#64748B', fontSize: 15, margin: '0 0 24px' }}>
            Звернення прийнято. Команда розгляне його найближчим часом.
          </p>
          <button onClick={() => { setSuccess(false); setStep(1); setReport({ lat: null, lng: null, address: '', photo: null, message: '' }); }}
            style={styles.btnRed}>
            Подати ще одне
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* ХЕДЕР */}
        <div style={styles.header}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🚨</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>
            Повідомити про проблему
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            3 кроки • менше 10 секунд
          </p>
        </div>

        {/* ПРОГРЕС */}
        <div style={{ display: 'flex', padding: '16px 24px 0', gap: 8 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: step >= s ? '#EF4444' : '#E2E8F0',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <div style={{ padding: '20px 24px 24px' }}>

          {/* КРОК 1 — ГЕОЛОКАЦІЯ */}
          {step === 1 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📍</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>
                Крок 1 — Ваше місцезнаходження
              </h3>
              <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 24px' }}>
                Натисніть кнопку щоб визначити де ви знаходитесь
              </p>
              <button onClick={getLocation} disabled={loading} style={styles.btnRed}>
                {loading ? '⏳ Визначаємо...' : '📍 Визначити локацію'}
              </button>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setStep(2)} style={styles.btnGhost}>
                  Пропустити →
                </button>
              </div>
            </div>
          )}

          {/* КРОК 2 — ФОТО */}
          {step === 2 && (
            <div>
              {report.address && (
                <div style={styles.locationBadge}>
                  📍 {report.address}
                </div>
              )}
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📷</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>
                  Крок 2 — Фото (опціонально)
                </h3>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 20px' }}>
                  Зробіть або завантажте фото події
                </p>
                <label style={{ ...styles.btnRed, display: 'inline-block', cursor: 'pointer' }}>
                  📷 Додати фото
                  <input type="file" accept="image/*" capture="environment"
                    onChange={handlePhoto}
                    style={{ display: 'none' }} />
                </label>
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => setStep(3)} style={styles.btnGhost}>
                    Без фото →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* КРОК 3 — ПОВІДОМЛЕННЯ */}
          {step === 3 && (
            <div>
              {report.photo && (
                <img src={report.photo} alt="preview"
                  style={{ width: '100%', borderRadius: 12, marginBottom: 16, maxHeight: 200, objectFit: 'cover' }} />
              )}
              {report.address && (
                <div style={styles.locationBadge}>📍 {report.address}</div>
              )}
              <h3 style={{ margin: '12px 0 8px', fontSize: 18, fontWeight: 700 }}>
                Крок 3 — Коротко опишіть
              </h3>
              <textarea
                placeholder="Наприклад: Підозріла машина біля школи..."
                value={report.message}
                onChange={e => setReport(r => ({ ...r, message: e.target.value }))}
                maxLength={100}
                rows={3}
                style={styles.textarea}
              />
              <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'right', marginBottom: 16 }}>
                {report.message.length}/100
              </div>
              <button onClick={handleSubmit} disabled={loading} style={styles.btnRed}>
                {loading ? '⏳ Надсилаємо...' : '🚨 НАДІСЛАТИ ЗВЕРНЕННЯ'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    background: 'transparent',
    padding: 16,
  } as React.CSSProperties,
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  } as React.CSSProperties,
  header: {
    background: 'linear-gradient(135deg, #DC2626, #EF4444)',
    padding: '24px',
    textAlign: 'center' as const,
  },
  btnRed: {
    width: '100%',
    background: 'linear-gradient(135deg, #DC2626, #EF4444)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px 24px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,
  btnGhost: {
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    fontSize: 14,
    cursor: 'pointer',
    padding: '8px 16px',
  } as React.CSSProperties,
  locationBadge: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    color: '#166534',
    marginBottom: 8,
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    border: '2px solid #E2E8F0',
    borderRadius: 12,
    padding: '12px',
    fontSize: 15,
    fontFamily: 'inherit',
    resize: 'none' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
};

