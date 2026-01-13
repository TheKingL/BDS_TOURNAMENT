# 🏆 BDS Tournament

🌐 **[Voir le site en ligne](https://thekingl.github.io/BDS_TOURNAMENT/)**

[![Deploy to GitHub Pages](https://github.com/TheKingL/BDS_TOURNAMENT/actions/workflows/deploy.yml/badge.svg)](https://github.com/TheKingL/BDS_TOURNAMENT/actions/workflows/deploy.yml)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)

---

## 🎯 Tournois

| Tournoi | Format |
|---------|--------|
| ⚽ **Babyfoot** | Poules + Bracket |
| 🏓 **Ping-Pong Solo** | Ligue + Bracket |
| 🏓 **Ping-Pong Duo** | Ligue + Bracket |

---

## 🛠️ Technologies

- **React 19** - Framework UI moderne
- **Tailwind CSS 4** - Styling utility-first
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation SPA
- **GitHub Actions** - CI/CD automatique

---

## 🚀 Installation

```bash
# Cloner le repo
git clone https://github.com/TheKingL/BDS_TOURNAMENT.git
cd BDS_TOURNAMENT

# Installer les dépendances
npm install

# Lancer en local
npm run dev
```

Le site sera accessible sur `http://localhost:5173/BDS_TOURNAMENT/`

---

## 📦 Déploiement

### Automatique (recommandé)

Chaque push sur `main` déclenche automatiquement :
1. Build du projet (`npm run build`)
2. Déploiement sur GitHub Pages

**Configuration requise :**
- Settings → Pages → Source: **GitHub Actions**

### Manuel

```bash
npm run build
# Le dossier dist/ contient le site statique
```

---

## 🔐 Page Admin

> ⚠️ **Disponible uniquement en développement local**

```bash
npm run dev
# Accéder à http://localhost:5173/BDS_TOURNAMENT/admin
```

La page admin permet de :
- Modifier les scores des matchs
- Valider les résultats
- Gérer les 3 tournois

**En production**, la route `/admin` retourne une erreur 404.

---

## 📁 Architecture

```
src/
├── components/       # Composants réutilisables
├── pages/
│   ├── babyfoot/     # Pages Babyfoot
│   ├── pingpong-solo/# Pages Ping-Pong Solo
│   ├── pingpong-duo/ # Pages Ping-Pong Duo
│   ├── errors/       # Pages d'erreur (404, 500...)
│   ├── AdminPage.jsx # Admin (dev only)
│   └── HomePage.jsx  # Accueil
public/
└── data/             # Données JSON des tournois
```

---

## 🎨 Mode de fonctionnement

| Mode | Description |
|------|-------------|
| **Local** | Site dynamique avec page admin pour modifier les scores |
| **Production** | Site statique (vitrine) avec données figées au moment du build |

Pour mettre à jour les scores en production :
1. Modifier les JSON via l'admin local
2. Commit & Push → Déploiement automatique

---

## 📄 License

MIT © 2026 BDS ESIGELEC
