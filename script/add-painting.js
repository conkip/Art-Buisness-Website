/*
    Author: Connor Kippes

    Function to add paintings to the gallery and profile section.
*/

// addPainting puts the given painting in the gallery with its image and title
async function addPainting(grid, painting) {
    const img = document.createElement("img");
    const imgLink = document.createElement("a");

    // pass painting name as url param
    imgLink.href = `painting.html?name=${painting.name}`;

    imgLink.id = "gallery-img";

    // adds class names to fade in and cause a shadow over hover
    img.className = "gallery-painting hover-shadow";

    // only loads images as you scroll near them
    img.loading = "lazy";

    img.src = `../paintings_webp/${painting.image}`;
    img.alt = painting.name;

    imgLink.appendChild(img);

    const textLink = document.createElement("a");
    textLink.href = `painting.html?name=${painting.name}`;

    textLink.id = "gallery-text";
    textLink.innerText = painting.name;

    const div = document.createElement("div");
    div.appendChild(imgLink);
    div.appendChild(textLink);
    div.id = "gallery-entry";
    div.className = "hidden";

    grid.appendChild(div);
}
