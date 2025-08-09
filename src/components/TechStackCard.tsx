import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GitHubUser, TechStack } from "@/types/github";
import Image from "next/image";

interface TechStackCardProps {
  user?: GitHubUser;
  techStack?: TechStack[];
  theme?: 'light' | 'dark';
}

export default function TechStackCard({ user, techStack = [], theme = 'light' }: TechStackCardProps) {
  // Données de test par défaut si aucun user n'est fourni
  const defaultUser = {
    name: 'John Doe',
    login: 'john-doe',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  };

  // Stack technique par défaut
  const defaultTechStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Next.js', color: '#000000' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'MongoDB', color: '#47A248' }
  ];

  const currentUser = user || defaultUser;
  const currentTechStack = techStack.length > 0 ? techStack : defaultTechStack;

  return (
    <Card className={`w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-700' : 'bg-white text-neutral-900'}`}>
      <CardContent className="space-y-4">
        {/* Stack technique */}
        <div>
          <h3 className="text-sm font-medium mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {currentTechStack.map((tech, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  theme === 'dark' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-800'
                }`}
                style={{ backgroundColor: theme === 'light' ? tech.color + '20' : undefined }}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
