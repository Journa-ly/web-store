import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Journa - Discover unique designs';
export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export default async function OpengraphImage() {
  // Font
  const interSemiBold = fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #4F46E5, #7C3AED)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          color: 'white',
          padding: '40px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px'
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/icon_white.svg`}
            width="216"
            height="60"
            alt="Journa"
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              lineHeight: '1.1'
            }}
          >
            Discover Unique Designs
          </h1>
          <p
            style={{
              fontSize: '32px',
              margin: '0',
              opacity: '0.9',
              maxWidth: '800px'
            }}
          >
            Explore and shop thousands of custom designs from independent creators
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'calc(100% - 80px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '20px'
          }}
        >
          <p style={{ fontSize: '24px', opacity: '0.8' }}>www.journa.com</p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 600
        }
      ]
    }
  );
}
