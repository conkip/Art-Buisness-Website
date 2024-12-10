// database of paintings
// const allPaintings = {
//     "BeyondTheLimit":[
//         "Beyond The Limit",
//         "BeyondTheLimit.jpg",
//         "_ x _\n20__"
//         ],
//     "ChasingBlues":[
//         "Chasing Blues",
//         "ChasingBlues.jpg",
//         "_ x _\n20__"
//         ],
//     "CircularEcho":[
//         "Circular Echo",
//         "CircularEcho.jpg",
//         "_ x _\n20__"
//         ],
//     "ColorSpectrum":[
//         "Color Spectrum",
//         "ColorSpectrum.jpg",
//         "_ x _\n20__"
//         ],
//     "ColorsInMotion":[
//         "Colors In Motion",
//         "ColorsInMotion.jpg",
//         "_ x _\n20__"
//         ],
//     "ColorsOfLiberty":[
//         "Colors Of Liberty",
//         "ColorsOfLiberty.jpg",
//         "_ x _\n20__"
//         ],
//     "CosmicTides":[
//         "Cosmic Tides",
//         "CosmicTides.jpg",
//         "_ x _\n20__"
//         ],
//     "DotFusion":[
//         "Dot Fusion",
//         "DotFusion.jpg",
//         "_ x _\n20__"
//         ],
//     "EternalLight":[
//         "Eternal Light",
//         "EternalLight.jpg",
//         "_ x _\n20__"
//         ],
//     "EternalSunshine":[
//         "Eternal Sunshine",
//         "EternalSunshine.jpg",
//         "_ x _\n20__"
//         ],
//     "FlowingEssence":[
//         "Flowing Essence",
//         "FlowingEssence.jpg",
//         "_ x _\n20__"
//         ],
//     "HazyDrift":[
//         "Hazy Drift",
//         "HazyDrift.jpg",
//         "_ x _\n20__"
//         ],
//     "LiquidHorizons":[
//         "Liquid Horizons",
//         "LiquidHorizons.jpg",
//         "_ x _\n20__"
//         ],
//     "OribitsInMotion":[
//         "Oribits In Motion",
//         "OribitsInMotion.jpg",
//         "_ x _\n20__"
//         ],
//     "Pinwheel":[
//         "Pinwheel",
//         "Pinwheel.jpg",
//         "_ x _\n20__"
//         ],
//     "RetroVibe":[
//         "Retro Vibe",
//         "RetroVibe.jpg",
//         "_ x _\n20__"
//         ],
//     "SpectrumOfTheSea":[
//         "Spectrum Of The Sea",
//         "SpectrumOfTheSea.jpg",
//         "_ x _\n20__"
//         ],
//     "StrokesOfLight":[
//         "Strokes Of Light",
//         "StrokesOfLight.jpg",
//         "_ x _\n20__"
//         ],
//     "SunsAwakening":[
//         "Sun's Awakening",
//         "SunsAwakening.jpg",
//         "_ x _\n20__"
//         ]
// };
/**[
{
    painting_number: 0,
    name: 'Beyond The Limit',
    highest_bid: 0,
    img: 'BeyondTheLimit.jpg',
    sold: false
  },
  {
    painting_number: 1,
    name: 'Chasing Blues',
    highest_bid: 0,
    img: 'ChasingBlues.jpg',
    sold: false
  },
  {
    painting_number: 2,
    name: 'Circular Echo',
    highest_bid: 0,
    img: 'CircularEcho.jpg',
    sold: false
  },
  {
    painting_number: 3,
    name: 'Color Spectrum',
    highest_bid: 0,
    img: 'ColorSpectrum.jpg',
    sold: false
  },
  {
    painting_number: 4,
    name: 'Colors In Motion',
    highest_bid: 0,
    img: 'ColorsInMotion.jpg',
    sold: false
  },
  {
    painting_number: 5,
    name: 'Colors Of Liberty',
    highest_bid: 0,
    img: 'ColorsOfLiberty.jpg',
    sold: false
  },
  {
    painting_number: 6,
    name: 'Cosmic Tides',
    highest_bid: 0,
    img: 'CosmicTides.jpg',
    sold: false
  },
  {
    painting_number: 7,
    name: 'DotFusion',
    highest_bid: 0,
    img: 'DotFusion.jpg',
    sold: false
  },
  {
    painting_number: 8,
    name: 'Eternal Light',
    highest_bid: 0,
    img: 'EternalLight.jpg',
    sold: false
  },
  {
    painting_number: 9,
    name: 'Eternal Sunshine',
    highest_bid: 0,
    img: 'EternalSunshine.jpg',
    sold: false
  },
  {
    painting_number: 10,
    name: 'Flowing Essence',
    highest_bid: 0,
    img: 'FlowingEssence.jpg',
    sold: false
  },
  {
    painting_number: 11,
    name: 'Hazy Drift',
    highest_bid: 0,
    img: 'HazyDrift.jpg',
    sold: false
  },
  {
    painting_number: 12,
    name: 'Liquid Horizons',
    highest_bid: 0,
    img: 'LiquidHorizons.jpg',
    sold: false
  },
  {
    painting_number: 13,
    name: 'Oribits In Motion',
    highest_bid: 0,
    img: 'OribitsInMotion.jpg',
    sold: false
  },
  {
    painting_number: 14,
    name: 'Pinwheel',
    highest_bid: 0,
    img: 'Pinwheel.jpg',
    sold: false
  },
  {
    painting_number: 15,
    name: 'Retro Vibe',
    highest_bid: 0,
    img: 'RetroVibe.jpg',
    sold: false
  },
  {
    painting_number: 16,
    name: 'Spectrum Of The Sea',
    highest_bid: 0,
    img: 'SpectrumOfTheSea.jpg',
    sold: false
  },
  {
    painting_number: 17,
    name: 'Strokes Of Light',
    highest_bid: 0,
    img: 'StrokesOfLight.jpg',
    sold: false
  },
  {
    painting_number: 18,
    name: 'Suns Awakening',
    highest_bid: 0,
    img: 'SunsAwakening.jpg',
    sold: false
}]
    */
