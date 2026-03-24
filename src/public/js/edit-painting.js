/*
    Author: Connor Kippes

    Handles adding, editing, or deleting a painting.
*/

/*
    Author: Connor Kippes

    Admin page JS- add, edit, or delete paintings.
*/

const editPaintingsContainer = document.getElementById("edit-paintings-container");

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

        const paintings = await res.json();
        renderPaintingList(paintings);
    } catch (err) {
        console.error(err);
        editPaintingsContainer.innerHTML = "<p class='error'>Unable to load paintings.</p>";
    }
}

function getIcon(templateId) {
    const template = document.getElementById(templateId);
    return template.content.cloneNode(true);
}

function renderPaintingList(paintings) {
    // Paintings should already be sorted by name (server-side), but ensure it here too.
    paintings.sort((a, b) => a.name.localeCompare(b.name));

    editPaintingsContainer.innerHTML = "";

    for (const painting of paintings) {
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
        editBtn.className = "icon-btn";
        editBtn.title = "Edit";
        const editIcon = document.createElement("span");
        editIcon.className = "icon";
        editIcon.setAttribute("aria-hidden", "true");
        editIcon.appendChild(getIcon("icon-edit"));
        editBtn.appendChild(editIcon);
        editBtn.addEventListener("click", () => {
            window.location.href = `admin-edit.html?name=${encodeURIComponent(painting.name)}`;
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "icon-btn";
        deleteBtn.title = "Delete";
        const deleteIcon = document.createElement("span");
        deleteIcon.className = "icon";
        deleteIcon.setAttribute("aria-hidden", "true");
        deleteIcon.appendChild(getIcon("icon-delete"));
        deleteBtn.appendChild(deleteIcon);
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

(async () => {
    if (await ensureAdmin()) {
        await loadPaintingsForAdmin();
    }
})();