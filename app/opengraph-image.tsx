import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Journa - Create Custom Apparel with AI';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
  // Theme colors from tailwind config
  const colors = {
    primary: '#00d7c0',
    secondary: '#ff00d3',
    accent: '#4a00ff',
    base100: '#ffffff',
    base900: '#111827'
  };

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
          background: `linear-gradient(135deg, ${colors.base900} 0%, #1a1a1a 100%)`,
          fontFamily: 'Inter',
          color: colors.base100,
          padding: '40px'
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            background: colors.primary,
            opacity: '0.2',
            filter: 'blur(40px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '60px',
            width: '150px',
            height: '150px',
            borderRadius: '75px',
            background: colors.secondary,
            opacity: '0.15',
            filter: 'blur(50px)'
          }}
        />
        
        {/* Logo container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}
        >
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
        
        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px'
          }}
        >
          <p
            style={{
              fontSize: '32px',
              fontWeight: '600',
              color: colors.base100,
              textAlign: 'center',
              marginBottom: '16px'
            }}
          >
            Create Custom Apparel with AI
          </p>
          
          {/* Accent line */}
          <div
            style={{
              width: '120px',
              height: '4px',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: '2px',
              marginTop: '10px'
            }}
          />
        </div>
        
        {/* Call to action */}
        <p
          style={{
            marginTop: '30px',
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '400'
          }}
        >
          Create the things you wish you could buy.
        </p>
      </div>
    ),
    {
      ...size
    }
  );
} 