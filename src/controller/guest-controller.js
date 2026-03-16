function getGuestLikes(req, res) {
    let curPaintings = req.cookies.paintings;
    if (curPaintings != undefined) {
        curPaintings = decodeURIComponent(curPaintings);
        res.send(curPaintings);
        return;
    }
    res.send("");
}

function addGuestLike(req, res) {
    const painting = decodeURIComponent(req.params.name);
    let paintings = req.cookies.paintings;

    if (paintings === undefined) {
        res.cookie("paintings", painting, { httpOnly: true });
        res.send("Cookie set!");
        return;
    }

    paintings = decodeURIComponent(paintings);
    paintings = paintings.split(",");

    if (paintings == "") {
        res.cookie("paintings", painting, { httpOnly: true });
    } else {
        res.cookie("paintings", paintings + "," + painting, { httpOnly: true });
    }
    res.send("Cookie set!");
}

function removeGuestLike(req, res) {
    const painting = decodeURIComponent(req.params.name);

    let paintings = req.cookies.paintings;
    if (paintings != undefined) {
        paintings = decodeURIComponent(paintings);
        paintings = paintings.split(",");
    }

    const index = paintings.indexOf(painting);
    paintings.splice(index, 1);

    let newPaintings = paintings.join(",");

    res.cookie("paintings", newPaintings, { httpOnly: true });
    res.send("Cookie set!");
}

export default { getGuestLikes, addGuestLike, removeGuestLike };
