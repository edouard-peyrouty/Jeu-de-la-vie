const canvas = document.getElementById('canvas');
const btnPlay = document.getElementById('btnPlay');

const game = createGameOfLife(canvas, {
    rows: 30,
    cell: 14,
    borderRadius: 0,
    aliveColor: '#4dff91',
    deadColor: '#0d0d0d',
    borderColor: '#161616',
    borderWidth: 1,
    clickable: true,
    speed: 120,
    density: 0.28
});

const pulsar = [
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
];

btnPlay.addEventListener('click', function() {
    const isNowRunning = game.toggle();
    this.textContent = isNowRunning ? '⏸ Pause' : '▶ Lancer';
    this.classList.toggle('active', isNowRunning);
});

document.getElementById('btnRandom').addEventListener('click', () => game.randomize());

document.getElementById('btnPulsar').addEventListener('click', () => game.setGrid(pulsar));

document.getElementById('btnClear').addEventListener('click', () => {
    game.clear();
    btnPlay.textContent = '▶ Lancer>';
    btnPlay.classList.remove('active');
});

game.randomize();
game.start();
btnPlay.textContent = '⏸ Pause';
btnPlay.classList.add('active');