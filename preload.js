const {
    renderBoard,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
} = require('./board');

const seedEngine = async (engineWork, interval) => {

    const ctx = document.querySelector('canvas').getContext('2d');
    const board = newBoard(64,64);
    setEach(cur => cur+13)(board);
    
    const tilemap = await loadTileData('tiledata.json');
    const images = tileDataToImages(tilemap);
    
    //renderBoard(images)(ctx)(board);
    
    setInterval(renderBoard(images)(ctx), 32, board);
};

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {

    await seedEngine();
});

// seed engine

