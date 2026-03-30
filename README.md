# MultiPlanet 🚀
### Jeu éducatif de tables de multiplication

---

## 📁 Structure du projet

```
MultiPlanet/
├── .github/workflows/deploy.yml  ← déploiement automatique GitHub Pages
├── public/
│   └── icons/
│       ├── icon-192.png          ← icône PWA 192×192
│       ├── icon-512.png          ← icône PWA 512×512
│       └── icon-maskable.png     ← icône adaptative Android
├── src/
│   ├── main.jsx                  ← point d'entrée React
│   └── App.jsx                   ← le jeu complet
├── index.html
├── vite.config.js                ← config Vite + PWA
├── package.json
└── .gitignore
```

---

## 🚀 Étape 1 — Mettre sur GitHub

### 1a. Créer le dépôt
1. Va sur [github.com](https://github.com) → **New repository**
2. Nom du dépôt : **`MultiPlanet`** (respecte la casse — c'est important !)
3. Visibilité : **Public**
4. Ne coche rien d'autre → **Create repository**

### 1b. Pousser les fichiers (depuis ton terminal)
```bash
cd /chemin/vers/ce/dossier

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/MultiPlanet.git
git push -u origin main
```
> Remplace `TON_USERNAME` par ton nom d'utilisateur GitHub

### 1c. Activer GitHub Pages
1. Dans ton dépôt → **Settings** → **Pages**
2. **Source** : `GitHub Actions`
3. Le déploiement se lance automatiquement à chaque push ✅
4. Ton jeu sera disponible sur :
   **`https://TON_USERNAME.github.io/MultiPlanet/`**

---

## 📱 Étape 2 — Générer l'APK avec PWABuilder

1. Va sur [pwabuilder.com](https://www.pwabuilder.com)
2. Entre l'URL : `https://TON_USERNAME.github.io/MultiPlanet/`
3. Clique **Start** — PWABuilder analyse ton site
4. Clique **Package for stores** → **Android**
5. Choisis **"Android (APK)"** pour tester en local
6. Télécharge le `.zip` → extrais le `.apk`

### Installer l'APK sur Android
1. Transfère le `.apk` sur ton téléphone
2. Dans les paramètres Android : **Autoriser les sources inconnues**
3. Ouvre le fichier `.apk` → **Installer**

---

## ⚠️ Points importants

- Le nom du dépôt GitHub **doit** correspondre au `base` dans `vite.config.js`
  - Dépôt `MultiPlanet` → `base: '/MultiPlanet/'`
  - Si tu changes le nom du dépôt, mets à jour `vite.config.js` en conséquence
- Le déploiement prend 1-2 minutes après chaque push
- Pour vérifier : onglet **Actions** dans ton dépôt GitHub

---

## 🖥️ Tester en local

```bash
npm install
npm run dev
# → http://localhost:5173/MultiPlanet/
```
