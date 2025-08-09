'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechStack, GitHubUser } from '@/types/github';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GitHubWidget from '@/components/GitHubWidget';
import TechStackCard from '@/components/TechStackCard';

const defaultTechStack: TechStack[] = [
	// Langages de programmation
	{ name: 'JavaScript', icon: '🟨', color: '#F7DF1E' },
	{ name: 'PHP', icon: '🐘', color: '#777BB4' },
	{ name: 'Python', icon: '🐍', color: '#3776AB' },
	{ name: 'HTML', icon: '🌐', color: '#E34F26' },
	{ name: 'CSS', icon: '🎨', color: '#1572B6' },
	{ name: 'C++', icon: '⚡', color: '#00599C' },
	{ name: 'Bash', icon: '💻', color: '#4EAA25' },
	{ name: 'JSON', icon: '📄', color: '#000000' },
	{ name: 'MySQL', icon: '🗄️', color: '#4479A1' },
	{ name: 'PowerShell', icon: '🔷', color: '#5391FE' },
	{ name: 'Sass', icon: '💅', color: '#CC6699' },
	{ name: 'Markdown', icon: '📝', color: '#000000' },

	// Frameworks et bibliothèques
	{ name: 'Tailwind CSS', icon: '🎨', color: '#06B6D4' },
	{ name: 'React', icon: '⚛️', color: '#61DAFB' },
	{ name: 'Next.js', icon: '▲', color: '#000000' },
	{ name: 'Node.js', icon: '🟢', color: '#339933' },
	{ name: 'Vue.js', icon: '💚', color: '#4FC08D' },
	{ name: 'Bootstrap', icon: '🅱️', color: '#7952B3' },
	{ name: 'Express', icon: '🚀', color: '#000000' },

	// Outils et services
	{ name: 'Git', icon: '📋', color: '#F05032' },
	{ name: 'MongoDB', icon: '🍃', color: '#47A248' },

	// Technologies populaires (conservées)
	{ name: 'TypeScript', icon: '📘', color: '#3178C6' },
	{ name: 'Angular', icon: '🅰️', color: '#DD0031' },
	{ name: 'Docker', icon: '🐳', color: '#2496ED' },
];

