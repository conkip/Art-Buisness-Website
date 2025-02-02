/*
  Connor Kippes

  Javascript for extendedGallery.js
  handles setting up the gallery with all the paintings in the database and
  when a user clicks on a painting to open the extended view
*/

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

        document.getElementById("gallerySection").style.display = "none"; //visibility = "collapse";
        let extendedGallery = document.getElementById("galleryExtended");
        extendedGallery.style.visibility = "visible";
        extendedGallery.style.marginTop = "70px";
        document.getElementById("extendedImg").src = `../paintings/${localPainting.image}`;
        document.getElementById("extendedTitle").innerText = localPainting.name;
        document.getElementById("extendedDescription").innerText = formatDescription(localPainting.desc);
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

function formatDescription(desc) {
    let stuff = desc.split("\n");

    let newString = "";
    newString += "Size: " + stuff[0] + " in\n";
    newString += "Date: " + stuff[1] + "\n";
    newString += "Artist: Kasey Kurowsky\n\n"

    newString += stuff[2] + "\n";
    newString += stuff[3] + "\n";
    newString += stuff[4] + "\n";

    return newString;
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

document.getElementById("heart").onclick = heartClicked;