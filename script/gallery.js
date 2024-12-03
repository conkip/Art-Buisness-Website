// database of paintings
const allPaintings = {
    "Sunflowers":[
        "Sunflowers",
        "sunflowers.jpg",
        "This is a painting of some sunflowers",
        ],
    "StaryNight":[
        "Stary Night",
        "starynight.jpg",
        "This is a painting of a stary night",
        ],
    "MonaLisa":[
        "Mona Lisa",
        "monalisa.jpg",
        "This is a painting of mona lisa",
        ],
    "PearlEaring":[
        "Pearl Earing",
        "pearlearing.jpg",
        "This is a painting of a girl with a pearl earing"
        ],
    "TheGreatWave":[
        "The Great Wave",
        "greatwave.jpg",
        "This is a painting of a wave"
        ]
};

function addPainting(imgList, titleList, paintingName) {
    function onPaintingClick() {
        document.getElementById("gallerySection").style.visibility = "collapse";
        document.getElementById("galleryExtended").style.visibility = "visible";
        document.getElementById("extendedImg").src = `../paintings/${allPaintings[paintingName][1]}`;
        document.getElementById("extendedTitle").innerText = allPaintings[paintingName][0];
        document.getElementById("extendedDescription").innerText = allPaintings[paintingName][2];
    }
    const newPainting = imgList.insertCell(-1)
    const newTitle = titleList.insertCell(-1)
    const image = document.createElement("img"); 
    const text = document.createElement("p"); 
    newPainting.className = "galleryCell";
    newTitle.className = "galleryCell";
    image.className = "galleryImg";
    text.className = "galleryTitle";
    image.onclick = onPaintingClick
    text.onclick = onPaintingClick
    image.src = `../paintings/${allPaintings[paintingName][1]}`;
    image.alt = allPaintings[paintingName][0]
    text.innerText = allPaintings[paintingName][0];  
    newPainting.appendChild(image); 
    newTitle.appendChild(text); 
}

function addAllPaintings() {
    list = document.getElementById("galleryList");

    for (const [key, value] of Object.entries(allPaintings)) {
        if (list.rows[list.rows.length - 1].cells.length == 4) {
            //add two new rows to only have 4 in each row
            list.insertRow(-1);
            list.insertRow(-1);
        }
        addPainting(list.rows[list.rows.length - 2],list.rows[list.rows.length - 1], key);
    }
}

addAllPaintings();
addAllPaintings();
addAllPaintings();
addAllPaintings();
