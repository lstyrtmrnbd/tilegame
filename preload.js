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
        if(DEBUG) console.log(`render cranked in ${nowms}ms`);
    };
};

const BOARD = newBoard(64,64); // 4096 tiles
setEach(() => Math.round(Math.random() * 149))(BOARD);    

////////////////////////////////
//// Establishing Callbacks ////
////////////////////////////////

// prepare a render function to run at an interval
const seedRenderer = async (interval) => {

    const boardRender = await renderBoard(); // load resources

    let start;
    return BOARD => timestamp =>  {
        
        if (start === undefined) start = timestamp;
        const elapsed = timestamp - start;

        if(DEBUG)
            console.log(`wrapper was called @${elapsed}`);

        if (Math.round(elapsed) % interval === 0) {
            boardRender(BOARD,0,0,17,17);

            if(DEBUG)
                console.log(`board was rendered @${elapsed}`);
        }
    };
};

// produce async engine call at specified interval
// setInterval returns Timeout that can be fed to clearInterval
const seedEngine = interval =>
      async (engine, ...args) =>
      setInterval(engine, interval, ...args);

let PRIMARY_HANDLE;

// 1 time hook in
window.addEventListener('DOMContentLoaded', async () => {

    // every 17ms, better slower than faster
    const renderer = (await seedRenderer(17))(BOARD);
    
    const prime = () => {
        if(!DEBUG)
            console.log(`prime ran ${performance.now()}`);

        renderer(performance.now());
    };
    
    // 32ms interval: ~30fps
    // 16ms interval: ~60fps    
    PRIMARY_HANDLE = await seedEngine(2)(prime);
    
});

