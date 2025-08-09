import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'octocat';
    const theme = searchParams.get('theme') || 'light';

    console.log(`[API Profile] Fetching data for user: ${username}`);

    // Récupérer les données utilisateur depuis l'API GitHub
    let user;
    try {
      const headers: HeadersInit = {
        'User-Agent': 'GitHub-Widget-Generator-App/1.0',
        'Accept': 'application/vnd.github.v3+json',
      };

      // Ajouter le token GitHub si disponible (recommandé pour éviter les rate limits)
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

      console.log(`[API Profile] Making request to GitHub API for user: ${username}`);
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers,
        // Ajouter un timeout pour éviter les blocages
        signal: AbortSignal.timeout(10000), // 10 secondes
      });

      console.log(`[API Profile] GitHub API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API Profile] GitHub API error: ${response.status} - ${errorText}`);

        if (response.status === 404) {
          throw new Error(`Utilisateur "${username}" introuvable sur GitHub`);
        } else if (response.status === 403) {
          throw new Error(`Limite de requêtes GitHub atteinte. Réessayez dans une heure.`);
        } else if (response.status === 401) {
          throw new Error(`Erreur d'authentification GitHub. Vérifiez la configuration.`);
        } else {
          throw new Error(`Erreur GitHub API: ${response.status}`);
        }
      }

      user = await response.json();
      console.log(`[API Profile] Successfully fetched user data for: ${user.login}`);
    } catch (error) {
      console.error('[API Profile] Error fetching GitHub user:', error);
      // Fallback vers des données de test si l'API GitHub échoue
      console.log(`[API Profile] Using fallback data for user: ${username}`);
      user = {
        name: username === 'aloneday-91' ? 'AloneDay-91' : 'John Doe',
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
      cardBg: isDark ? '#171717' : '#ffffff', // bg-gray-900 : bg-white
      cardText: isDark ? '#ffffff' : '#171717', // text-white : text-gray-900
      cardBorder: isDark ? '#404040' : '#404040', // border-gray-700 : border par défaut

      // Text colors
      primaryText: isDark ? '#ffffff' : '#171717', // text-white : text-gray-900
      secondaryText: isDark ? '#a3a3a3' : '#525252', // text-gray-400 : text-gray-600
      bioText: isDark ? '#d4d4d4' : '#404040', // text-gray-300 : text-gray-700

      // Stats background
      statsBg: isDark ? '#262626' : '#fafafa', // bg-gray-800 : bg-gray-50
      statsText: isDark ? '#a3a3a3' : '#525252', // text-gray-400 : text-gray-600
    };

    console.log(`Generating widget for user: ${user.login}`);

    // Calculer les dimensions dynamiquement basées sur le contenu
    const cardPadding = 24;
    const cardWidth = 384;

    // Calculer la hauteur basée sur le contenu
    let contentHeight = 0;

    // Header (avatar + nom) : 64px + margins
    contentHeight += 64 + 16; // avatar height + marginBottom

    // Bio si présente
    if (user.bio) {
      const bioLines = Math.ceil(user.bio.length / 50); // Approximation des lignes
      contentHeight += (bioLines * 20) + 16; // line height * lines + marginBottom
    }

    // Informations (location, company, blog)
    const infoCount = [user.location, user.company, user.blog].filter(Boolean).length;
    if (infoCount > 0) {
      contentHeight += (infoCount * 28) + 16; // hauteur par info + marginBottom
    }

    // Stats : 60px + marginBottom
    contentHeight += 60;

    // Ajouter les paddings de la card
    const cardHeight = contentHeight + (cardPadding * 2);

    // Dimensions finales sans padding - card collée aux bords
    const svgPadding = 0;
    const finalWidth = cardWidth;
    const finalHeight = cardHeight;

    console.log(`Calculated dimensions: ${finalWidth}x${finalHeight} (content: ${contentHeight}px)`);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start', // Coller en haut
            justifyContent: 'flex-start', // Coller à gauche
            // Forcer la transparence en annulant le CSS par défaut de Next.js OG
              backgroundColor: 'rgba(0,0,0,0)',
            fontFamily: 'system-ui',
            // Pas de padding du tout
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
                <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primaryText, display: 'flex' }}>
                  {user.name || user.login}
                </div>
                <div style={{ fontSize: '14px', color: colors.secondaryText, display: 'flex' }}>
                  @{user.login}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div style={{ fontSize: '14px', color: colors.bioText, marginBottom: '16px', lineHeight: '1.4', display: 'flex' }}>
                {user.bio}
              </div>
            )}

            {/* Informations utilisateur */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {user.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{display: 'flex'}}>📍</div>
                  <div style={{ color: colors.primaryText, display: 'flex' }}>{user.location}</div>
                </div>
              )}
              {user.company && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{display: 'flex'}}>🏢</div>
                  <div style={{ color: colors.primaryText, display: 'flex' }}>{user.company}</div>
                </div>
              )}
              {user.blog && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{display: 'flex'}}>🔗</div>
                  <div style={{ color: '#3b82f6', display: 'flex' }}>{user.blog.replace(/^https?:\/\//, '')}</div>
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
                <div style={{ fontSize: '18px', fontWeight: '600', color: colors.primaryText, display: 'flex' }}>
                  {user.public_repos}
                </div>
                <div style={{ fontSize: '12px', color: colors.statsText, display: 'flex' }}>
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
                <div style={{ fontSize: '18px', fontWeight: '600', color: colors.primaryText, display: 'flex' }}>
                  {user.followers}
                </div>
                <div style={{ fontSize: '12px', color: colors.statsText, display: 'flex' }}>
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
                <div style={{ fontSize: '18px', fontWeight: '600', color: colors.primaryText, display: 'flex' }}>
                  {user.following}
                </div>
                <div style={{ fontSize: '12px', color: colors.statsText, display: 'flex' }}>
                  Following
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: finalWidth,
        height: finalHeight,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error: unknown) {
    console.error('DETAILED ERROR in profile widget:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
      name: error instanceof Error ? error.name : undefined
    });

    return new Response(`Error generating profile widget: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
