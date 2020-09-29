//////////////////////////////////////////////////////
////// Board, a 2D array of integer identifiers //////
//////////////////////////////////////////////////////

/**
 *  General 2D array constructor, maintains consistent x and y lengths
 */
function newBoard(x, y, init = (x,y) => 0) {

    function* genX(y) {
        let i = 0;
        while(i < x) {
            ++i;
            yield(init(i,y));
        }
    }

    let j = 0;
    function* genY() {
        while(j < y) {
            j++;
            yield(Array.from(genX(j)));
        }
    }

    return Array.from(genY());
}

/**
 *  Board iteration primitive
 *    - give a function to get an function that calls the given function on
 *      every cell in its board parameter
 *    - raw 'for' loops are faster than mapping/forEaching
 */
const forEach = (fun = (arr,x,y) => arr[x][y]) => arr => {

    const x = arr.length;
    
    for(let i = 0; i < x; ++i) {

        const y = arr[i].length;
        
        for(let j = 0; j < y; ++j) {
            fun(arr, i, j);
        }
    }
};

// clears to 0 by default
const setEach = (fun = (cur,x,y) => 0) =>
      forEach((arr,x,y) => arr[x][y] = fun(arr[x][y],x,y));

////////////////////////////////
//// Data Load and Painting ////
////////////////////////////////

const fs = require('fs');

const loadFile = (filename) =>
      new Promise((res,rej) =>
                  fs.readFile(filename,
                              (err, data) =>
                              err ? rej(err) : res(data)));

// outputs in tilemap format ie. {x:durl}
const loadTileData = datafile =>
      loadFile(datafile).then(filedata =>
                              JSON.parse(filedata.toString()));

const range = (size, startAt = 0) => 
      [...Array(size).keys()].map(i => i + startAt);

// (promise of) nice array of tile Images, ordered same as the tilemap
const tileDataToImages = tilemap =>
      range(Object.keys(tilemap).length - 1)
      .map(i => {
          const out = new Image(8,8); // !! hardcoded dimensions
          out.src = tilemap[i];
          return out;
      });

/**
 * coordinate images and board to produce render output to canvas
 * ctx: canvas context: document.getElementById('canvas').getContext('2d')
 */
const renderBoard = images => ctx => board => {

    // scaling and transformation between the input image and
    //   rendered image go here ie shading

    forEach((arr,x,y) => {

        const index = arr[x][y];
        const img = images[index];

        const h = 8, w = 8;
        
        const pos = {
            x: w * x,
            y: h * y 
        };
        
        ctx.drawImage(img, pos.x, pos.y);

    })(board);
}

module.exports = {
    renderBoard,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
};
