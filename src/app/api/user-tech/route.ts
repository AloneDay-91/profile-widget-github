import { NextRequest, NextResponse } from 'next/server';
import { TechStack } from '@/types/github';

export const runtime = 'edge';

// Type pour un repository GitHub
interface GitHubRepository {
  name: string;
  description: string | null;
  fork: boolean;
  size: number;
}

// Mapping des langages GitHub vers nos technologies
const languageMapping: Record<string, TechStack> = {
  'JavaScript': { name: 'JavaScript', icon: '🟨', color: '#F7DF1E' },
  'TypeScript': { name: 'TypeScript', icon: '📘', color: '#3178C6' },
  'Python': { name: 'Python', icon: '🐍', color: '#3776AB' },
  'PHP': { name: 'PHP', icon: '🐘', color: '#777BB4' },
  'HTML': { name: 'HTML', icon: '🌐', color: '#E34F26' },
  'CSS': { name: 'CSS', icon: '🎨', color: '#1572B6' },
  'C++': { name: 'C++', icon: '⚡', color: '#00599C' },
  'Shell': { name: 'Bash', icon: '💻', color: '#4EAA25' },
  'Java': { name: 'Java', icon: '☕', color: '#ED8B00' },
  'C': { name: 'C', icon: '🔧', color: '#00599C' },
  'Go': { name: 'Go', icon: '🐹', color: '#00ADD8' },
  'Rust': { name: 'Rust', icon: '🦀', color: '#000000' },
  'Swift': { name: 'Swift', icon: '🍎', color: '#FA7343' },
  'Kotlin': { name: 'Kotlin', icon: '🎯', color: '#7F52FF' },
  'Dart': { name: 'Dart', icon: '🎯', color: '#0175C2' },
  'Ruby': { name: 'Ruby', icon: '💎', color: '#CC342D' },
  'Vue': { name: 'Vue.js', icon: '💚', color: '#4FC08D' },
  'SCSS': { name: 'Sass', icon: '💅', color: '#CC6699' },
  'Sass': { name: 'Sass', icon: '💅', color: '#CC6699' },
};

// Détection de frameworks basée sur les noms de repos et fichiers
const detectFrameworks = (repos: GitHubRepository[]): TechStack[] => {
  const frameworks: TechStack[] = [];
  const frameworkSet = new Set<string>();

  repos.forEach(repo => {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();

    // React
    if (name.includes('react') || description.includes('react')) {
      if (!frameworkSet.has('React')) {
        frameworks.push({ name: 'React', icon: '⚛️', color: '#61DAFB' });
        frameworkSet.add('React');
      }
    }

    // Next.js
    if (name.includes('next') || description.includes('next')) {
      if (!frameworkSet.has('Next.js')) {
        frameworks.push({ name: 'Next.js', icon: '▲', color: '#000000' });
        frameworkSet.add('Next.js');
      }
    }

    // Vue.js
    if (name.includes('vue') || description.includes('vue')) {
      if (!frameworkSet.has('Vue.js')) {
        frameworks.push({ name: 'Vue.js', icon: '💚', color: '#4FC08D' });
        frameworkSet.add('Vue.js');
      }
    }

    // Node.js
    if (name.includes('node') || description.includes('node') || name.includes('express')) {
      if (!frameworkSet.has('Node.js')) {
        frameworks.push({ name: 'Node.js', icon: '🟢', color: '#339933' });
        frameworkSet.add('Node.js');
      }
    }

    // Angular
    if (name.includes('angular') || description.includes('angular')) {
      if (!frameworkSet.has('Angular')) {
        frameworks.push({ name: 'Angular', icon: '🅰️', color: '#DD0031' });
        frameworkSet.add('Angular');
      }
    }

    // Django
    if (name.includes('django') || description.includes('django')) {
      if (!frameworkSet.has('Django')) {
        frameworks.push({ name: 'Django', icon: '🐍', color: '#092E20' });
        frameworkSet.add('Django');
      }
    }

    // Docker
    if (name.includes('docker') || description.includes('docker')) {
      if (!frameworkSet.has('Docker')) {
        frameworks.push({ name: 'Docker', icon: '🐳', color: '#2496ED' });
        frameworkSet.add('Docker');
      }
    }

    // MongoDB
    if (name.includes('mongo') || description.includes('mongo')) {
      if (!frameworkSet.has('MongoDB')) {
        frameworks.push({ name: 'MongoDB', icon: '🍃', color: '#47A248' });
        frameworkSet.add('MongoDB');
      }
    }
  });

  return frameworks;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'octocat';

    console.log(`[API User-Tech] Detecting technologies for: ${username}`);

    const headers: HeadersInit = {
      'User-Agent': 'GitHub-Widget-Generator-App/1.0',
      'Accept': 'application/vnd.github.v3+json',
    };

    // Ajouter le token GitHub si disponible
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Récupérer les repositories de l'utilisateur
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        headers,
        signal: AbortSignal.timeout(10000),
      }
    );

    console.log(`[API User-Tech] GitHub repos API response status: ${reposResponse.status}`);

    if (!reposResponse.ok) {
      if (reposResponse.status === 404) {
        return NextResponse.json(
          { error: `Utilisateur "${username}" introuvable sur GitHub` },
          { status: 404 }
        );
      } else if (reposResponse.status === 403) {
        return NextResponse.json(
          { error: `Limite de requêtes GitHub atteinte. Réessayez plus tard.` },
          { status: 403 }
        );
      }
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();
    console.log(`[API User-Tech] Found ${repos.length} repositories`);

    // Analyser les langages utilisés
    const languageStats: Record<string, number> = {};

    for (const repo of repos.slice(0, 20)) { // Limiter à 20 repos pour éviter les timeouts
      if (!repo.fork && repo.size > 0) { // Ignorer les forks et repos vides
        try {
          const langResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/languages`,
            {
              headers,
              signal: AbortSignal.timeout(5000),
            }
          );

          if (langResponse.ok) {
            const languages = await langResponse.json();
            Object.entries(languages).forEach(([lang, bytes]) => {
              languageStats[lang] = (languageStats[lang] || 0) + (bytes as number);
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch languages for ${repo.name}:`, error);
        }
      }
    }

    // Convertir les stats en technologies
    const detectedTech: TechStack[] = [];
    const techSet = new Set<string>();

    // Ajouter les langages détectés (triés par usage)
    const sortedLanguages = Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 langages

    sortedLanguages.forEach(([lang]) => {
      const tech = languageMapping[lang];
      if (tech && !techSet.has(tech.name)) {
        detectedTech.push(tech);
        techSet.add(tech.name);
      }
    });

    // Ajouter les frameworks détectés
    const frameworks = detectFrameworks(repos);
    frameworks.forEach(framework => {
      if (!techSet.has(framework.name)) {
        detectedTech.push(framework);
        techSet.add(framework.name);
      }
    });

    // Ajouter Git par défaut si l'utilisateur a des repos
    if (repos.length > 0 && !techSet.has('Git')) {
      detectedTech.push({ name: 'Git', icon: '📋', color: '#F05032' });
    }

    console.log(`[API User-Tech] Detected ${detectedTech.length} technologies`);

    return NextResponse.json({
      technologies: detectedTech.slice(0, 8), // Limiter à 8 technologies
      languageStats,
      totalRepos: repos.length,
    });

  } catch (error) {
    console.error('[API User-Tech] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur lors de la détection des technologies',
        technologies: []
      },
      { status: 500 }
    );
  }
}
