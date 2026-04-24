# PROJET LOKWEB — Document de contexte

## Propriétaire
Emmanuel Fernandes
Email : info@lokweb.lu
WhatsApp / Téléphone : +352 661 47 41 30
Agence : LokWeb — 19 rue Aloyse Kayser, L-3852 Schifflange, Luxembourg

## Qu'est-ce que LokWeb
Agence web luxembourgeoise qui vend des sites en abonnement mensuel à des commerces locaux (restaurants, coiffeurs, dentistes, garages, pharmacies, avocats, artisans).

Proposition de valeur :
- Site pro livré en 7 jours
- À partir de 59 €/mois
- Sans engagement
- Tout inclus (création, hébergement, maintenance)

## Les 3 sites existants

1. lokweb.lu — site vitrine de l'agence
   - Aujourd'hui : WordPress + Elementor Pro, sur OVH mutualisé
   - DÉCISION PRISE : à refaire en code custom sur Vercel

2. schmoett.lu — restaurant à Schifflange
   - Code custom HTML/CSS/JS, déployé sur Vercel via GitHub
   - NE PAS TOUCHER sans raison explicite

3. drixlux.lu — livraison d'alcool à Luxembourg
   - Code custom HTML/CSS/JS, déployé sur Vercel via GitHub
   - NE PAS TOUCHER sans raison explicite

## Décision stratégique validée

Le site lokweb.lu sera refait en CODE CUSTOM (HTML/CSS/JS vanilla) déployé sur Vercel, pour être cohérent avec schmoett.lu et drixlux.lu. WordPress + Elementor Pro reste dans la boîte à outils pour des sites clients.

Deux formules commerciales à terme :
- Starter : WordPress + Elementor (59–99 €/mois)
- Premium : code custom sur mesure (149–199 €/mois)

## Stack technique du nouveau lokweb.lu

- HTML / CSS / JavaScript vanilla (pas de framework)
- Fonts : Inter + Instrument Serif (Google Fonts)
- Déploiement : Vercel via GitHub
- Responsive mobile-first
- Accessibilité AA minimum

## Charte graphique validée

Palette :
- Fond sombre principal : #0B0F1A
- Fond clair alternatif : #FAFAF7
- Texte sombre sur clair : #111318
- Texte muted : #5B6170
- Primary (bleu CTA unique) : #2F5CFF
- Accent (ambre) : #F59E0B
- Bordure claire : #E7E5DF
- Bordure sombre : #1E2230

Typographie :
- Titres : Inter 700, avec mots ponctuels en Instrument Serif italic ambre
- Corps : Inter 400/500

Règle d'or : 80% noir/blanc/gris, 15% bleu primaire, 5% ambre d'accent.

## Règles éditoriales strictes

