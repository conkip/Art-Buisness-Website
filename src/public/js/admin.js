/*
    Author: Connor Kippes

    Admin page JS: list all paintings for editing / deleting.
*/

const editPaintingsContainer = document.getElementById(
    "edit-paintings-container",
);
const paintingSearchInput = document.getElementById("painting-search");
const editIconTemplate = document.getElementById("edit-icon-template");
const deleteIconTemplate = document.getElementById("delete-icon-template");
let paintingsCache = [];

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

async function loadPaintingsForAdmin() {
    try {
        const res = await fetch("/painting");
        if (!res.ok) throw new Error("Failed to load paintings");

        paintingsCache = await res.json();
        renderPaintingList(paintingsCache);
    } catch (err) {
        console.error(err);
        editPaintingsContainer.innerHTML =
            "<p class='big-p text-red'>Unable to load paintings.</p>";
    }
}

function cloneIcon(template) {
    const svg = template?.content?.firstElementChild?.cloneNode(true);
    return svg ?? document.createElement("span");
}

function renderPaintingList(paintings) {
    const sortedPaintings = [...paintings].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    editPaintingsContainer.innerHTML = "";

    if (sortedPaintings.length === 0) {
        editPaintingsContainer.innerHTML =
            "<p class='empty'>No paintings found.</p>";
        return;
    }

    for (const painting of sortedPaintings) {
        const row = document.createElement("div");
        row.className = "painting-row";

        const thumb = document.createElement("img");
        thumb.className = "painting-thumb";
        thumb.src = painting.image;
        thumb.alt = painting.name;

        const name = document.createElement("span");
        name.className = "painting-name";
        name.textContent = painting.name;

        const actions = document.createElement("div");
        actions.className = "painting-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "icon-btn edit";
        editBtn.title = "Edit";
        editBtn.setAttribute("aria-label", "Edit painting");
        editBtn.appendChild(cloneIcon(editIconTemplate));
        editBtn.addEventListener("click", () => {
            window.location.href = `admin-edit.html?name=${encodeURIComponent(painting.name)}`;
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "icon-btn delete";
        deleteBtn.title = "Delete";
        deleteBtn.setAttribute("aria-label", "Delete painting");
        deleteBtn.appendChild(cloneIcon(deleteIconTemplate));
        deleteBtn.addEventListener("click", () => {
            if (!confirm(`Delete \"${painting.name}\"?`)) return;
            deletePainting(painting._id, row);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        row.appendChild(thumb);
        row.appendChild(name);
        row.appendChild(actions);

        editPaintingsContainer.appendChild(row);
    }
}

async function deletePainting(id, rowElem) {
    try {
        const res = await fetch(`/painting/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Delete failed");

        rowElem.remove();
    } catch (err) {
        console.error(err);
        showToast("Failed to delete painting.");
    }
}

function filterPaintingsByName() {
    const query = paintingSearchInput?.value.trim().toLowerCase() || "";
    const filtered = paintingsCache.filter((painting) =>
        painting.name.toLowerCase().includes(query),
    );
    renderPaintingList(filtered);
}

(async () => {
    if (paintingSearchInput) {
        paintingSearchInput.addEventListener("input", filterPaintingsByName);
    }

    if (await ensureAdmin()) {
        await loadPaintingsForAdmin();
    }
})();
