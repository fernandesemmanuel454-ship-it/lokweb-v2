# Galerie restauration LokWeb

La page d’accueil affiche six exemples fictifs : pizzeria, snack, kebab, brasserie, cuisine ouest-africaine et cuisine chinoise. Les images originales sont dans `assets/`; les versions JPEG légères utilisées par le site sont dans `../public/images/restaurants/`.

Le carrousel est modifiable dans `../index.html` (structure), `../styles.css` (calques visuels) et `../script.js` (ordre, titres, boutons, durée de 4,5 secondes). Il continue à défiler lorsque la souris passe dessus. Il se met en pause avec le bouton dédié, quand l’onglet est caché ou si la réduction des animations est activée. Les flèches permettent de le parcourir manuellement.

`lokweb-pizzeria-site-v2.blend` et `build_scene.py` conservent une scène Blender native et éditable du concept pizzeria. Le carrousel de la page reste en HTML/CSS/JS pour que chaque cuisine et chaque transition puissent être modifiées indépendamment, sans refaire un rendu vidéo. Les personnes et établissements des photos sont fictifs ; la page les présente comme des exemples, pas comme des clients réels.
