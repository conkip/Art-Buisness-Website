/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for gallery.js
  handles setting up the gallery with all the paintings in the database and
  when a user clicks on a painting to open the extended view
*/

let curPainting = null;
let curUser = null;
document.addEventListener("DOMContentLoaded", () => {
    let domainName = "127.0.0.1:3000"; // change to "leah.knodel.me"
    fetch(`http://${domainName}/getCurUser`)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            // no user logged in
            if(data != null){
                curUser = data;
            }
        })
        .catch(error => console.error('Error:', error));
});

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
        curPainting = painting;
        updateHeart();
        updateBid();

        document.getElementById("gallerySection").style.visibility = "collapse";
        document.getElementById("galleryExtended").style.visibility = "visible";
        document.getElementById("extendedImg").src = `../paintings/${painting.image}`;
        document.getElementById("extendedTitle").innerText = painting.name;
        let extdDesc = document.getElementById("extendedDescription").innerText = painting.desc;
        extdDesc.classList.add('subtitle');
        curPainting = painting.name;
    }

    const newPainting = imgList.insertCell(-1);
    const newTitle = titleList.insertCell(-1);
    const image = document.createElement("img"); 
    const text = document.createElement("p"); 
    newPainting.className = "galleryCell";
    newTitle.className = "galleryCell";
    image.className = "galleryImg";
    text.className = "galleryTitle";
    image.onclick = onPaintingClick;
    text.onclick = onPaintingClick;
    image.src = `../paintings/${painting.image}`;
    image.alt = painting.name;
    text.innerText = painting.name;
    newPainting.appendChild(image);
    newTitle.appendChild(text);
}


// adds all the painting in the list to the gallery in rows of 4
function addAllPaintings() {
    list = document.getElementById("galleryList");

    let domainName = "127.0.0.1:3000"; // change to "leah.knodel.me"
    url = `http://${domainName}/getPaintings`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);

            for (let painting of data) {
                if (list.rows[list.rows.length - 1].cells.length == 4) {
                    // once 4 paintings are in a row, add two new rows:
                    // one for the images and one for the titles
                    list.insertRow(-1);
                    list.insertRow(-1);
                }
                addPainting(list.rows[list.rows.length - 2],list.rows[list.rows.length - 1], painting);
            }
        })
        .catch(error => console.error('Error:', error));
}

// when the heart is clicked add or remove it from the users favorites list
async function heartArt() {
    if(curUser == null) {
        console.log("not logged in")
        //display must be logged in to like a painting
    }
    else
    {
        heart = document.getElementById("heart")
        if (heart.style.filter ==  "grayscale(100%)") {
            // change the heart
            document.getElementById("heart").style.filter = "grayscale(0%)";
            curUser.my_likes.push(curPainting);
            console.log(curUser);
            await curUser.save();

        } else {
            document.getElementById("heart").style.filter = "grayscale(100%)";
            const index = curUser.my_likes.indexOf(painting);
            curUser.my_likes.splice(index,1);
            await curUser.save()
        }
    }
}


// saves the users bid the database
async function submitBid() {
    if(curUser == null) {
        console.log("not logged in")
        //display must be logged in to like a painting
    }
    else
    {
        let foundPainting = false;
        for(let painting of curUser.my_bids)
        {
            if(painting.name == curPainting.name){
                foundPainting = true;
                break;
            }
        }
        if(!foundPainting) {
            curUser.my_bids.push(curPainting);
            await curUser.save()
        }

        curPainting.bid = parseInt(document.getElementById("newBid").value);
        curPainting.bidHolder = curUser.username;
    } 
}

// updates the heart image based on if the user has the painting favorited or not
function updateHeart() {
    if(curUser != null) {
        let foundPainting = false;
        for(let painting of curUser.my_likes)
        {
            if(painting.name == curPainting.name){
                //change heart to red
                document.getElementById("heart").style.filter = "grayscale(0%)";
                foundPainting = true;
                break;
            }
        }
        if(!foundPainting){
            document.getElementById("heart").style.filter = "grayscale(100%)";
        }
    }
}

// updates the current bid based on if the user has made a bid or not
function updateBid() {
    let exprDate = curPainting.bidExpiration.split("/");

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    daysLeft = (parseInt(exprDate[1]) - day)
    daysLeft += (parseInt(exprDate[0]) - month) * 31 //assuming flat rate of months
    daysLeft += (parseInt(exprDate[2]) - year) * 365


    document.getElementById("daysLeft").innerText = "Days Left: " + daysLeft
    document.getElementById("curStatus").style.width = (((30 - daysLeft) / 30) * 600) + "px";

    document.getElementById("curBid").innerText = "Current Bid: $" + curPainting.bid;
    document.getElementById("bidHolder").innerText = "Bid Holder: " + curPainting.bidHolder;
}




// fills up the gallery for testing
addAllPaintings();
