//////////////////////////////////////////////////////
////// Board, a 2D array of integer identifiers //////
//////////////////////////////////////////////////////

/**
 *  Rectangular 2D array constructor
 */
function newBoard(x, y, init = (x,y) => 0) {

    function* genX(y) {
        let i = 0;
        while(i < x) {
            ++i;
            yield(init(i,y));
        }
    }

    function* genY() {
        let j = 0;
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
 *    - additional parameters specify a rectangular 2D subarray
 *      of dimensions [x1,x2), [y1,y2)  
 *    - in all cases it assumes its input is rectangular via x2
 *    - 'for' loops faster than mapping/forEaching
 */
const forEach =
      (fun = (arr,x,y) => arr[x][y]) =>
      (arr, x1 = 0, y1 = 0, x2 = arr[0].length, y2 = arr.length) => {

    for(let i = y1; i < y2; ++i) {
        for(let j = x1; j < x2; ++j) {
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

// nice array of tile Images, ordered same as the tilemap
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
const render = images => ctx => (board, x1, x2, y1, y2) => {

    // scaling and transformation between the input image and
    //   rendered image go here ie shading

    forEach((arr,x,y) => {

        const index = arr[x][y];
        const img = images[index];

        const h = 32, w = 32; // !! hardcoded tile sizes
        
        const pos = {
            x: w * x,
            y: h * y 
        };
        
        ctx.drawImage(img, pos.x, pos.y, w, h);

    })(board, x1, x2, y1, y2);
};

module.exports = {
    render,
    loadTileData,
    tileDataToImages,
    newBoard,
    forEach,
    setEach
};