- Aucun emoji dans le contenu final (icônes Lucide uniquement)
- Tous les accents français correctement placés
- Espace insécable avant : ; ! ? % €
- Toujours « 59 €/mois », jamais « 59€/mois »
- Un seul CTA primaire par vue
- Vert WhatsApp (#25D366) AUTORISÉ UNIQUEMENT sur les éléments WhatsApp : bouton WhatsApp du header et widget flottant. Interdit ailleurs (CTA, sections, accents, etc.).
- UNE SEULE adresse email partout : info@lokweb.lu
- Numéro unique WhatsApp / téléphone : +352 661 47 41 30 (format lien WhatsApp : https://wa.me/352661474130 ; format tel : tel:+352661474130)

## Structure de la page d'accueil (dans l'ordre)

1. Nav sticky sombre avec backdrop-blur + bouton WhatsApp vert (exception graphique)
2. Hero sombre : badge + H1 avec « vos concurrents ont déjà » en italique serif ambre + 2 CTA + 3 stats + visuel carousel 16:10
3. « Comment ça marche » fond clair : 4 étapes
4. Services fond sombre : 6 cartes avec icônes Lucide ambre
5. Pourquoi LokWeb fond clair : tableau comparatif (Agence classique vs LokWeb, incluant la ligne « Mise en service : WhatsApp suffit »)
6. Tarifs fond clair : 3 formules (Essentiel 59 € / Business 99 € / Commerce+ 199 €)
7. Projets récents fond sombre : 3 cartes (Schmoett, Drix Lux, Elisa Health) présentées comme références neutres, sans revendication d'appartenance. L'encadré de lancement 2026 / 10 premiers clients partenaires a été déplacé dans la section À propos pour ne pas donner l'impression « pas encore de projets » juste avant d'afficher les 3 références.
8. À propos fond clair : Emmanuel + monogramme EF + encadré discret « Lancement 2026 / 10 premiers clients partenaires » + badges « Basé au Luxembourg / Sans engagement / Un seul interlocuteur »
9. Process fond clair : 4 étapes (Échange, Maquette, Développement, Mise en ligne)
10. CTA final fond sombre
11. Contact fond clair : email, WhatsApp, téléphone, adresse + formulaire
12. Footer sombre
13. Widget WhatsApp flottant fixe bottom-right (bulle verte #25D366, exception graphique)

## Source de vérité des textes

Le fichier [CONTENT.md](./CONTENT.md) est la source de vérité pour tous les textes du site. En cas de divergence entre `index.html`, `CONTENT.md` et ce document, `index.html` fait foi pour ce qui est en ligne, et `CONTENT.md` doit être resynchronisé.

## Problèmes à NE PAS reproduire

Généralités héritées de l'ancien site WordPress :
- Trop d'emojis (icônes Lucide uniquement)
- Fautes d'accents
- Mockup « fausse fenêtre macOS » creuse
- Doublons de sections (« Nos Projets — Nos Projets »)
- Deux adresses email différentes (règle : une seule, info@lokweb.lu)

Garde-fous positionnement / conversion (issus du diagnostic 2026 — 15 prospects contactés, 0 signé) :
- Ne JAMAIS présenter le portfolio comme « nos propres business » ni utiliser des formules du type « on mange ce qu'on cuisine ». Les 3 sites affichés (Schmoett, Drix Lux, Elisa Health) sont des références neutres, pas des preuves d'auto-consommation.
- Ne JAMAIS afficher de métrique du type « 3 sites en production » ou « X sites livrés » tant que le nombre de clients réels est faible. Ces chiffres détruisent la crédibilité en pré-lancement. Préférer des métriques qualitatives (« Sans engagement », « Basé au Luxembourg », « Un seul interlocuteur »).
- Toujours offrir au moins un canal de contact humain direct (WhatsApp et/ou téléphone) en plus du formulaire. Le commerçant luxembourgeois veut pouvoir appeler ou WhatsApper.
- Le H1 doit parler business (peur de rater, manque à gagner, retard compétitif), pas technique (délai, process). Le prospect souffre de « mon site ne m'amène pas de clients », pas de « je n'ai pas de site rapidement ».
- Faux numéro de téléphone +352 661 234 567 de l'ancien site : ne jamais réutiliser. Seul numéro valide : +352 661 47 41 30.

Rappel sur l'exception graphique WhatsApp (voir « Règles éditoriales strictes ») : le vert #25D366 n'est autorisé QUE sur les deux éléments WhatsApp (bouton du header + widget flottant bottom-right). Partout ailleurs, l'interdiction tient.

## État d'avancement

- [x] Audit du site actuel
- [x] Direction artistique validée
- [x] Textes réécrits et validés
- [x] Alias Terminal `lokweb` créé
- [x] Dossier ~/Documents/lokweb-v2 créé
- [x] Fichier CLAUDE.md créé
- [ ] Génération du site complet
- [ ] Déploiement sur Vercel
- [ ] Bascule des DNS OVH

## Instructions pour Claude Code

Si tu lis ce document au début d'une conversation, tu sais TOUT sur le projet. Ne demande pas à Emmanuel de répéter des infos déjà listées. Il ne veut pas toucher au code ni cliquer dans des interfaces techniques. Il compte sur toi pour générer le code et lui donner les commandes prêtes à copier-coller. Sois pédagogique, direct, et ne reviens pas sur des décisions déjà prises (WordPress vs code custom → c'est tranché, c'est code custom).
