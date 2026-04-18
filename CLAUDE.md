# PROJET LOKWEB — Document de contexte

## Propriétaire
Emmanuel Fernandes
Email : contact@lokweb.lu
Agence : LokWeb — 19 rue Aloyse Kayser, L-3852 Schifflange, Luxembourg

## Qu'est-ce que LokWeb
Agence web luxembourgeoise qui vend des sites en abonnement mensuel à des commerces locaux (restaurants, coiffeurs, dentistes, garages, pharmacies, avocats, artisans).

Proposition de valeur :
- Site pro livré en 7 jours
- À partir de 49 €/mois
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
- Starter : WordPress + Elementor (49–89 €/mois)
- Premium : code custom sur mesure (149–249 €/mois)

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
- Toujours « 49 €/mois », jamais « 49€/mois »
- Un seul CTA primaire par vue
- PAS de vert WhatsApp (#25D366)
- UNE SEULE adresse email partout : contact@lokweb.lu

## Structure de la page d'accueil (dans l'ordre)

1. Nav sticky sombre avec backdrop-blur
2. Hero sombre : badge + titre avec « la semaine prochaine » en italique serif ambre + 2 CTA + 3 stats + visuel 4:5
3. « Comment ça marche » fond clair
4. Services fond sombre : 6 cartes avec icônes Lucide ambre
5. Tarifs fond clair : 3 formules (Essentiel 49 € / Business 89 € / Commande+ 149 €)
6. Réalisations fond sombre : Drix Lux + Schmoett
7. Process fond clair : 4 étapes (Échange, Maquette, Développement, Mise en ligne)
8. CTA final fond sombre
9. Contact fond clair : infos + formulaire
10. Footer sombre

## Textes validés

Hero :
- Titre : « Votre site en ligne [la semaine prochaine]. » (crochets = Instrument Serif italic ambre)
- Sous-titre : « Pensé, conçu et livré depuis le Luxembourg. À partir de 49 €/mois, sans engagement. »
- CTA primaire : « Recevoir ma démo → »
- CTA secondaire : « Nos réalisations »
- Stats : « 7 jours / Mise en ligne » + « 49 €/mois / Sans frais de création » + « 0 € / Engagement »

CTA final :
« Prêt à passer en ligne ? Recevez une maquette gratuite de votre futur site sous 24 h. Sans engagement, sans blabla. »

## Problèmes du site actuel à NE PAS reproduire

- Trop d'emojis
- Bouton vert WhatsApp #25D366 incohérent
- Faux numéro de téléphone +352 661 234 567
- Fautes d'accents
- Mockup « fausse fenêtre macOS » creuse
- Doublons « Nos Projets — Nos Projets »
- Deux adresses email différentes

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
