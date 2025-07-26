/*
    Author: Connor Kippes

    Handles setting up the gallery with all the paintings
*/

document.getElementById("sold-title").style.visibility = "hidden";

// adds all the painting in the list to the gallery in rows of 4
function addAllPaintings() {
    return fetch(`/getPaintings`)
        .then((response) => response.json())
        .then((data) => {
            for (let painting of data) {
                // adds to propper section of the gallery if it is sold or not
                let grid = document.getElementById("gallery-grid");
                if (painting.sold) {
                    grid = document.getElementById("sold-grid");
                }

                addPainting(grid, painting);
            }

            list = document.getElementById("sold-table");
        })
        .catch((error) => console.error("Error:", error));
}

// wait until all paintings are loaded in and then apply observer
addAllPaintings().then(() => {
    const hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});

// make sold invisible for a second so it doesnt apear on top when loading
setTimeout(() => {
    document.getElementById("sold-title").style.visibility = "visible";
}, 2000);

//scrolls to the top on load to avoid loading into empty space
window.onbeforeunload = () => window.scrollTo(0, 0);
window.addEventListener("load", () => window.scrollTo(0, 0));
