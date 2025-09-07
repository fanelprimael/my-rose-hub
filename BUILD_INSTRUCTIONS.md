# Instructions pour créer l'application Electron (.exe)

## 📋 Prérequis

1. **Node.js** (version 18 ou plus récente)
   - Télécharger sur : https://nodejs.org/
   - Vérifier l'installation : `node --version`

2. **Git** (optionnel, pour cloner le projet)
   - Télécharger sur : https://git-scm.com/

## 🔧 Étapes d'installation

### 1. Récupérer le projet
Si vous avez le code source dans un dossier, ouvrez un terminal dans ce dossier.

### 2. Installer les dépendances principales
```bash
npm install
```

### 3. Installer les dépendances Electron
```bash
# Aller dans le dossier electron
cd electron

# Installer les dépendances Electron
npm install electron electron-builder --save-dev

# Revenir au dossier principal
cd ..
```

### 4. Construire l'application web
```bash
npm run build
```

### 5. Créer l'exécutable (.exe)
```bash
# Option 1: Build simple
cd electron
npm run build

# Option 2: Build avec distribution complète
npm run dist
```

## 📁 Structure des fichiers

Après la construction, vous trouverez :
- `electron/dist-electron/` : Contient l'installateur .exe
- `Gestion Scolaire Roseraie Setup 1.0.0.exe` : L'installateur final

## 🚀 Utilisation

### Version en ligne (développement)
```bash
npm run dev
```

### Version Electron (développement)
```bash
# Terminal 1: Démarrer le serveur web
npm run dev

# Terminal 2: Démarrer Electron
cd electron
npm run dev
```

## ✨ Fonctionnalités de l'app Electron

### 🔄 Synchronisation Hybride
- **Données en ligne** : Synchronisation avec Supabase (internet requis)
- **Sauvegarde locale** : Données automatiquement sauvées sur le PC
- **Mode hors ligne** : Accès aux dernières données même sans internet

### 💾 Sauvegarde automatique
- Sauvegarde toutes les 5 minutes
- Sauvegarde après chaque modification
- Conservation des 30 dernières sauvegardes
- Localisation : `C:\\Users\\[Utilisateur]\\AppData\\Roaming\\gestion-scolaire-roseraie\\school-data\\`

### 📤 Export des données
- Export manuel vers n'importe quel dossier
- Format JSON complet avec toutes les données
- Possibilité de copier sur clé USB

## 🔧 Dépannage

### Erreur "Node.js not found"
- Installer Node.js depuis https://nodejs.org/
- Redémarrer le terminal

### Erreur "npm not recognized"
- Vérifier que Node.js est bien installé
- Redémarrer l'ordinateur si nécessaire

### L'application ne se lance pas
- Vérifier que tous les fichiers sont présents
- Exécuter en tant qu'administrateur si nécessaire

### Problème de synchronisation
- Vérifier la connexion internet
- Les données locales restent accessibles même hors ligne

## 📞 Support

En cas de problème :
1. Vérifier que toutes les étapes ont été suivies
2. Vérifier la connexion internet pour la synchronisation
3. Les données locales sont toujours accessibles dans l'application

## 🔒 Sécurité des données

- **Données chiffrées** : Connexion sécurisée avec Supabase
- **Sauvegarde locale** : Fichiers stockés de manière sécurisée sur le PC
- **Accès contrôlé** : Authentification requise pour accéder aux données