const paintingNames = [
    'Beyond The Limit',
    'Chasing Blues',
    'Circular Echo',
    'Color Spectrum',
    'Colors In Motion',
    'Colors Of Liberty',
    'Cosmic Tides',
    'Dot Fusion',
    ''
]
const mongoose = require("mongoose");
const db = mongoose.connection;

let curPainting = "";

//add onclick functions to heart and submit bid
document.getElementById("heart").onclick = heartArt;
document.getElementById("makeBid").onclick = submitBid;


// addPainting puts the given painting in the gallery with its img and title
// adds the onclick function to both the img and the title and set class to match style
function addPainting(imgList, titleList, painting) {
    
    // onclick function displays the clicked on image in the gallery extended view
    // and hides the rest of the gallery from view
    // with the correct bid info and heart status
    function onPaintingClick() {
        document.getElementById("gallerySection").style.visibility = "collapse";
        document.getElementById("galleryExtended").style.visibility = "visible";
        document.getElementById("extendedImg").src = `./paintings/${painting.path('img')}`;
        document.getElementById("extendedTitle").innerText = painting.path('name');
        document.getElementById("extendedDescription").innerText = "_ x _\n20__"; // Did not implement description in schema
        curPainting = painting.path('name');

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
    image.src = `./paintings/${painting.path('img')}`;
    image.alt = painting.path('name');
    text.innerText = painting.path('name');  
    newPainting.appendChild(image); 
    newTitle.appendChild(text); 
}

// adds all the painting in the list to the gallery in rows of 4
function addAllPaintings() {
    list = document.getElementById("galleryList");
    let paintings = db.gallery.find().pretty();
    for (painting in paintings) {
        if (list.rows[list.rows.length - 1].cells.length == 4) {
            //add two new rows to only have 4 in each row
            list.insertRow(-1);
            list.insertRow(-1);
        }
        addPainting(list.rows[list.rows.length - 2],list.rows[list.rows.length - 1], painting);
    }
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

// fills up the gallery for testing
addAllPaintings();
