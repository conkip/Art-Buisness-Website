function getGuestLikes(req, res) {
    const curPaintings = req.cookies.paintings;
    res.send(curPaintings ?? "");
}

function addGuestLike(req, res) {
    const painting = decodeURIComponent(req.params.name);
    let paintings = req.cookies.paintings;

    const list = paintings ? paintings.split(",") : [];

    if (!list.includes(painting)) {
        list.push(painting);
    }

    res.cookie("paintings", list.join(","), { httpOnly: true, encode: String });
    res.send("Cookie set!");
}

function removeGuestLike(req, res) {
    const painting = decodeURIComponent(req.params.name);
    let paintings = req.cookies.paintings;

    let list = paintings ? paintings.split(",") : [];
    list = list.filter(p => p !== painting);  // cleaner than splice

    res.cookie("paintings", list.join(","), { httpOnly: true, encode: String });
    res.send("Cookie set!");
}

export default { getGuestLikes, addGuestLike, removeGuestLike };
