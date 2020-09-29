const {
    render,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
} = require('./board');

// 32ms interval: ~30fps
const seedEngine = async (engineWork, interval = 32) => {

    const ctx = document.querySelector('canvas').getContext('2d');

    // raise in scope
    const board = newBoard(64,64);
    setEach(cur => Math.round(Math.random()) == 0 ? cur+13 : cur+4)(board);
    
    const tilemap = await loadTileData('tiledata.json');
    const images = tileDataToImages(tilemap);
    
    const renderBoard = render(images)(ctx);
    
    setInterval(renderBoard, interval, board);
};

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {

    await seedEngine();
});

// seed engine

