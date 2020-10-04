const {
    render,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
} = require('./board');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// a need for this?
// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';

// const currentSecond: Math.round(performance.now() / 1000

const DEBUG = true;

////////////////////////////////
////////// Rendering ///////////
////////////////////////////////

// does set-up and returns the actual rendering fn
const renderBoard = async () => {

    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    const tilemap = await loadTileData('tiledata.json');
    const images = tileDataToImages(tilemap);
    
    return (board,x1,x2,y1,y2) => {
        const start = performance.now();
        render(images)(ctx)(board);
        const nowms = Math.round(performance.now() - start);
        if(DEBUG) console.log(`render cranked @${nowms}ms`);
    };
};

const BOARD = newBoard(64,64); // 4096 tiles
setEach(() => Math.round(Math.random() * 149))(BOARD);    

////////////////////////////////
//// Establishing Callbacks ////
////////////////////////////////

const seedRenderer = async () => {

    const boardRender = await renderBoard();

    let start;
    const wrapped = async (BOARD) => timestamp =>  {
        
        if (start === undefined)
            start = timestamp;
        const elapsed = timestamp - start;

        if(DEBUG)
            console.log(`wrapper was called @${elapsed}`);
        
        boardRender(BOARD,0,0,17,17);
    };

    /**
     * A long integer value, the request id, that uniquely identifies the entry
     * in the callback list. This is a non-zero value, but you may not make any
     * other assumptions about its value. You can pass this value to 
     * window.cancelAnimationFrame() to cancel the refresh callback request.
     */
    return window.requestAnimationFrame(await wrapped(BOARD));
};

// produce async engine call at specified interval
// setInterval returns Timeout that can be fed to clearInterval
const seedEngine = interval =>
      async (engine, ...args) =>
      setInterval(engine, interval, ...args);

let RENDER_HANDLE;
let PRIMARY_HANDLE;

// 1 time hook in
window.addEventListener('DOMContentLoaded', async () => {

    RENDER_HANDLE = await seedRenderer();
    
    // 32ms interval: ~30fps
    // 16ms interval: ~60fps
    const prime = () => {
        if(!DEBUG)
            console.log(`prime ran ${performance.now()}`);
    };
    
    PRIMARY_HANDLE = await seedEngine(2)(prime);
    
});

