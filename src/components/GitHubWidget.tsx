import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GitHubUser, TechStack } from "@/types/github";
import { MapPin, Building, Link as LinkIcon, Calendar } from "lucide-react";
import Image from "next/image";

interface GitHubWidgetProps {
  user?: GitHubUser;
  theme?: 'light' | 'dark';
}

export default function GitHubWidget({ user, techStack = [], theme = 'light' }: GitHubWidgetProps) {
  // Données de test par défaut si aucun user n'est fourni
  const defaultUser = {
    name: 'John Doe',
    login: 'john-doe',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Full-stack developer passionate about creating amazing user experiences with modern technologies.',
    public_repos: 42,
    followers: 1250,
    following: 180,
    location: 'Paris, France',
    company: 'Tech Innovation Co.',
    blog: 'johndoe.dev',
    created_at: '2019-03-15T10:30:00Z'
  };

  const currentUser = user || defaultUser;

  return (
    <Card className={`w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-700' : 'bg-white text-neutral-900'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Image
            src={currentUser.avatar_url}
            alt={`${currentUser.name} avatar`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{currentUser.name || currentUser.login}</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              @{currentUser.login}
            </p>
          </div>
        </div>
        {currentUser.bio && (
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {currentUser.bio}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informations utilisateur */}
        <div className="space-y-2">
          {currentUser.location && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{currentUser.location}</span>
            </div>
          )}
          {currentUser.company && (
            <div className="flex items-center space-x-2 text-sm">
              <Building className="w-4 h-4" />
              <span>{currentUser.company}</span>
            </div>
          )}
          {currentUser.blog && (
            <div className="flex items-center space-x-2 text-sm">
              <LinkIcon className="w-4 h-4" />
              <a href={currentUser.blog} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                {currentUser.blog.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Statistiques GitHub */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
            <div className="text-lg font-semibold">{currentUser.public_repos}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Repos</div>
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
            <div className="text-lg font-semibold">{currentUser.followers}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Followers</div>
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
            <div className="text-lg font-semibold">{currentUser.following}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Following</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
