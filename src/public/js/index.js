/*
    Author: Connor Kippes

    Handles index page rainbow gallery logic.
*/

async function loadRainbowGalleryPainting(imgElem) {
    const paintingName = imgElem.dataset.paintingName;

    try {
        const res = await fetch(
            `/paintings/${encodeURIComponent(paintingName)}`,
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

    return fetch(`/users/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
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
            // no user logged in
            if (data == null) {
                loginSignupButton.classList.remove("none");
                logoutButton.classList.add("none");
                deleteButton.classList.add("none");
            } else {
                loginSignupButton.classList.add("none");
                logoutButton.classList.remove("none");
                deleteButton.classList.remove("none");
            }
        })
        .catch((error) => console.error("Error:", error));
}

// wait for login button to be loaded and then apply observer
onStartup().then(() => {
    const hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});
