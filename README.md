# Guide d'Installation et de Configuration - Projet NFT Minting dApp

## Prérequis
- Node.js (version 16 ou supérieure)
- Visual Studio Code
- MetaMask

## Configuration Initiale

1. Créez un nouveau dossier pour votre projet
```bash
mkdir mon-projet-nft
cd mon-projet-nft
```

2. Initialisez un projet React
```bash
npx create-react-app .
```

3. Installez les dépendances principales
```bash
npm install ethers@5.7.2 react-toastify@9.1.3 lucide-react@0.263.1
```

4. Installez Tailwind CSS et ses dépendances
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

5. Configurez Tailwind CSS
Créez ou modifiez `tailwind.config.js` :
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-color': '#votre-code-hex',
      },
    },
  },
  plugins: [],
}
```

6. Créez ou modifiez `postcss.config.js` :
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

7. Dans `src/index.css`, ajoutez :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Structure des Fichiers

1. Remplacez le contenu de `src/App.js` par le code fourni
2. Créez un dossier `public/img` et ajoutez-y votre GIF `001.gif`
3. Créez un dossier `public/assets` et ajoutez-y votre logo
4. Remplacez `public/index.html` par le fichier HTML fourni
5. Vérifiez que `src/index.js` importe bien `index.css`:
```javascript
import './index.css';
```

## Personnalisation

### 1. Configuration du Smart Contract
Dans `App.js`, modifiez ces constantes :
```javascript
const MONSTERS_CONTRACT_ADDRESS = "votre_adresse_de_contrat";
const CRY_TOKEN_ADDRESS = "votre_adresse_de_token";
const REQUIRED_CHAIN_ID = votre_chain_id;
```

### 2. Modification des Polices
1. Remplacez Melted Monster :
```javascript
const CustomFontStyle = () => (
  <style>
    @import url('votre-url-de-police');
  </style>
);
```

2. Mettez à jour les styles :
```javascript
style={{ 
  fontFamily: "'Votre-Police', sans-serif",
}}
```

### 3. Personnalisation des Couleurs et Images
Modifiez les classes Tailwind :
// Fond principal
bg-gray-XXX → bg-[votre-couleur]

// En-tête
bg-gray-XXX → bg-[votre-couleur]

// Boutons principaux
bg-orange-XXX hover:bg-orange-XXX → bg-[votre-couleur] hover:bg-[votre-couleur-hover]

// Boutons secondaires
bg-purple-XXX hover:bg-purple-XXX → bg-[votre-couleur-secondaire] hover:bg-[votre-couleur-secondaire-hover]

// Autres éléments
bg-gray-XXX → bg-[votre-couleur-tertiaire]
text-orange-XXX → text-[votre-couleur]

Modifiez le logo et son style :
```javascript
<button className="bg-[votre-couleur] p-1 rounded-lg hover:bg-[votre-couleur-hover] transition-colors duration-200">
  <img 
    src="/assets/votre-logo.png"
    alt="Logo"
    className="w-16 h-8 md:w-15 md:h-10"
  />
</button>
```

Modifiez les autres images :
```javascript
<img
  src="/img/001.gif"
  alt="NFT Preview"
  className="rounded-xl w-full h-full object-cover"
/>
```

### 4. SEO et Référencement
Dans `public/index.html`, modifiez :
- Titre
- Description
- Mots-clés
- URL canonique
- Images OpenGraph
- Métadonnées Twitter

## Développement et Production

### Développement
```bash
npm start
```
Ouvrez http://localhost:3000

### Production
```bash
npm run build
```
Le build se trouve dans le dossier `build/`

### Déploiement
Pour déployer sur Netlify ou autre plateforme :
1. Créez un fichier `_redirects` dans le dossier `public` :
```
/* /index.html 200
```
2. Déployez le contenu du dossier `build`

## Résolution des Problèmes Courants

- **Erreur MetaMask** : Vérifiez que vous êtes sur le bon réseau
- **Erreur de compilation** : Vérifiez les dépendances avec `npm install`
- **Images non chargées** : Vérifiez les chemins dans `public/img` et `public/assets`
- **Styles Tailwind non appliqués** : Vérifiez les fichiers de configuration
- **Erreurs de police** : Vérifiez les imports de polices dans le HTML
- **Erreur PostCSS** : Vérifiez que `postcss.config.js` est bien configuré

## Vérification Finale
- Tous les fichiers de configuration sont présents et correctement configurés
- Les dépendances sont installées
- Les chemins d'importation sont corrects
- Les fichiers statiques sont placés dans les bons dossiers
- Les images et logos sont accessibles
- La configuration Tailwind est complète
- Le fichier PostCSS est configuré

## Notes Importantes

- Testez toujours les transactions sur un réseau de test avant la production
- Assurez-vous d'avoir suffisamment de tokens pour les frais de gas
- Vérifiez les adresses de contrat deux fois avant le déploiement
- Gardez une copie de sauvegarde des fichiers de configuration
- Vérifiez la compatibilité des versions des dépendances
- Testez l'affichage sur différents appareils et navigateurs