import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Sun Tarot - Ancient Wisdom, Modern Insight';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'serif',
                    color: '#D4A95D',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid #D4A95D',
                        padding: '40px 80px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    }}
                >
                    <div style={{ fontSize: 120, marginBottom: 20 }}>Sun Tarot</div>
                    <div style={{ fontSize: 32, color: '#A3A3A3', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Ancient Wisdom • Modern Insight
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: 40, fontSize: 24, color: '#525252' }}>
                    suntarot.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
