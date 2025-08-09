import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'octocat';

    console.log(`[API User] Fetching user data for: ${username}`);

    const headers: HeadersInit = {
      'User-Agent': 'GitHub-Widget-Generator-App/1.0',
      'Accept': 'application/vnd.github.v3+json',
    };

    // Ajouter le token GitHub si disponible
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[API User] GitHub API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API User] GitHub API error: ${response.status} - ${errorText}`);

      if (response.status === 404) {
        return NextResponse.json(
          { error: `Utilisateur "${username}" introuvable sur GitHub` },
          { status: 404 }
        );
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: `Limite de requêtes GitHub atteinte. Réessayez plus tard.` },
          { status: 403 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: `Erreur d'authentification GitHub.` },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `Erreur GitHub API: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const userData = await response.json();
    console.log(`[API User] Successfully fetched user data for: ${userData.login}`);

    return NextResponse.json(userData);

  } catch (error) {
    console.error('[API User] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des données utilisateur' },
      { status: 500 }
    );
  }
}
