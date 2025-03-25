import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Journa - Create Custom Apparel with AI';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          fontFamily: 'Inter'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '160px',
            width: '500px'
          }}
        >
          {/* White Logo */}
          <img
            src="https://journa.ai/icon_white.svg"
            width="400"
            height="120"
            alt="Journa Logo"
            style={{
              objectFit: 'contain'
            }}
          />
        </div>
        <p
          style={{
            marginTop: '48px',
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white'
          }}
        >
          Journa
        </p>
        <p
          style={{
            marginTop: '12px',
            fontSize: '24px',
            color: '#888'
          }}
        >
          Create Custom Apparel with AI
        </p>
      </div>
    ),
    {
      ...size
    }
  );
}
