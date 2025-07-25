/*
    Author: Connor Kippes

    Handles setting up detailed view of a painting and like functionality.
*/

let curUser = null;
let curPainting = null;
const heart = document.getElementById("heart");

// this is to make it visible after everything loads up so it doesn't look buggy
const main = document.querySelector('main');

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

// on mouse hover function to put a mini painting into the main view
async function onMiniPaintingHover(newFileName) {
    let mainPainting = document.getElementById("big-painting");

    // start fade out
    mainPainting.style.opacity = 0;

    // fade out and then in in effect
    setTimeout(() => {
        mainPainting.src = `../paintings_webp/${newFileName}`;

        mainPainting.onload = () => {
            mainPainting.style.opacity = 1;
        };
    }, 300);
}

// adds an alternate image under the main painting in the if it exists in the folder
function addMiniPainting(fileName, number) {
    //first at the number to the image name
    let fileNameSplit = fileName.split(".");
    let newFileName = fileNameSplit[0] + number + "." + fileNameSplit[1];

    if (number === 1) {
        newFileName = fileName;
    }

    fetch(`../paintings_webp/${newFileName}`)
        .then((response) => {
            if (response.ok) {
                let miniPainting = document.getElementById(
                    "mini-painting" + number
                );
                miniPainting.src = `../paintings_webp/${newFileName}`;

                miniPainting.addEventListener("mouseenter", () => {
                    onMiniPaintingHover(newFileName);
                });
            } else {
                console.log("File " + newFileName + " not found");
                let miniPainting = document.getElementById(
                    "mini-painting" + number
                );
                miniPainting.remove();
            }
        })
        .catch((error) => {
            console.error("Error checking file:", error);
        });
}

// 24x24x1 --> 24" L x 24" W x 1" D
function formatDimensions(dim) {
    let dimensions = dim.split("x");

    let length = dimensions[0] + '" L x ';
    let width = dimensions[1] + '" W x ';
    let depth = dimensions[2] + '" D';

    return length + width + depth;
}

async function setupPainting() {
    const params = new URLSearchParams(window.location.search);
    const paintingName = params.get("name");

    const response = await fetch(`/getPainting/${paintingName}`);
    const painting = await response.json();
    curPainting = painting;

    updateHeart(painting);

    // add the big image
    document.getElementById(
        "big-painting"
    ).src = `../paintings_webp/${painting.image}`;

    // add all the mini images underneath it if able
    addMiniPainting(painting.image, 1);
    addMiniPainting(painting.image, 2);
    addMiniPainting(painting.image, 3);
    addMiniPainting(painting.image, 4);
    addMiniPainting(painting.image, 5);

    // add the title
    document.getElementById("title").innerText = painting.name;

    // add the description
    let description = "";
    description += formatDimensions(painting.dimensions);
    if (painting.mult) {
        description += " Each";
    }
    description += "\n" + painting.date;

    if (painting.paint != "") {
        description += "\n" + painting.paint + " Paint on " + painting.canvas;
        description += "\n" + painting.finish;
    }

    if (painting.framed) {
        description += "\nFramed";
    } else {
        description += "\nUnframed";
    }
    description += "\n\n" + painting.desc;

    document.getElementById("description").innerText = description;

    main.style.visibility = "visible";
}

setupPainting();

// updates the heart image based on if the user has the painting favorited or not
function updateHeart(painting) {
    if (curUser == null) {
        let foundPainting = false;

        fetch(`/getGuestPaintings`)
            .then((response) => response.text())
            .then((data) => {
                let guestPaintings = data.split(",");
                for (let paintingName of guestPaintings) {
                    if (paintingName === painting.name) {
                        //change heart back to red
                        heart.style.fill = "red";
                        foundPainting = true;
                        break;
                    }
                }
                if (!foundPainting) {
                    heart.style.fill = "rgb(75, 75, 75)";
                }
            })
            .catch((error) => console.error("Error:", error));
    } else {
        let foundPainting = false;
        for (let paintingName of curUser.my_likes) {
            if ((paintingName = painting.name)) {
                //change heart back to red
                heart.style.fill = "red";
                foundPainting = true;
                break;
            }
        }
        if (!foundPainting) {
            heart.style.fill = "rgb(75, 75, 75)";
        }
    }
}

// when the heart is clicked add or remove it from the users favorites list
async function heartClicked() {
    if (curUser == null) {
        if (heart.style.fill === "rgb(75, 75, 75)") {
            heart.style.fill = "red";

            heart.style.transform = "scale(1.4)";
            setTimeout(() => {
                heart.style.transform = "scale(1)";
            }, 200);

            fetch(`/updateGuestLike/${curPainting.name}`);
        } else {
            heart.style.fill = "rgb(75, 75, 75)";
            fetch(`/updateGuestLike/${curPainting.name}`);
        }
    } else {
        if (heart.style.fill === "rgb(75, 75, 75)") {
            heart.style.fill = "red";

            heart.style.transform = "scale(1.4)";
            setTimeout(() => {
                heart.style.transform = "scale(1)";
            }, 200);

            fetch(`/updateLike/${curUser.username}/${curPainting.name}/false`);
        } else {
            heart.style.fill = "rgb(75, 75, 75)";
            fetch(`/updateLike/${curUser.username}/${curPainting.name}/true`);
        }
    }
}

heart.onclick = heartClicked;
