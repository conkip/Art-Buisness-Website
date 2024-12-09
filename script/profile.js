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

let curPainting = "";

//add onclick functions to heart and submit bid
document.getElementById("heart").onclick = heartArt;
document.getElementById("makeBid").onclick = submitBid


// addPainting puts the given painting in the gallery with its img and title
// adds the onclick function to both the img and the title and set class to match style
function addPainting(imgList, titleList, paintingName) {
    
    // onclick function displays the clicked on image in the gallery extended view
    // and hides the rest of the gallery from view
    // with the correct bid info and heart status
    function onPaintingClick() {
        document.getElementById("profileSection").style.visibility = "collapse";
        document.getElementById("galleryExtended").style.visibility = "visible";
        document.getElementById("extendedImg").src = `./paintings/${allPaintings[paintingName][1]}`;
        document.getElementById("extendedTitle").innerText = allPaintings[paintingName][0];
        document.getElementById("extendedDescription").innerText = allPaintings[paintingName][2];
        curPainting = paintingName;


        // get bid status info
        
        // numDaysLeft = <<curPaintings days left>>;
        // document.getElementById("daysLeft").innerText = "Days Left: " + numDaysLeft;
        // document.getElementById("curStatus").style.width = (((30 - numDaysLeft) / 30) * 600) + "px";
        // document.getElementById("curBid").innerText = "Current Bid: $" + <<curPaintings highest bid>>;
        // document.getElementById("bidHolder").innerText = "Bid Holder: " + <<curPaintings bid holder>>;
        

        // get heart status

        // if (curPainting in <<users favorites>>) {
        //     document.getElementById("heart").style.filter = "grayscale(0%)";
        // } else {
        //     document.getElementById("heart").style.filter = "grayscale(100%)";

        // }

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
    image.src = `./paintings/${allPaintings[paintingName][1]}`;
    image.alt = allPaintings[paintingName][0]
    text.innerText = allPaintings[paintingName][0];  
    newPainting.appendChild(image); 
    newTitle.appendChild(text); 
}

// when the heart is clicked add or remove it from the users favorites list
function heartArt() {
    heart = document.getElementById("heart")
    if (heart.style.filter ==  "grayscale(100%)") {
        document.getElementById("heart").style.filter = "grayscale(0%)";
        // add to current user's favorite list
        // <<users favorites>>.push(curPainting);

    } else {
        document.getElementById("heart").style.filter = "grayscale(100%)";
        // remove from current user's favorite list
        // <<users favorites>>.remove(curPainting);
    }
}

// saves the users bid the database
function submitBid() {
    // let bid = document.getElementById("newBid").value;
    // if (bid > <<curPaintings highest bid>>){
    //     <<curPaintings highest bid>> = bid;
    //     <<curPaintings bid holder>> = user;
    //     <<users bids>>.push(curPainting); // if the not current in list
    //     document.getElementById("curBid").innerText = "Current Bid: $" + bid;
    //     document.getElementById("bidHolder").innerText = "Bid Holder: " + user;
    //     
    // } else {
    //     // some kind of alert to say that is not a valid bid
    // }
    
}


// example of profile layout
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

