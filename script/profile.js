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

const mongoose = require("mongoose");
const db = mongoose.connection;


// ADDED BID HOLDER AND DAYS LEFT TO PAINTINGSCHEMA

// const PaintingSchema = new mongoose.Schema({
//     painting_number: Number,
//     name:       String,
//     highest_bid:      Number,
//     bid_holder:       String, //might need to be changed to user number if usernames are not unique
//     days_left:      Number,
//     img:    String,
//     sold:       {
//         type: Boolean,
//         default: false
//     }
// });
// const Painting = mongoose.model("Painting", PaintingSchema);

// const UserSchema = new mongoose.Schema({
//     user_number: Number,
//     username: String,
//     admin_acct: Boolean,
//     my_bids: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Painting"
//     }],
//     my_likes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Painting"
//     }],
// });
// const User = mongoose.model("User", UserSchema);

const currentUserNum = 1; // NEEDS TO BE CHANGED
const currentPaintingNum = 1; // NEEDS TO BE CHANGED


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
        let curPainting = await Painting.findOne({name: paintingName});


        // get bid status info
        
        numDaysLeft = curPainting.days_left;
        document.getElementById("daysLeft").innerText = "Days Left: " + numDaysLeft;
        document.getElementById("curStatus").style.width = (((30 - numDaysLeft) / 30) * 600) + "px";
        document.getElementById("curBid").innerText = "Current Bid: $" + curPainting.highest_bid;
        document.getElementById("bidHolder").innerText = "Bid Holder: " + curPainting.bid_holder;
        

        // get heart status

        let curUser = await User.findOne({user_number: currentUserNum});
        if (curPainting in curUser.my_likes) {
            document.getElementById("heart").style.filter = "grayscale(0%)";
        } else {
            document.getElementById("heart").style.filter = "grayscale(100%)";
        }
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
    if (currentUser == 0) {
        alert("You must be logged in to favorite a painting or make a bid.");
        return;
    }
    let curUser = await User.findOne({user_number: currentUserNum});
    let curPainting = await Painting.findOne({painting_number: currentPaintingNum});

    heart = document.getElementById("heart")
    if (heart.style.filter ==  "grayscale(100%)") {
        document.getElementById("heart").style.filter = "grayscale(0%)";
        // add to current user's favorite list
        curUser.my_likes.push(curPainting);

    } else {
        document.getElementById("heart").style.filter = "grayscale(100%)";
        // remove from current user's favorite list
        curUser.my_likes.splice(curUser.my_likes.indexOf,1); //not sure if this will work
    }
    await curUser.save()
}

// saves the users bid the database
function submitBid() {
    let curPainting = await Painting.findOne({painting_number: currentPaintingNum});
    let curUser = await User.findOne({user_number: currentUserNum});
    let bid = document.getElementById("newBid").value;
    if (bid > curPainting.highest_bid){
        curPainting.highest_bid = bid;
        curPainting.bid_holder = curUser.username;
        curUser.my_bids.push(curPainting);
        if (curPainting in curUser.my_bids) {
            curUser.my_bids.push(curPainting);
        } // add to bid list if the not current in list
        document.getElementById("curBid").innerText = "Current Bid: $" + bid;
        document.getElementById("bidHolder").innerText = "Bid Holder: " + curUser.username;
        curPainting.save();
        curUser.save();
        
    } else {
        alert("The new bid must be higher than the previous highest bid.");
    } 
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

