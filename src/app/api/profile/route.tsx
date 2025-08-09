import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'octocat';
    const theme = searchParams.get('theme') || 'light';

    // Récupérer les données utilisateur depuis l'API GitHub
    let user;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'User-Agent': 'GitHub-Widget-Generator',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      user = await response.json();
    } catch (error) {
      console.error('Error fetching GitHub user:', error);
      // Fallback vers des données de test si l'API GitHub échoue
      user = {
        name: 'John Doe',
        login: username,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        bio: 'Full-stack developer passionate about creating amazing user experiences.',
        public_repos: 42,
        followers: 1250,
        following: 180,
        location: 'Paris, France',
        company: 'Tech Innovation Co.',
        blog: 'johndoe.dev',
        created_at: '2020-03-15T10:30:00Z',
      };
    }

    const isDark = theme === 'dark';

    // Couleurs exactes du composant Tailwind
    const colors = {
      // Card background
      cardBg: isDark ? '#111827' : '#ffffff', // bg-gray-900 : bg-white
      cardText: isDark ? '#ffffff' : '#111827', // text-white : text-gray-900
      cardBorder: isDark ? '#374151' : '#e5e7eb', // border-gray-700 : border par défaut

      // Text colors
      primaryText: isDark ? '#ffffff' : '#111827', // text-white : text-gray-900
      secondaryText: isDark ? '#9ca3af' : '#4b5563', // text-gray-400 : text-gray-600
      bioText: isDark ? '#d1d5db' : '#374151', // text-gray-300 : text-gray-700

      // Stats background
      statsBg: isDark ? '#1f2937' : '#f9fafb', // bg-gray-800 : bg-gray-50
      statsText: isDark ? '#9ca3af' : '#4b5563', // text-gray-400 : text-gray-600
    };

    console.log(`Generating widget for user: ${user.login}`);

    // Générer l'ImageResponse avec les vraies données
    const response = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: 'system-ui',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: colors.cardBg,
              color: colors.cardText,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '8px',
              width: '384px',
              padding: '24px',
            }}
          >
            {/* Header avec avatar et nom */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <img
                src={user.avatar_url}
                alt="avatar"
                width={64}
                height={64}
                style={{ borderRadius: '50%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primaryText, display: 'flex', }}>
                  {user.name || user.login}
                </div>
                <div style={{ fontSize: '14px', color: colors.secondaryText, display: 'flex', }}>
                  @{user.login}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div style={{ fontSize: '14px', color: colors.bioText, marginBottom: '16px', lineHeight: '1.4', display: 'flex', }}>
                {user.bio}
              </div>
            )}

            {/* Informations utilisateur */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {user.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{display: 'flex',}}>📍</div>
                  <div style={{ color: colors.primaryText, display: 'flex', }}>{user.location}</div>
                </div>
              )}
              {user.company && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{display: 'flex',}}>🏢</div>
                  <div style={{ color: colors.primaryText, display: 'flex' }}>{user.company}</div>
                </div>
              )}
              {user.blog && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{display: 'flex',}}>🔗</div>
                  <div style={{ color: '#3b82f6', display: 'flex', }}>{user.blog.replace(/^https?:\/\//, '')}</div>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: colors.statsBg,
                padding: '8px',
                borderRadius: '6px',
                flex: 1
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: colors.primaryText, display: 'flex', }}>
                  {user.public_repos}
                </div>
                <div style={{ fontSize: '12px', color: colors.statsText, display: 'flex', }}>
                  Repos
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: colors.statsBg,
                padding: '8px',
                borderRadius: '6px',
                flex: 1
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: colors.primaryText, display: 'flex', }}>
                  {user.followers}
                </div>
                <div style={{ fontSize: '12px', color: colors.statsText, display: 'flex', }}>
                  Followers
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: colors.statsBg,
                padding: '8px',
                borderRadius: '6px',
                flex: 1
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: colors.primaryText, display: 'flex', }}>
                  {user.following}
                </div>
                <div style={{ fontSize: '12px', color: colors.statsText, display: 'flex', }}>
                  Following
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 480,
        height: 500,
      }
    );

    return response;

  } catch (error: any) {
    console.error('DETAILED ERROR in profile widget:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      name: error.name
    });

    return new Response(`Error generating profile widget: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
