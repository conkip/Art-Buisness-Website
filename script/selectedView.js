/*
  Connor Kippes

  Javascript for selectedView.js
  handles setting up the gallery with all the paintings in the database and
  when a user clicks on a painting to open the details of the selected painting
*/

let curUser = null;
let curPainting = null;

async function onStartup() {
    await fetch(`/getCurUser`)
        .then((response) => {
            if (response.headers.get("Content-Length") === "0") {
                return null;
            }
            return response.json();
        })
        .then((data) => {
            console.log("Response:", data);
            // no user logged in
            if (data != null) {
                curUser = data;
            }
        })
        .catch((error) => console.error("Error:", error));
}

onStartup();

// addPainting puts the given painting in the gallery with its image and title
// adds the onclick function to both the image and the title
async function addPainting(imgList, titleList, painting) {
    // onclick function displays the clicked on image in the detailed view
    // and hides the rest of the gallery from view
    async function onPaintingClick(localPainting) {
        curPainting = localPainting;
        updateHeart(localPainting);

        document.getElementById("gallery-section").style.display = "none"; //visibility = "collapse";
        let selectedView = document.getElementById("selected-view");
        selectedView.style.visibility = "visible";
        selectedView.style.marginTop = "70px";
        document.getElementById(
            "selected-image"
        ).src = `../paintings/${localPainting.image}`;
        document.getElementById(
            "selected-image1"
        ).src = `../paintings/${localPainting.image}`;
        document.getElementById(
            "selected-image2"
        ).src = `../paintings/${localPainting.image}`;
        document.getElementById(
            "selected-image3"
        ).src = `../paintings/${localPainting.image}`;
        document.getElementById(
            "selected-image4"
        ).src = `../paintings/${localPainting.image}`;
        document.getElementById("selected-title").innerText =
            localPainting.name;

        let description = "";
        description += formatDimensions(localPainting.dimensions);
        if (localPainting.mult) {
            description += " Each";
        }
        description += "\n" + localPainting.date;
        description += "\n" + localPainting.paint + " Paint";
        description += "\n" + localPainting.canvas;
        description += "\n" + localPainting.finish;
        if (localPainting.framed) {
            decription += "\nFramed";
        } else {
            description += "\nUnframed";
        }
        description += "\n\n" + localPainting.desc;

        document.getElementById("selected-description").innerText = description;
        document
            .getElementById("selected-description")
            .classList.add("subtitle");
    }

    const newPainting = imgList.insertCell(-1);
    const newTitle = titleList.insertCell(-1);
    const image = document.createElement("img");
    const text = document.createElement("p");
    newPainting.className = "gallery-cell";
    newTitle.className = "gallery-cell";
    image.className = "gallery-image";
    text.className = "gallery-title";
    image.onclick = () => onPaintingClick(painting);
    text.onclick = () => onPaintingClick(painting);
    image.src = `../paintings/${painting.image}`;
    image.alt = painting.name;
    text.innerText = painting.name;
    newPainting.appendChild(image);
    newTitle.appendChild(text);
}

function formatDimensions(dim) {
    let dimensions = dim.split("x");

    let length = dimensions[0] + '" L x ';
    let width = dimensions[1] + '" W x ';
    let depth = dimensions[2] + '" D';

    return length + width + depth;
}

// updates the heart image based on if the user has the painting favorited or not
function updateHeart(localPainting) {
    if (curUser == null) {
        let foundPainting = false;

        fetch(`/getGuestPaintings`)
            .then((response) => response.text())
            .then((data) => {
                let guestPaintings = data.split(" ");
                for (let paintingName of guestPaintings) {
                    if (paintingName == localPainting.name) {
                        //change heart back to red
                        document.getElementById("heart").style.filter =
                            "grayscale(0%)";
                        foundPainting = true;
                        break;
                    }
                }
                if (!foundPainting) {
                    document.getElementById("heart").style.filter =
                        "grayscale(100%)";
                }
            })
            .catch((error) => console.error("Error:", error));
    } else {
        let foundPainting = false;
        for (let paintingName of curUser.my_likes) {
            if (paintingName == localPainting.name) {
                //change heart back to red
                document.getElementById("heart").style.filter = "grayscale(0%)";
                foundPainting = true;
                break;
            }
        }
        if (!foundPainting) {
            document.getElementById("heart").style.filter = "grayscale(100%)";
        }
    }
}

// when the heart is clicked add or remove it from the users favorites list
async function heartClicked() {
    if (curUser == null) {
        heart = document.getElementById("heart");
        if (heart.style.filter == "grayscale(100%)") {
            document.getElementById("heart").style.filter = "grayscale(0%)";
            fetch(`/updateGuestLike/${curPainting.name}`);
        } else {
            document.getElementById("heart").style.filter = "grayscale(100%)";
            fetch(`/updateGuestLike/${curPainting.name}`);
        }
    } else {
        heart = document.getElementById("heart");
        if (heart.style.filter == "grayscale(100%)") {
            document.getElementById("heart").style.filter = "grayscale(0%)";
            fetch(`/updateLike/${curUser.username}/${curPainting.name}/false`);
        } else {
            document.getElementById("heart").style.filter = "grayscale(100%)";
            fetch(`/updateLike/${curUser.username}/${curPainting.name}/true`);
        }
    }
}

document.getElementById("heart").onclick = heartClicked;
