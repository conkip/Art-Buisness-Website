/*
  Connor Kippes

  Javascript for extendedGallery.js
  handles setting up the gallery with all the paintings in the database and
  when a user clicks on a painting to open the extended view
*/

// let domainName = "127.0.0.1";
// let port = 3000;

let domainName = '142.93.207.86'
let port = 80;

let curUser = null;
let curPainting = null;

async function onStartup() {
    await fetch(`http://${domainName}:${port}/getCurUser`)
        .then((response) => {
            if (response.headers.get('Content-Length') === '0') {
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            // no user logged in
            if(data != null){
                curUser = data;
            }
        })
        .catch(error => console.error('Error:', error));
}

onStartup();

// addPainting puts the given painting in the gallery with its img and title
// adds the onclick function to both the img and the title and set class to match style
async function addPainting(imgList, titleList, painting) {
    let url = `http://${domainName}:${port}/getPainting/${painting.name}`;

    // onclick function displays the clicked on image in the gallery extended view
    // and hides the rest of the gallery from view
    // with the correct bid info and heart status
    async function onPaintingClick(localPainting) {
        curPainting = localPainting;
        updateHeart(localPainting);
        updateBid(localPainting);

        document.getElementById("gallerySection").style.display = "none"; //visibility = "collapse";
        let extendedGallery = document.getElementById("galleryExtended");
        extendedGallery.style.visibility = "visible";
        extendedGallery.style.marginTop = "70px";
        document.getElementById("extendedImg").src = `../paintings/${localPainting.image}`;
        document.getElementById("extendedTitle").innerText = localPainting.name;
        document.getElementById("extendedDescription").innerText = localPainting.desc;
        document.getElementById("extendedDescription").classList.add('subtitle');
    }

    const newPainting = imgList.insertCell(-1);
    const newTitle = titleList.insertCell(-1);
    const image = document.createElement("img"); 
    const text = document.createElement("p"); 
    newPainting.className = "galleryCell";
    newTitle.className = "galleryCell";
    image.className = "galleryImg";
    text.className = "galleryTitle";
    image.onclick = () => onPaintingClick(painting);
    text.onclick = () => onPaintingClick(painting);
    image.src = `../paintings/${painting.image}`;
    image.alt = painting.name;
    text.innerText = painting.name;
    newPainting.appendChild(image);
    newTitle.appendChild(text);
}

// updates the heart image based on if the user has the painting favorited or not
function updateHeart(localPainting) {
    if(curUser == null) {
        document.getElementById("heart").style.filter = "grayscale(100%)";
    }
    else {
        let foundPainting = false;
        for(let paintingName of curUser.my_likes)
        {
            if(paintingName == localPainting.name){
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
function updateBid(localPainting) {
    let exprDate = localPainting.bidExpiration.split("/");

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    daysLeft = (parseInt(exprDate[1]) - day)
    daysLeft += (parseInt(exprDate[0]) - month) * 31 //assuming flat rate of months
    daysLeft += (parseInt(exprDate[2]) - year) * 365


    document.getElementById("daysLeft").innerText = "Days Left: " + daysLeft
    document.getElementById("curStatus").style.width = (((30 - daysLeft) / 30) * 600) + "px";

    document.getElementById("curBid").innerText = "Current Bid: $" + localPainting.bid;
    document.getElementById("bidHolder").innerText = "Bid Holder: " + localPainting.bidHolder;
}

// when the heart is clicked add or remove it from the users favorites list
async function heartClicked() {
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
            fetch(`/updateLike/${curUser.username}/${curPainting.name}/false`);

        } else {
            document.getElementById("heart").style.filter = "grayscale(100%)";
            fetch(`/updateLike/${curUser.username}/${curPainting.name}/true`);
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
        for(let paintingName of curUser.my_bids)
        {
            if(paintingName == curPainting.name){
                foundPainting = true;
                break;
            }
        }
        if(!foundPainting) {
            fetch(`/updateUserBid/${curUser.username}/${curPainting.name}/`);
        }

        let bidAmount = parseInt(document.getElementById("newBid").value);
        let bidHolder = curUser.username;
        fetch(`/updatePaintingBid/${bidHolder}/${curPainting.name}/${bidAmount}`);
    } 
}

document.getElementById("heart").onclick = heartClicked;
document.getElementById("makeBid").onclick = submitBid;