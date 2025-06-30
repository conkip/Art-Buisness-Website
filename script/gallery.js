/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for gallery.js
  handles setting up the gallery with all the paintings in the database and
  when a user clicks on a painting to open the extended view
*/

// adds all the painting in the list to the gallery in rows of 4
function addAllPaintings() {
    fetch(`/getPaintings`)
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

// fills up the gallery for testing
addAllPaintings();