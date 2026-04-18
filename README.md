# LokWeb v2 — Site vitrine de l'agence

Site web de [lokweb.lu](https://www.lokweb.lu), agence web luxembourgeoise. Code custom HTML/CSS/JS vanilla, déployé sur Vercel.

---

## Prévisualiser en local

Ouvrir un terminal, se placer dans le dossier du projet, puis lancer :

```bash
cd ~/Documents/lokweb-v2
python3 -m http.server 8000
```

Puis ouvrir dans un navigateur : [http://localhost:8000](http://localhost:8000)

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

---

## Mettre en ligne sur Vercel

### 1. Créer le repo GitHub

1. Aller sur [github.com/new](https://github.com/new)
2. Nom du repo : `lokweb-v2`
3. Laisser "Public" ou mettre "Private" selon ta préférence
4. Ne pas cocher "Add a README" (on en a déjà un)
5. Cliquer "Create repository"
6. GitHub affiche des commandes. Dans le terminal, faire :

```bash
cd ~/Documents/lokweb-v2
git init
git add -A
git commit -m "Initial commit — lokweb.lu v2"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/lokweb-v2.git
git push -u origin main
```

Remplacer `TON_USERNAME` par ton nom d'utilisateur GitHub.

### 2. Connecter Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Cliquer "Import Git Repository"
3. Sélectionner `lokweb-v2`
4. Framework Preset : laisser "Other"
5. Cliquer "Deploy"
6. Le site est en ligne en 30 secondes

### 3. Connecter le domaine lokweb.lu

1. Dans Vercel > Settings > Domains
2. Ajouter `lokweb.lu` et `www.lokweb.lu`
3. Vercel affiche les DNS à configurer
4. Dans le panneau OVH > Zone DNS > modifier les enregistrements A et CNAME selon les instructions Vercel
5. Attendre 10-30 minutes pour la propagation DNS

---

## Modifier un texte du site

Tous les textes sont dans `index.html`. Ouvrir le fichier dans un éditeur de texte et chercher le texte à modifier.

Structure des sections (dans l'ordre) :

| Ligne approx. | Section |
|---|---|
| `<!-- NAV -->` | Barre de navigation |
| `<!-- HERO -->` | Section d'accroche principale |
| `<!-- COMMENT ÇA MARCHE -->` | Les 4 étapes |
| `<!-- SERVICES -->` | Les 6 services |
| `<!-- TARIFS -->` | Les 3 formules de prix |
| `<!-- RÉALISATIONS -->` | Portfolio (Drix Lux + Schmoett) |
| `<!-- PROCESS -->` | Méthode de travail |
| `<!-- CTA FINAL -->` | Appel à l'action |
| `<!-- CONTACT -->` | Infos + formulaire |
| `<!-- FOOTER -->` | Pied de page |

Après modification, sauvegarder le fichier puis :

```bash
cd ~/Documents/lokweb-v2
git add -A
git commit -m "Modification texte"
git push
```

Vercel redéploie automatiquement en 30 secondes.

---

## Fichiers du projet

```
lokweb-v2/
├── index.html          Page principale
├── styles.css          Tous les styles
├── script.js           Menu mobile + animations + formulaire
├── public/images/      Screenshots portfolio (à ajouter)
├── CLAUDE.md           Contexte projet pour Claude Code
├── CONTENT.md          Tous les textes du site (relecture)
├── README.md           Ce fichier
└── .gitignore          Fichiers à ne pas commiter
```
