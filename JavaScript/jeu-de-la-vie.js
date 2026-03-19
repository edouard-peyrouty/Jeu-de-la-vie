/**
 * Jeu de la Vie — Module
 * 
 * Usage :
 *   const game = createGameOfLife(canvas, options);
 *   game.randomize();
 *   game.start();
 * 
 * Options :
 *   rows          {number}  Nombre de lignes (défaut: 30)
 *   cols          {number}  Nombre de colonnes (défaut: égal à rows)
 *   cell          {number}  Taille d'une cellule en px (défaut: 10)
 *   borderRadius  {number}  Arrondi des cellules en px (défaut: 2)
 *   aliveColor    {string}  Couleur cellule vivante (défaut: '#CA3C66')
 *   deadColor     {string}  Couleur cellule morte (défaut: '#E8AABE')
 *   borderColor   {string}  Couleur bordure (défaut: '#F4D6E0')
 *   borderWidth   {number}  Épaisseur bordure en px (défaut: 2)
 *   clickable     {boolean} Grille cliquable (défaut: true)
 *   speed         {number}  Intervalle en ms entre chaque étape (défaut: 120)
 *   density       {number}  Densité de cellules vivantes pour randomize() 0-1 (défaut: 0.3)
 */

window.createGameOfLife = function(canvas, options = {}) {
    
    const ROWS         = options.rows         ?? 30;
    const COLS         = options.cols         ?? ROWS;
    const CELL         = options.cell         ?? 10;
    const BORDER_R     = options.borderRadius ?? 2;
    const ALIVE        = options.aliveColor   ?? '#CA3C66';
    const DEAD         = options.deadColor    ?? '#E8AABE';
    const BORDER_COLOR = options.borderColor  ?? '#F4D6E0';
    const BORDER_WIDTH = options.borderWidth  ?? 2;
    const CLICKABLE    = options.clickable    ?? true;
    const SPEED        = options.speed        ?? 120;
    const DENSITY      = options.density      ?? 0.3;

    canvas.width  = COLS * CELL;
    canvas.height = ROWS * CELL;

    const ctx = canvas.getContext('2d');
    let grid      = newGrid();
    let running   = false;
    let intervalId = null;
    let painting  = false;

    function newGrid() {
        return Array.from({length: ROWS}, () => new Uint8Array(COLS));
    }

    function drawCell(r, c) {
        const x = c * CELL + BORDER_WIDTH / 2;
        const y = r * CELL + BORDER_WIDTH / 2;
        const size = CELL - BORDER_WIDTH;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, BORDER_R);
        ctx.fillStyle = grid[r][c] ? ALIVE : DEAD;
        ctx.fill();
        if (BORDER_WIDTH > 0) {
            ctx.strokeStyle = BORDER_COLOR;
            ctx.lineWidth = BORDER_WIDTH;
            ctx.stroke();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                drawCell(r, c);
    }

    function neighbours(r, c) {
        let n = 0;
        for (let i = r - 1; i <= r + 1; i++)
            for (let j = c - 1; j <= c + 1; j++)
                if ((i !== r || j !== c) && i >= 0 && i < ROWS && j >= 0 && j < COLS)
                    n += grid[i][j];
        return n;
    }

    function step() {
        const next = newGrid();
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++) {
                const n = neighbours(r, c);
                next[r][c] = grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
            }
        grid = next;
        draw();
    }

    function getRC(cx, cy) {
        const rect = canvas.getBoundingClientRect();
        return {
            r: Math.floor((cy - rect.top)  / CELL),
            c: Math.floor((cx - rect.left) / CELL)
        };
    }

    function toggleCell(cx, cy) {
        const {r, c} = getRC(cx, cy);
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            grid[r][c] = grid[r][c] ? 0 : 1;
            draw();
        }
    }

    function paintCell(cx, cy) {
        const {r, c} = getRC(cx, cy);
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            grid[r][c] = 1;
            draw();
        }
    }
    
    // Helper pour centrer un pattern
    function center(pattern) {
        const pr = pattern.length, pc = pattern[0].length;
        const or = Math.floor((ROWS - pr) / 2);
        const oc = Math.floor((COLS - pc) / 2);
        const g = newGrid();
        for (let r = 0; r < pr; r++)
            for (let c = 0; c < pc; c++)
                g[or + r][oc + c] = pattern[r][c];
        return g;
    }

    if (CLICKABLE) {
        canvas.addEventListener('mousedown', e => { painting = true; toggleCell(e.clientX, e.clientY); });
        canvas.addEventListener('mousemove', e => { if (painting) paintCell(e.clientX, e.clientY); });
        canvas.addEventListener('mouseup',   () => painting = false);
        canvas.addEventListener('mouseleave',() => painting = false);
    }

    draw();

    return {
        start() {
            if (running) return;
            running = true;
            intervalId = setInterval(step, SPEED);
        },
        pause() {
            running = false;
            clearInterval(intervalId);
        },
        toggle() {
            running ? this.pause() : this.start();
            return running;
        },
        randomize() {
            grid = newGrid();
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    grid[r][c] = Math.random() < DENSITY ? 1 : 0;
            draw();
        },
        clear() {
            this.pause();
            grid = newGrid();
            draw();
        },
        isRunning() {
            return running;
        },
        setGrid(pattern) {
            pattern = center(pattern);
            grid = newGrid();
            for (let r = 0; r < pattern.length && r < ROWS; r++)
                for (let c = 0; c < pattern[r].length && c < COLS; c++)
                    grid[r][c] = pattern[r][c];
            draw();
        },
    };
};