# Configuration Electron pour École La Roseraie

## Installation et Configuration

L'application est maintenant configurée pour fonctionner à la fois en mode web et en application desktop Electron avec sauvegarde hybride.

### Scripts à ajouter dans package.json

Ajoutez ces scripts dans votre `package.json` :

```json
{
  "scripts": {
    "electron": "electron public/electron.js",
    "electron:dev": "concurrently \"npm run dev\" \"node scripts/dev-electron.js\"",
    "electron:build": "npm run build && node scripts/build-electron.js",
    "electron:pack": "npm run build && electron-builder",
    "electron:dist": "npm run build && electron-builder --publish=never"
  },
  "main": "public/electron.js"
}
```

**Configuration automatique:** L'application utilise le fichier `electron-builder.yml` pour la configuration.

## Usage

### Développement
```bash
# Démarrer en mode développement (web + Electron)
npm run electron:dev
```

### Production
```bash
# Construire l'application web
npm run build

# Construire l'exécutable Electron (avec vérifications)
npm run electron:build

# Alternative: Construction directe
npm run electron:pack
```

### Étapes pour créer l'exécutable Windows
1. `npm run build` - Construit l'app web dans /dist
2. `npm run electron:build` - Vérifie et construit l'exécutable
3. L'exécutable .exe se trouve dans `/dist-electron/`

## Fonctionnalités

### Sauvegarde Hybride
- **Stockage principal** : Supabase (synchronisation cloud)
- **Sauvegarde locale** : Fichier automatique sur le disque dur
- **Export manuel** : Sauvegarde vers fichier JSON avec dialogue
- **Import** : Restauration depuis fichier JSON
- **Auto-sauvegarde** : Toutes les 5 minutes (configurable)

### Menus Electron
- **Fichier** : Sauvegarder/Importer des données
- **Édition** : Fonctions classiques (Copier/Coller)
- **Affichage** : Zoom, plein écran, DevTools
- **Aide** : Informations sur l'application

### Sécurité des Données
- Les données ne se perdent jamais grâce à la double sauvegarde
- Synchronisation automatique entre local et cloud
- Export/Import pour migration facile
- Sauvegarde automatique en arrière-plan

## Raccourcis Clavier

- `Ctrl+S` / `Cmd+S` : Sauvegarder les données
- `Ctrl+O` / `Cmd+O` : Importer des données
- `Ctrl+Q` / `Cmd+Q` : Quitter l'application
- `F12` : Outils de développement

## Architecture

```
├── Web App (Vite + React)
│   ├── Données en temps réel via Supabase
│   └── Sauvegarde LocalStorage
│
├── Electron App
│   ├── Interface web intégrée
│   ├── Sauvegarde fichier système
│   ├── Menus natifs
│   └── Dialogues de fichiers
│
└── Sauvegarde Hybride
    ├── Supabase (principal)
    ├── Local (backup)
    └── Export manuel (sécurité)
```

## Classes d'École Configurées

L'application est configurée avec les classes suivantes :
- Maternelle 1
- Maternelle 2  
- CI (Cours d'Initiation)
- CP (Cours Préparatoire)
- CE1 (Cours Élémentaire 1)
- CE2 (Cours Élémentaire 2)
- CM1 (Cours Moyen 1)
- CM2 (Cours Moyen 2)

## Authentification Supprimée

L'authentification Supabase a été complètement supprimée :
- ✅ Toutes les politiques RLS supprimées
- ✅ Tables profiles/users supprimées  
- ✅ Fonctions d'authentification supprimées
- ✅ Configuration client Supabase nettoyée
- ✅ Interface d'authentification supprimée

L'application fonctionne maintenant sans système de connexion, permettant un accès direct à toutes les fonctionnalités.