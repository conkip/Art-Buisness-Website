/*
    Author: Connor Kippes

    Handles setting up the gallery with all the paintings
*/

// adds all the painting in the list to the gallery in rows of 4
function addAllPaintings() {
    return fetch(`/getPaintings`)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            for (let painting of data) {
                // adds to propper section of the gallery if it is sold or not
                let list = document.getElementById("gallery-table");
                if(painting.sold){
                    list = document.getElementById("sold-table");
                }

                if (list.rows[list.rows.length - 1].cells.length == 4) {
                    // once 4 paintings are in a row, add two new rows:
                    // one for the images and one for the titles
                    list.insertRow(-1);
                    list.insertRow(-1);
                }
                addPainting(list.rows[list.rows.length - 2],list.rows[list.rows.length - 1], painting);
            }

            list = document.getElementById("sold-table");
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById("sold-title").style.visibility = "hidden";

// wait until all paintings are loaded in and then apply observer
addAllPaintings().then(() => {
    const hiddenElements = document.getElementsByClassName('hidden');

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});

// make sold invisible for a second so it doesnt apear on top when loading
setTimeout(() => {
  document.getElementById("sold-title").style.visibility = "visible";
}, 300);
