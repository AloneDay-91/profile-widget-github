import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'octocat';
    const theme = searchParams.get('theme') || 'light';
    const customTech = searchParams.get('tech')?.split(',');

    console.log(`[API Tech] Fetching data for user: ${username}`);

    // Récupérer les données utilisateur depuis l'API GitHub
    let repoLanguages: string[] = [];

    try {
      const headers: HeadersInit = {
        'User-Agent': 'GitHub-Widget-Generator-App/1.0',
        'Accept': 'application/vnd.github.v3+json',
      };

      // Ajouter le token GitHub si disponible
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      // Récupérer les infos de base de l'utilisateur
      const userResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });

      console.log(`[API Tech] GitHub API user response status: ${userResponse.status}`);

      if (!userResponse.ok) {
        console.error(`[API Tech] GitHub API error: ${userResponse.status}`);
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }

      await userResponse.json();

      // Si pas de tech personnalisées, récupérer les langages depuis les repos
      if (!customTech) {
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=10`, {
          headers,
          signal: AbortSignal.timeout(15000),
        });

        console.log(`[API Tech] GitHub API repos response status: ${reposResponse.status}`);

        if (reposResponse.ok) {
          const repos = await reposResponse.json();
          const languageSet = new Set<string>();

          console.log(`[API Tech] Found ${repos.length} repositories`);

          // Récupérer les langages de chaque repo
          for (const repo of repos.slice(0, 5)) {
            try {
              const langResponse = await fetch(repo.languages_url, {
                headers,
                signal: AbortSignal.timeout(5000),
              });
              if (langResponse.ok) {
                const languages = await langResponse.json();
                Object.keys(languages).forEach(lang => languageSet.add(lang));
              }
            } catch (error) {
              console.log(`[API Tech] Could not fetch languages for ${repo.name}`, error);
            }
          }

          repoLanguages = Array.from(languageSet);
          console.log(`[API Tech] Detected languages: ${repoLanguages.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('[API Tech] Error fetching GitHub data:', error);
      console.log(`[API Tech] Using fallback tech data for user: ${username}`);
      repoLanguages = username === 'aloneday-91'
        ? ['JavaScript', 'TypeScript', 'React', 'Next.js']
        : ['JavaScript', 'TypeScript', 'Python', 'Go'];
    }

    // Utiliser les tech personnalisées ou les langages détectés
    const tech = customTech || repoLanguages.slice(0, 8);

    const isDark = theme === 'dark';

    // Couleurs exactes du composant Tailwind
    const colors = {
      cardBg: isDark ? '#111827' : '#ffffff',
      cardText: isDark ? '#ffffff' : '#111827',
      cardBorder: isDark ? '#374151' : '#e5e7eb',
      primaryText: isDark ? '#ffffff' : '#111827',
      secondaryText: isDark ? '#9ca3af' : '#4b5563',
      techBg: isDark ? '#1f2937' : '#f3f4f6',
      techText: isDark ? '#e5e7eb' : '#1f2937',
    };

    // Couleurs pour les technologies
    const techColors: { [key: string]: string } = {
      'JavaScript': '#F7DF1E',
      'TypeScript': '#3178C6',
      'Python': '#3776AB',
      'PHP': '#777BB4',
      'HTML': '#E34F26',
      'CSS': '#1572B6',
      'React': '#61DAFB',
      'Next.js': '#000000',
      'Vue.js': '#4FC08D',
      'Node.js': '#339933',
      'Angular': '#DD0031',
      'Docker': '#2496ED',
      'Git': '#F05032',
      'MongoDB': '#47A248',
      'Go': '#00ADD8',
      'Rust': '#000000',
      'Swift': '#FA7343',
      'Kotlin': '#0095D5',
      'Java': '#ED8B00',
    };

    // Calculer les dimensions dynamiquement basées sur le nombre de technologies
    const cardPadding = 24;
    const cardWidth = 384;

    // Calculer la hauteur basée sur le contenu
    let contentHeight = 35; // Titre "Technologies"

    // Calculer la disposition des badges
    const badgeHeight = 28; // hauteur d'un badge avec padding
    const badgeGap = 8;     // espacement vertical entre les rangées
    const badgesPerRow = 3; // nombre de badges par rangée

    const numberOfRows = Math.ceil(tech.length / badgesPerRow);
    const badgesHeight = (numberOfRows * badgeHeight);

    contentHeight += badgesHeight; // gap du titre + badges + margin bottom

    // Ajouter les paddings de la card
    const cardHeight = contentHeight + (cardPadding * 2);

    // Dimensions finales sans padding - card collée aux bords
    const svgPadding = 0;
    const finalWidth = cardWidth;
    const finalHeight = cardHeight;

    console.log(`Tech widget calculated dimensions: ${finalWidth}x${finalHeight} (${tech.length} technologies, ${numberOfRows} rows)`);

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
            fontFamily: 'system-ui, -apple-system, sans-serif',
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
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: colors.primaryText,
                  margin: '0 0 8px 0',
                }}
              >
                Technologies
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {tech.map((techName, index) => {
                  const techColor = techColors[techName] || '#6B7280';
                  const bgColor = isDark
                    ? colors.techBg
                    : `${techColor}33`;

                  return (
                    <span
                      key={index}
                      style={{
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        paddingTop: '6px',
                        paddingBottom: '6px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: bgColor,
                        color: colors.techText,
                        border: `1px solid ${techColor}66`,
                      }}
                    >
                      {techName.length > 12 ? techName.substring(0, 10) + '...' : techName}
                    </span>
                  );
                })}
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
  } catch (error) {
    console.error('Error generating tech widget:', error);
    return new Response('Error generating tech widget', { status: 500 });
  }
}
