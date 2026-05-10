/*
    Author: Connor Kippes

    Handles index page rainbow gallery logic.
*/

async function loadRainbowGalleryPainting(imgElem) {
    const paintingName = imgElem.alt;

    try {
        const res = await fetch(
            `/painting/${encodeURIComponent(paintingName)}`,
        );
        if (!res.ok) {
            console.warn(
                `Unable to load painting ${paintingName}:`,
                res.status,
            );
            return;
        }

        const painting = await res.json();
        if (painting && painting.image) {
            imgElem.src = painting.image;
            imgElem.onload = () => {
                imgElem.style.opacity = "1";
            };
        }
    } catch (err) {
        console.error(`Error loading painting ${paintingName}:`, err);
    }
}



async function onStartup() {
    // need this so that logout button updates
    await setTimeout(() => {}, 500);

    // fill the img soruces for the rainbow gallery on the home page
    document.querySelectorAll(".rainbow-gallery-painting").forEach((img) => {
        loadRainbowGalleryPainting(img);
    });
    const hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
}

onStartup();
