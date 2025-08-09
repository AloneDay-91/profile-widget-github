# GitHub Widget Generator

Un générateur de widgets personnalisés pour afficher votre profil GitHub et vos technologies dans vos README.

## 🚀 Mes Widgets

### Profil GitHub
![GitHub Profile Widget](https://profile-widget-github-e8u98ifxm-aloneday91s-projects.vercel.app/api/profile?username=aloneday-91&theme=light&v=2)

### Technologies
![GitHub Tech Widget](https://profile-widget-github-e8u98ifxm-aloneday91s-projects.vercel.app/api/tech?username=aloneday-91&theme=light&tech=React%2CTypeScript%2CNext.js%2CJavaScript&v=2)

## 📋 À propos

Ce projet permet de générer des widgets SVG dynamiques pour afficher :
- 👤 Profil GitHub (avatar, nom, bio, stats)
- 🛠️ Stack technique avec auto-détection depuis vos repositories
- 🎨 Thèmes clair/sombre personnalisables

## 🛠️ Technologies utilisées

- Next.js 14
- TypeScript
- Tailwind CSS
- API GitHub
- SVG dynamique

## 🌐 Demo

Essayez le générateur : [GitHub Widget Generator](https://profile-widget-github-e8u98ifxm-aloneday91s-projects.vercel.app/)

## ⚙️ Installation locale

```bash
git clone https://github.com/aloneday-91/profile-widget-github.git
cd profile-widget-github
npm install
npm run dev
```

Configurez votre token GitHub dans `.env.local` :
```env
GITHUB_TOKEN=your_github_token_here
```

## 📝 Utilisation

### Widget Profil
```markdown
![GitHub Profile Widget](https://profile-widget-github-e8u98ifxm-aloneday91s-projects.vercel.app/api/profile?username=votre-username&theme=light)
```

### Widget Technologies
```markdown
![GitHub Tech Widget](https://profile-widget-github-e8u98ifxm-aloneday91s-projects.vercel.app/api/tech?username=votre-username&theme=light&tech=React,TypeScript,Node.js)
```

## 🎯 Fonctionnalités

- ✅ Auto-détection des technologies depuis vos repos
- ✅ Thèmes clair/sombre
- ✅ Cache intelligent
- ✅ Responsive design
- ✅ Aucune base de données requise
- ✅ Déployable sur Vercel
