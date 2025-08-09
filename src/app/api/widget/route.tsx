import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const theme = searchParams.get('theme') || 'light';
    const tech = searchParams.get('tech')?.split(',') || [];

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    // Récupérer les données de l'utilisateur GitHub
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) {
      return new Response('User not found', { status: 404 });
    }
    const user = await userResponse.json();

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1f2937';
    const secondaryColor = isDark ? '#9ca3af' : '#6b7280';
    const cardBg = isDark ? '#374151' : '#f9fafb';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: bgColor,
              border: `2px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              borderRadius: '16px',
              padding: '24px',
              width: '520px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header avec avatar et nom */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <img
                src={user.avatar_url}
                alt={`${user.name} avatar`}
                width={64}
                height={64}
                style={{
                  borderRadius: '50%',
                  marginRight: '16px',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: textColor,
                    margin: '0',
                  }}
                >
                  {user.name || user.login}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: secondaryColor,
                    margin: '4px 0 0 0',
                  }}
                >
                  @{user.login}
                </p>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div style={{ display: 'flex', marginBottom: '16px' }}>
                <p
                  style={{
                    fontSize: '12px',
                    color: secondaryColor,
                    lineHeight: '1.4',
                    margin: '0',
                  }}
                >
                  {user.bio.length > 100 ? user.bio.substring(0, 100) + '...' : user.bio}
                </p>
              </div>
            )}

            {/* Statistiques */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: cardBg,
                  padding: '12px',
                  borderRadius: '8px',
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: textColor,
                  }}
                >
                  {user.public_repos}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: secondaryColor,
                  }}
                >
                  Repos
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: cardBg,
                  padding: '12px',
                  borderRadius: '8px',
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: textColor,
                  }}
                >
                  {user.followers}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: secondaryColor,
                  }}
                >
                  Followers
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: cardBg,
                  padding: '12px',
                  borderRadius: '8px',
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: textColor,
                  }}
                >
                  {user.following}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: secondaryColor,
                  }}
                >
                  Following
                </span>
              </div>
            </div>

            {/* Technologies */}
            {tech.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '12px' }}>
                <h3
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: textColor,
                    margin: '0 0 6px 0',
                  }}
                >
                  Technologies
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  {tech.slice(0, 6).map((techName, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: cardBg,
                        color: textColor,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '500',
                      }}
                    >
                      {techName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {user.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: secondaryColor, fontSize: '12px' }}>📍</span>
                  <span style={{ color: secondaryColor, fontSize: '11px' }}>{user.location}</span>
                </div>
              )}
              {user.company && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: secondaryColor, fontSize: '12px' }}>🏢</span>
                  <span style={{ color: secondaryColor, fontSize: '11px' }}>{user.company}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 480,
      }
    );
  } catch (error) {
    console.error('Error generating widget:', error);
    return new Response('Error generating widget', { status: 500 });
  }
}
