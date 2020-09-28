//////////////////////////////////////////////////////
////// Board, a 2D array of integer identifiers //////
//////////////////////////////////////////////////////

/**
 *  General 2D array constructor, maintains consistent x and y lengths
 */
function new2DArray(x, y, init = (x,y) => 0) {

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
    const y = arr[0].length;
    
    for(let i = 0; i < x; ++i) {
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

async function loadTileData(datafile) {

    const filedata = await loadFile(datafile);
    return JSON.parse(filedata.toString()); // in tilemap format ie. {x:durl}
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

// nice array of tile Images
function tileDataToImages(tilemap) {

    return range(Object.keys(tilemap).length)
        .map(i => {
            
            const out = new Image();
            out.src = tilemap[i];
            
            return out;
        });
}

const CTX = document.getElementById('canvas').getContext('2d');

// coordinate images and board to produce render output to canvas
function renderBoard(board, tilemap) {

    const images = tileDataToImages(tilemap);

    // scaling and transformation between the input image and
    //   rendered image go here; "shader pipe"
    
    // get Canvas, or inject into context somehow

    const renderEach = forEach((arr,x,y) => {

        const index = arr[x][y];
        const img = images[index];

        const h = img.naturalHeight;
        const w = img.naturalWidth; // this work??

        const pos = {
            x: w * x,
            y: h * y 
        };
        
        CTX.drawImage(img, pos.x, pos.y);
    });
    
    renderEach(board); // hot or not?
}

