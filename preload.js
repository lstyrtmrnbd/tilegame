const {
    render,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
} = require('./board');

// a need for this?
// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';

const BOARD = newBoard(64,64); // 4096 tiles
setEach(() => Math.round(Math.random() * 149))(BOARD);    

// does set-up and returns the actual rendering fn
const renderBoard = async () => {

    const ctx = document.querySelector('canvas').getContext('2d');
    
    const tilemap = await loadTileData('tiledata.json');
    const images = tileDataToImages(tilemap);
    
    return (board) => {
        const start = performance.now();
        render(images)(ctx)(board);
        const nowms = Math.round(performance.now() - start);
        console.log(`render cranked @${nowms}ms`);
    };
};

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {

    // 32ms interval: ~30fps
    // 16ms interval: ~60fps
    const primary = seedEngine(2);

    const boardRender = await renderBoard();
    
    const wrapped = async (BOARD) => {
        console.log(`wrapper was called @${Math.round(performance.now() / 1000)}`);
        boardRender(BOARD);
    };
    
    await primary(wrapped, BOARD);
});

// produce async engine call at specified interval
const seedEngine = interval => async (engine, ...args) => {
    setInterval(engine, interval, ...args);
};
