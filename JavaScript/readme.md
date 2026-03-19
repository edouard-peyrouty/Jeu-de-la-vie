# jeu-de-la-vie.js

Module JavaScript pour intégrer le Jeu de la Vie de Conway dans une page HTML.

## Utilisation

```html
<canvas id="canvas"></canvas>
<script src="https://cdn.jsdelivr.net/gh/edouard-peyrouty/Jeu-de-la-vie@main/JavaScript/jeu-de-la-vie.js"></script>
<script>
    const game = createGameOfLife(document.getElementById('canvas'), {
        rows: 30,
        cell: 14
    });
    game.randomize();
    game.start();
</script>
```

## Options

| Option | Défaut | Description |
|---|---|---|
| `rows` | `30` | Nombre de lignes |
| `cols` | `rows` | Nombre de colonnes |
| `cell` | `10` | Taille d'une cellule en px |
| `borderRadius` | `2` | Arrondi des cellules en px |
| `aliveColor` | `'#CA3C66'` | Couleur cellule vivante |
| `deadColor` | `'#E8AABE'` | Couleur cellule morte |
| `borderColor` | `'#F4D6E0'` | Couleur des bordures |
| `borderWidth` | `2` | Épaisseur des bordures en px |
| `clickable` | `true` | Dessin à la souris |
| `speed` | `120` | Intervalle entre chaque étape en ms |
| `density` | `0.3` | Densité initiale pour `randomize()` (0 à 1) |

## API

```js
game.start()      // Démarre
game.pause()      // Met en pause
game.toggle()     // Démarre/pause, retourne true si en cours
game.randomize()  // Remplit aléatoirement
game.clear()      // Vide la grille
game.isRunning()  // Retourne true si en cours
```