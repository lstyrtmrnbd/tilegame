const {
    render,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
} = require('./board');

// need for this?
// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';

const BOARD = newBoard(64,64);
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
    const primary = seedEngine(32); 
    
    await primary(await renderBoard(), BOARD);
});

// produce async engine call at specified interval
const seedEngine = interval => async (engine, ...args) => {
    setInterval(engine, interval, ...args);
}
