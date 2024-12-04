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
        //open gallery extended for that painting
    }
    const newPainting = imgList.insertCell(-1)
    const newTitle = titleList.insertCell(-1)
    const image = document.createElement("img"); 
    const text = document.createElement("p"); 
    newPainting.className = "listCell";
    newTitle.className = "listCell";
    image.className = "paintingImg";
    text.className = "paintingTitle";
    image.onclick = onPaintingClick
    text.onclick = onPaintingClick
    image.src = `../paintings/${allPaintings[paintingName][1]}`;
    image.alt = allPaintings[paintingName][0]
    text.innerText = allPaintings[paintingName][0];  
    newPainting.appendChild(image); 
    newTitle.appendChild(text); 
}

function setUpEx() {
    let list = document.getElementById("yourFavs");
    addPainting(list.rows[0],list.rows[1], "Sunflowers");
    addPainting(list.rows[0],list.rows[1], "StaryNight");
    addPainting(list.rows[0],list.rows[1], "MonaLisa");
    addPainting(list.rows[0],list.rows[1], "PearlEaring");
    addPainting(list.rows[0],list.rows[1], "TheGreatWave");
    list = document.getElementById("yourBids");
    addPainting(list.rows[0],list.rows[1], "PearlEaring");
    addPainting(list.rows[0],list.rows[1], "TheGreatWave");
}

setUpEx(); 

