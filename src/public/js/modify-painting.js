/*
    Author: Connor Kippes

    Handles adding, editing, or deleting a painting.
*/

async function ensureAdmin() {
    const res = await fetch("/auth/admin-status", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok) {
        window.location.href = "/";
        return false;
    }

    return true;
}

(async () => {
    await ensureAdmin();
    await setupPage();
})();

async function setupPage() {
    const params = new URLSearchParams(window.location.search);
    const paintingName = params.get("name");

    if ((paintingName = null)) {
        return;
    }

    const response = await fetch(`/painting/${paintingName}`);
    const painting = await response.json();
    curPainting = painting;

    // add the big painting (image URL comes from the painting API)
    const bigPaintingContainer = document.getElementById(
        "big-painting-container",
    );
    const bigPainting = document.createElement("img");

    bigPainting.id = "big-painting";
    bigPainting.alt = "Big Painting";
    bigPainting.src = painting.image;

    bigPaintingContainer.appendChild(bigPainting);

    // add all the mini images underneath it if able
    for (let i = 1; i <= 5; i++) {
        addMiniPainting(painting.image, i);
    }

    // add the title
    document.getElementById("title").innerText = painting.name;

    // add the painting details

    const dimensionsElem = document.getElementById("dimensions");
    if (painting.dimensions !== undefined) {
        let dimensions = "";
        dimensions += formatDimensions(painting.dimensions);
        if (painting.mult) {
            dimensions += " Each";
        }
        dimensionsElem.innerText = dimensions;
    } else {
        dimensionsElem.classList.add("display-none");
    }

    const dateElem = document.getElementById("date");
    if (painting.date !== undefined) {
        dateElem.innerText = painting.date;
    } else {
        dateElem.classList.add("display-none");
    }

    const paintAndCanvasElem = document.getElementById("paint-and-canvas");
    if (painting.paint !== undefined) {
        let paintAndCanvas = "";
        paintAndCanvas += painting.paint + " Paint";
        if (painting.canvas !== undefined) {
            paintAndCanvas += " on " + painting.canvas;
        }
        paintAndCanvasElem.innerText = paintAndCanvas;
    } else {
        paintAndCanvasElem.classList.add("display-none");
    }

    const finishElem = document.getElementById("finish");
    if (painting.finish !== undefined) {
        finishElem.innerText = painting.finish;
    } else {
        finishElem.classList.add("display-none");
    }

    const framedStatusElem = document.getElementById("framed-status");
    if (painting.framed) {
        framedStatusElem.innerText = "Framed";
    } else {
        framedStatusElem.classList.add("display-none");
    }

    const priceElem = document.getElementById("price");
    if (painting.price !== undefined) {
        priceElem.innerText = "$" + painting.price;
    } else {
        priceElem.classList.add("display-none");
    }

    const descriptionElem = document.getElementById("description");
    if (painting.desc !== undefined) {
        descriptionElem.innerText = painting.desc;
    } else {
        descriptionElem.classList.add("display-none");
    }
}

/* upload box- done with AI */

document.querySelectorAll(".upload-box").forEach((box, index) => {
    box.innerHTML = `
      <div class="placeholder">
        <svg width="28" height="28" fill="none" stroke="#aaa" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span>Drop or click</span>
      </div>
      <input type="file" accept="image/*" ${index === 0 ? "required" : ""}>
      <button class="remove" title="Remove">×</button>
    `;

    const input = box.querySelector("input");
    const placeholder = box.querySelector(".placeholder");
    const removeBtn = box.querySelector(".remove");

    box.addEventListener("click", (e) => {
        if (e.target !== removeBtn) input.click();
    });

    input.addEventListener("change", () => {
        if (input.files[0]) loadImage(input.files[0]);
        input.value = "";
    });

    box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.classList.add("dragover");
    });
    box.addEventListener("dragleave", () => box.classList.remove("dragover"));
    box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) loadImage(file);
    });

    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const img = box.querySelector("img");
        if (img) {
            URL.revokeObjectURL(img.src);
            img.remove();
        }
        placeholder.style.display = "flex";
    });

    function loadImage(file) {
        let img = box.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            box.appendChild(img);
        } else {
            URL.revokeObjectURL(img.src);
        }
        img.src = URL.createObjectURL(file);
        placeholder.style.display = "none";
    }
});