export default function WidgetPreview() {
	const [username, setUsername] = useState('octocat');
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [selectedTech, setSelectedTech] = useState<TechStack[]>([
		defaultTechStack.find((t) => t.name === 'React')!,
		defaultTechStack.find((t) => t.name === 'TypeScript')!,
		defaultTechStack.find((t) => t.name === 'Next.js')!,
		defaultTechStack.find((t) => t.name === 'JavaScript')!,
	]);
	const [widgetType, setWidgetType] = useState<'profile' | 'tech' | 'both'>(
		'both'
	);
	const [useAutoTech, setUseAutoTech] = useState(true);
	const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
	const [detectedTech, setDetectedTech] = useState<TechStack[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Utilisateurs GitHub populaires pour les suggestions
	const popularUsers = [
		'octocat',
		'torvalds',
		'gaearon',
		'sindresorhus',
		'tj',
		'addyosmani',
		'kentcdodds',
		'wesbos',
		'bradtraversy',
		'mojombo'
	];

	// Fonction pour rechercher un utilisateur GitHub
	const searchGitHubUser = async (searchUsername: string) => {
		if (!searchUsername.trim()) return;

		setIsLoading(true);
		setError('');

		try {
			// Utiliser notre nouvelle API /api/user qui a accès au token GitHub
			const userResponse = await fetch(`/api/user?username=${searchUsername}`);

			if (!userResponse.ok) {
				const errorData = await userResponse.json();
				throw new Error(errorData.error || `Erreur lors de la récupération des données pour ${searchUsername}`);
			}

			const userData = await userResponse.json();
			setGithubUser(userData);

			// Si mode auto-détection, simuler la détection de technologies
			// En production, vous pourriez créer une API /api/user-tech pour récupérer les vraies technos
			if (useAutoTech) {
				// Simuler quelques technologies basées sur le nom d'utilisateur
				let detectedTechs = ['JavaScript', 'TypeScript'];

				if (searchUsername.includes('react') || searchUsername.includes('next')) {
					detectedTechs.push('React', 'Next.js');
				}
				if (searchUsername.includes('vue')) {
					detectedTechs.push('Vue.js');
				}
				if (searchUsername.includes('python') || searchUsername.includes('django')) {
					detectedTechs.push('Python');
				}
				if (searchUsername.includes('node')) {
					detectedTechs.push('Node.js');
				}

				// Ajouter quelques technos communes
				detectedTechs.push('Git', 'HTML', 'CSS');

				const detected = detectedTechs.map(lang => {
					const existing = defaultTechStack.find(t => t.name === lang);
					return existing || { name: lang, icon: '💻', color: '#6B7280' };
				}).slice(0, 6);

				setDetectedTech(detected);
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Erreur inconnue');
			setGithubUser(null);
			setDetectedTech([]);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleTech = (tech: TechStack) => {
		setSelectedTech((prev) => {
			const exists = prev.find((t) => t.name === tech.name);
			if (exists) {
				return prev.filter((t) => t.name !== tech.name);
			} else {
				return [...prev, tech];
			}
		});
	};

	const generateWidgetUrl = (type: 'profile' | 'tech') => {
		// Utiliser une URL relative ou vérifier si window est disponible
		const baseUrl =
			typeof window !== 'undefined'
				? window.location.origin
				: 'http://localhost:3000';

		if (type === 'profile') {
			const params = new URLSearchParams({
				username: username || 'john-doe',
				theme,
			});
			return `${baseUrl}/api/profile?${params.toString()}`;
		} else {
			const params = new URLSearchParams({
				username: username || 'john-doe',
				theme,
				tech: selectedTech.map((t) => t.name).join(','),
			});
			return `${baseUrl}/api/tech?${params.toString()}`;
		}
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-2">
					GitHub Widget Generator
				</h1>
				<p className="text-gray-600">
					Créez des widgets personnalisés pour votre profil GitHub
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{/* Configuration */}
				<Card>
					<CardHeader>
						<CardTitle>Configuration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="username">Nom d&apos;utilisateur GitHub</Label>
							<div className="flex gap-2">
								<Input
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="octocat"
									onKeyPress={(e) => e.key === 'Enter' && searchGitHubUser(username)}
								/>
								<Button
									onClick={() => searchGitHubUser(username)}
									disabled={isLoading || !username.trim()}
									size="lg"
								>
									{isLoading ? '...' : 'Rechercher'}
								</Button>
							</div>

							{error && (
								<p className="text-xs text-red-500 mt-1">{error}</p>
							)}

							{githubUser && (
								<div className="mt-2 p-2 bg-green-50 rounded text-xs">
									Utilisateur trouvé : <strong>{githubUser.name || githubUser.login}</strong>
									{useAutoTech && detectedTech.length > 0 && (
										<div className="mt-1">
											Technologies détectées : {detectedTech.map(t => t.name).join(', ')}
										</div>
									)}
								</div>
							)}

							<div className="mt-2">
								<Label className="text-xs">Utilisateurs populaires :</Label>
								<div className="flex flex-wrap gap-1 mt-1">
									{popularUsers.slice(0, 5).map((user) => (
										<Button
											key={user}
											variant="outline"
											size="sm"
											className="text-xs h-6"
											onClick={() => {
												setUsername(user);
												searchGitHubUser(user);
											}}
										>
											{user}
										</Button>
									))}
								</div>
							</div>
						</div>

						<div>
							<Label>Type de widget</Label>
							<div className="flex space-x-2 mt-1">
								<Button
									variant={
										widgetType === 'profile' ? 'default' : 'outline'
									}
									onClick={() => setWidgetType('profile')}
									size="sm"
								>
									Profil
								</Button>
								<Button
									variant={widgetType === 'tech' ? 'default' : 'outline'}
									onClick={() => setWidgetType('tech')}
									size="sm"
								>
									Technologies
								</Button>
								<Button
									variant={
										widgetType === 'both' ? 'default' : 'outline'
									}
									onClick={() => setWidgetType('both')}
									size="sm"
								>
									Les deux
								</Button>
							</div>
						</div>

						<div>
							<Label>Thème</Label>
							<div className="flex space-x-2 mt-1">
								<Button
									variant={theme === 'light' ? 'default' : 'outline'}
									onClick={() => setTheme('light')}
									size="sm"
								>
									Clair
								</Button>
								<Button
									variant={theme === 'dark' ? 'default' : 'outline'}
									onClick={() => setTheme('dark')}
									size="sm"
								>
									Sombre
								</Button>
							</div>
						</div>

						{(widgetType === 'tech' || widgetType === 'both') && (
							<div>
								<Label>Technologies</Label>
								<div className="space-y-2">
									<div className="flex space-x-2">
										<Button
											variant={useAutoTech ? 'default' : 'outline'}
											onClick={() => setUseAutoTech(true)}
											size="sm"
										>
											🤖 Auto-détection
										</Button>
										<Button
											variant={!useAutoTech ? 'default' : 'outline'}
											onClick={() => setUseAutoTech(false)}
											size="sm"
										>
											📝 Manuel
										</Button>
									</div>

									{useAutoTech ? (
										<p className="text-xs text-gray-500">
											Les technologies seront détectées automatiquement depuis les repositories de @{username}
										</p>
									) : (
										<div className="grid grid-cols-2 gap-2">
											{defaultTechStack.map((tech) => (
												<Button
													key={tech.name}
													variant={
														selectedTech.find((t) => t.name === tech.name)
															? 'default'
															: 'outline'
													}
													size="sm"
													onClick={() => toggleTech(tech)}
													className="justify-start"
												>
													<span className="mr-1">{tech.icon}</span>
													{tech.name}
												</Button>
											))}
										</div>
									)}
								</div>
							</div>
						)}

						<div className="space-y-4">
							{(widgetType === 'profile' || widgetType === 'both') && (
								<div className="space-y-2">
									<Label>URL du widget Profil</Label>
									<div className="p-2 bg-gray-100 rounded text-xs font-mono break-all">
										{generateWidgetUrl('profile')}
									</div>
									<Button
										onClick={() =>
											navigator.clipboard.writeText(
												generateWidgetUrl('profile')
											)
										}
										size="sm"
										variant="outline"
										className="w-full"
									>
										Copier l&apos;URL Profil
									</Button>
								</div>
							)}

							{(widgetType === 'tech' || widgetType === 'both') &&
								selectedTech.length > 0 && (
									<div className="space-y-2">
										<Label>URL du widget Technologies</Label>
										<div className="p-2 bg-gray-100 rounded text-xs font-mono break-all">
											{generateWidgetUrl('tech')}
										</div>
										<Button
											onClick={() =>
												navigator.clipboard.writeText(
													generateWidgetUrl('tech')
												)
											}
											size="sm"
											variant="outline"
											className="w-full"
										>
											Copier l&apos;URL Technologies
										</Button>
									</div>
								)}
						</div>
					</CardContent>
				</Card>

				{/* Prévisualisation */}
				<Card>
					<CardHeader>
						<CardTitle>Prévisualisation</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							{(widgetType === 'profile' || widgetType === 'both') && (
								<div>
									<div className="flex justify-center">
										<GitHubWidget
											theme={theme}
											user={githubUser || undefined}
										/>
									</div>
								</div>
							)}

							{(widgetType === 'tech' || widgetType === 'both') &&
								(useAutoTech ? detectedTech.length > 0 : selectedTech.length > 0) && (
									<div>
										<div className="flex justify-center">
											<TechStackCard
												techStack={useAutoTech ? detectedTech : selectedTech}
												theme={theme}
												user={githubUser || undefined}
											/>
										</div>
									</div>
								)}

							{!githubUser && (
								<div className="text-center p-4 text-gray-500">
									<p className="mb-2">🔍 Recherchez un utilisateur GitHub pour voir la prévisualisation</p>
									<p className="text-xs">Ou cliquez sur un des utilisateurs populaires ci-dessus</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Comment utiliser dans votre README</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{(widgetType === 'profile' || widgetType === 'both') && (
						<div>
							<Label>Widget Profil :</Label>
							<div className="p-3 bg-gray-100 rounded font-mono text-sm">
								{`![GitHub Profile Widget](${generateWidgetUrl('profile')})`}
							</div>
						</div>
					)}

					{(widgetType === 'tech' || widgetType === 'both') &&
						selectedTech.length > 0 && (
							<div>
								<Label>Widget Technologies :</Label>
								<div className="p-3 bg-gray-100 rounded font-mono text-sm">
									{`![GitHub Tech Widget](${generateWidgetUrl('tech')})`}
								</div>
							</div>
						)}

					{widgetType === 'both' && (
						<div>
							<Label>Les deux widgets ensemble :</Label>
							<div className="p-3 bg-gray-100 rounded font-mono text-sm">
								{`![GitHub Profile Widget](${generateWidgetUrl('profile')})\n![GitHub Tech Widget](${generateWidgetUrl('tech')})`}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
