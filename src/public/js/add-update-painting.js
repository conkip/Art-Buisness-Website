/*
    Author: Connor Kippes

    Handles adding or updating a painting.
*/

let addPainting = false;
let curPainting = null;

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

    if (paintingName === null) {
        addPainting = true;
        return;
    }

    const response = await fetch(
        `/painting/${encodeURIComponent(paintingName)}`,
    );
    const painting = await response.json();
    console.log(painting);
    curPainting = painting;

    // Populate fields
    document.getElementById("name").value = painting.name;
    document.getElementById("length").value = painting.dimensions?.length || "";
    document.getElementById("width").value = painting.dimensions?.width || "";
    document.getElementById("depth").value = painting.dimensions?.depth || "";
    document.getElementById("paint").value = painting.paint || "";
    document.getElementById("canvas").value = painting.canvas || "";
    document.getElementById("finish").value = painting.finish || "";
    document.getElementById("price").value = painting.price || "";
    document.getElementById("mult").checked = painting.mult;
    document.getElementById("framed").checked = painting.framed;
    document.getElementById("sold").checked = painting.sold;
    document.getElementById("desc").value = painting.desc || "";

    // Populate images
    const uploadBoxes = document.querySelectorAll(".upload-box");
    const imageUrls = painting.images || [];
    imageUrls.forEach((imgUrl, index) => {
        if (index < uploadBoxes.length && imgUrl) {
            const box = uploadBoxes[index];
            const img = new Image();
            img.onload = () => {
                box.appendChild(img);
                box.querySelector(".placeholder").style.display = "none";
            };
            // if image doesn't exist, do nothing — placeholder stays
            img.src = imgUrl;
        }
    });
}

function handleCancel() {
    window.location.href = "/admin.html";
}

function titleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

document
    .getElementById("add-update-painting-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        // Parse inputs
        const name = titleCase(document.getElementById("name").value.trim());
        const length = document.getElementById("length").value.trim();
        const width = document.getElementById("width").value.trim();
        const depth = document.getElementById("depth").value.trim();
        const paint = titleCase(document.getElementById("paint").value.trim());
        const canvas = titleCase(
            document.getElementById("canvas").value.trim(),
        );
        const finish = titleCase(
            document.getElementById("finish").value.trim(),
        );
        const price = document.getElementById("price").value.trim();
        const mult = document.getElementById("mult").checked;
        const framed = document.getElementById("framed").checked;
        const sold = document.getElementById("sold").checked;
        const desc = document.getElementById("desc").value.trim(); // no parsing for desc

        // Collect selected files from the upload boxes
        const fileEntries = [];
        document.querySelectorAll(".upload-box").forEach((box, index) => {
            if (box._selectedFile) {
                fileEntries.push({ file: box._selectedFile, index });
            }
        });

        if (fileEntries.length === 0 && addPainting) {
            alert("Please select at least one image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (length) formData.append("length", length);
        if (width) formData.append("width", width);
        if (depth) formData.append("depth", depth);
        if (paint) formData.append("paint", paint);
        if (canvas) formData.append("canvas", canvas);
        if (finish) formData.append("finish", finish);
        if (price) formData.append("price", price);
        formData.append("mult", mult);
        formData.append("framed", framed);
        formData.append("sold", sold);
        if (desc) formData.append("desc", desc);

        fileEntries.forEach(({ file, index }) => {
            formData.append("images", file);
            formData.append("imageSlots", index);
        });

        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        let url, method, successMessage, errorMessage;
        if (addPainting) {
            url = "/painting";
            method = "POST";
            successMessage = {
                text: "Painting Added",
                className: "toast-success",
            };
            errorMessage = {
                text: "Error Adding Painting",
                className: "toast-error",
            };
        } else {
            url = `/painting/${encodeURIComponent(curPainting.name)}`;
            method = "PUT";
            successMessage = {
                text: "Painting Updated",
                className: "toast-success",
            };
            errorMessage = {
                text: "Error Updating Painting",
                className: "toast-error",
            };
            if (name !== curPainting.name) {
                formData.append("newName", name);
            }
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: formData,
            });

            if (response.ok) {
                sessionStorage.setItem(
                    "toastMessage",
                    JSON.stringify(successMessage),
                );
                window.location.href = "/admin.html";
            } else {
                showToast(errorMessage.text, 3000, errorMessage.className);
            }
        } catch (error) {
            console.error("Error:", error);
            showToast(errorMessage.text, 3000, errorMessage.className);
        }
    });

/* upload image logic- done with AI */
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
      <input type="file" accept="image/*" name="images">
      <button type="button" class="remove" title="Remove">×</button>
    `;

    const input = box.querySelector("input");
    const placeholder = box.querySelector(".placeholder");
    const removeBtn = box.querySelector(".remove");

    box.addEventListener("click", (e) => {
        if (e.target !== removeBtn) input.click();
    });

    input.addEventListener("change", () => {
        if (input.files[0]) {
            box._selectedFile = input.files[0];
            loadImage(input.files[0]);
            input.value = "";
        }
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
        box._selectedFile = null;
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
