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

      await userResponse.json(); // On récupère les données mais on n'a pas besoin de les stocker

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
          for (const repo of repos.slice(0, 5)) { // Limiter à 5 repos pour éviter les rate limits
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
      // Fallback vers des données de test si l'API GitHub échoue
      console.log(`[API Tech] Using fallback tech data for user: ${username}`);
      repoLanguages = username === 'aloneday-91'
        ? ['JavaScript', 'TypeScript', 'React', 'Next.js']
        : ['JavaScript', 'TypeScript', 'Python', 'Go'];
    }

    // Utiliser les tech personnalisées ou les langages détectés
    const tech = customTech || repoLanguages.slice(0, 8); // Limiter à 8 pour l'affichage

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

      // Tech stack background
      techBg: isDark ? '#1f2937' : '#f3f4f6', // bg-gray-800 : bg-gray-100
      techText: isDark ? '#e5e7eb' : '#1f2937', // text-gray-200 : text-gray-800
    };

    // Couleurs pour les technologies
    const techColors: { [key: string]: string } = {
      // Langages de programmation
      'JavaScript': '#F7DF1E',
      'js': '#F7DF1E',
      'PHP': '#777BB4',
      'php': '#777BB4',
      'Python': '#3776AB',
      'python': '#3776AB',
      'HTML': '#E34F26',
      'html': '#E34F26',
      'CSS': '#1572B6',
      'css': '#1572B6',
      'C++': '#00599C',
      'cpp': '#00599C',
      'Bash': '#4EAA25',
      'bash': '#4EAA25',
      'JSON': '#000000',
      'json': '#000000',
      'MySQL': '#4479A1',
      'mysql': '#4479A1',
      'PowerShell': '#5391FE',
      'powershell': '#5391FE',
      'Sass': '#CC6699',
      'sass': '#CC6699',
      'Markdown': '#000000',
      'markdown': '#000000',

      // Frameworks et bibliothèques
      'Tailwind CSS': '#06B6D4',
      'tailwindcss': '#06B6D4',
      'React': '#61DAFB',
      'react': '#61DAFB',
      'Next.js': '#000000',
      'nextjs': '#000000',
      'Node.js': '#339933',
      'nodejs': '#339933',
      'Vue.js': '#4FC08D',
      'vuejs': '#4FC08D',
      'Bootstrap': '#7952B3',
      'bootstrap': '#7952B3',
      'Express': '#000000',
      'express': '#000000',

      // Outils et services
      'Git': '#F05032',
      'git': '#F05032',
      'MongoDB': '#47A248',
      'mongodb': '#47A248',

      // Technologies existantes conservées
      'TypeScript': '#3178C6',
      'Java': '#ED8B00',
      'Angular': '#DD0031',
      'Docker': '#2496ED',
      'PostgreSQL': '#336791',
      'Redis': '#DC382D',
      'AWS': '#FF9900',
      'Firebase': '#FFCA28',
      'Linux': '#FCC624',
      'C#': '#239120',
      'Go': '#00ADD8',
      'Rust': '#000000',
      'Swift': '#FA7343',
      'Kotlin': '#0095D5',
      'Flutter': '#02569B',
      'React Native': '#61DAFB',
    };

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
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '32px',
          }}
        >
          {/* Card container - max-w-md mx-auto */}
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
            }}
          >

            {/* CardContent space-y-4 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                gap: '16px', // space-y-4
              }}
            >
              {/* Stack technique - text-sm font-medium mb-2 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontSize: '14px', // text-sm
                    fontWeight: '500', // font-medium
                    marginBottom: '8px', // mb-2
                    color: colors.primaryText,
                    margin: '0 0 8px 0',
                  }}
                >
                  Technologies
                </h3>

                {/* flex flex-wrap gap-2 */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px', // gap-2
                  }}
                >
                  {tech.map((techName, index) => {
                    const techColor = techColors[techName] || '#6B7280';
                    const bgColor = isDark
                      ? colors.techBg
                      : (theme === 'light' ? techColor + '20' : colors.techBg);

                    return (
                      <span
                        key={index}
                        style={{
                          // px-2 py-1 rounded-full text-xs font-medium
                          paddingLeft: '8px', // px-2
                          paddingRight: '8px',
                          paddingTop: '4px', // py-1
                          paddingBottom: '4px',
                          borderRadius: '9999px', // rounded-full
                          fontSize: '12px', // text-xs
                          fontWeight: '500', // font-medium
                          backgroundColor: bgColor,
                          color: colors.techText,
                        }}
                      >
                        {techName}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      ),
      {
        width: 480,
        height: 400,
          headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=300',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
          }
      }
    );

    // Ajouter des headers supplémentaires à la réponse finale
    response.headers.set('X-Robots-Tag', 'noindex');
    response.headers.set('X-GitHub-Widget', 'tech');

    return response;
  } catch (error) {
    console.error('Error generating tech widget:', error);
    return new Response('Error generating tech widget', { status: 500 });
  }
}
