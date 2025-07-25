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
    try{
        await fetch(`/getCurUser`)
        .then((response) => {
            if (response.headers.get("Content-Length") === "0") {
                return null;
            }
            return response.json();
        })
        .then((data) => {
            // no user logged in
            if (data != null) {
                curUser = data;
            }
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
        console.error("Error:", error);
    }
}

onStartup();

// on mouse hover or click of a mini painting- put it into the main view
async function changeBigPainting(newFileName) {
    let bigPainting = document.getElementById("big-painting");

    // start fade out
    bigPainting.style.opacity = 0;

    // fade out and then in effect
    setTimeout(() => {
        bigPainting.src = `../paintings_webp/${newFileName}`;

        bigPainting.onload = () => {
            bigPainting.style.opacity = 1;
        };
    }, 300);

}

// adds an alternate image under the big painting in the if it exists in the folder
function addMiniPainting(fileName, number) {
    //first at the number to the image name
    let fileNameSplit = fileName.split(".");
    let newFileName = fileNameSplit[0] + number + "." + fileNameSplit[1];

    if (number === 1) {
        newFileName = fileName;
    }

    try {
        fetch(`../paintings_webp/${newFileName}`)
            .then((response) => {
                if (response.ok) {
                    let miniPainting = document.getElementById(
                        "mini-painting" + number
                    );
                    miniPainting.src = `../paintings_webp/${newFileName}`;

                    miniPainting.onclick = () => changeBigPainting(newFileName);

                    let hoverTimeout;

                    // change the big painging if the user hovers over a mini painting
                    miniPainting.addEventListener("mouseenter", () => {
                        hoverTimeout = setTimeout(() => {
                            changeBigPainting(newFileName);
                        }, 300);
                    });

                    // cancel change if they dont hover for long enough
                    miniPainting.addEventListener("mouseleave", () => {
                        clearTimeout(hoverTimeout);
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
    } catch (error) {
        console.error("Error:", error);
    }
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

    // add the big painting
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
    }
    if (painting.finish != "") {
        description += "\n" + painting.finish;
    }

    if (painting.framed) {
        description += "\nFramed";
    } else {
        description += "\nUnframed";
    }
    description += "\n\n" + painting.desc;

    document.getElementById("description").innerText = description;

    setTimeout(() => {
        main.style.visibility = "visible";
    }, 100);
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
