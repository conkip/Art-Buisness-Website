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
        await fetch(`/users/me`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            const contentType = response.headers.get("Content-Type");

            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                return null;
            }
        })
        .then((data) => {
            console.log("User Data: " + data);
            curUser = data;
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
        console.error("Error:", error);
    }
}

(async () => {
    await onStartup();
    await setupPainting();
})();

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
                    let miniPaintings = document.getElementById("mini-paintings");

                    let newDiv = document.createElement("div");
                    newDiv.classList.add("mini-painting-container");
                    miniPaintings.appendChild(newDiv);

                    let newImg = document.createElement("img");
                    newDiv.appendChild(newImg);
                    newImg.id = `mini-painting${number}`
                    newImg.alt = `Mini Painting ${number}`
                    newImg.src = `../paintings_webp/${newFileName}`;
                    newImg.onclick = () => changeBigPainting(newFileName);

                    let hoverTimeout;

                    // change the big painging if the user hovers over a mini painting
                    newImg.addEventListener("mouseenter", () => {
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

    const response = await fetch(`/paintings/${paintingName}`);
    const painting = await response.json();
    curPainting = painting;

    updateHeart();

    // add the big painting
    document.getElementById(
        "big-painting"
    ).src = `../paintings_webp/${painting.image}`;

    // add all the mini images underneath it if able
    for(let i = 1; i < 6; i++) {
        addMiniPainting(painting.image, i);
    }

    // add the title
    document.getElementById("title").innerText = painting.name;

    // add the description
    let description = "";
    if(painting.dimensions != "") {
         description += formatDimensions(painting.dimensions);
         if (painting.mult) {
            description += " Each";
        }
        description += "\n";
    }

    if (painting.date !== "") {
        description += painting.date + "\n";
    }

    if (painting.paint !== "") {
        description += painting.paint + " Paint on " + painting.canvas + "\n";
    }
    if (painting.finish !== "") {
        description += painting.finish + "\n";
    }

    if (painting.framed) {
        description += "Framed\n";
    }

    if (painting.date !== "") {
        description += "\n" + painting.desc;
    }

    document.getElementById("description").innerText = description;
}

// wait until everything is loaded to make more seamless
window.addEventListener('load', () => {
    main.style.visibility = "visible";
    console.log('Page and all resources are fully loaded.');
});

// updates the heart image based on if the user has the painting favorited or not
function updateHeart() {
    if (curUser === null) {
        let foundPainting = false;

        fetch("/user/guest/likes")
            .then((response) => response.text())
            .then((data) => {
                let guestPaintings = data.split(",");
                for (let paintingName of guestPaintings) {
                    if (paintingName === curPainting.name) {
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
            if (paintingName === curPainting.name) {
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
    if (curUser === null) {
        if (heart.style.fill === "rgb(75, 75, 75)") {
            heart.style.fill = "red";

            heart.style.transform = "scale(1.4)";
            setTimeout(() => {
                heart.style.transform = "scale(1)";
            }, 200);

            fetch(`/users/guest/likes/${curPainting.name}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            showToast("Like added");
        } else {
            heart.style.fill = "rgb(75, 75, 75)";
            fetch(`/users/guest/likes/${curPainting.name}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            showToast("Like removed");
        }
    } else {
        if (heart.style.fill === "rgb(75, 75, 75)") {
            heart.style.fill = "red";

            heart.style.transform = "scale(1.4)";
            setTimeout(() => {
                heart.style.transform = "scale(1)";
            }, 200);

            fetch(`/users/me/likes/${curPainting.name}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            showToast("Like added");
        } else {
            heart.style.fill = "rgb(75, 75, 75)";

            fetch(`/users/me/likes/${curPainting.name}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            showToast("Like removed");
        }
    }
}

heart.onclick = heartClicked;
