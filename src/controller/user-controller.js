import userService from "../service/user-service.js";

async function getMe(req, res) {
    const user = await userService.getUserByUsername(req.user.username);
    res.json(user ?? null);
}

async function addLike(req, res) {
    const painting = decodeURIComponent(req.params.name);
    await userService.addLike(req.user.username, painting);
    res.send("Like added");
}

async function removeLike(req, res) {
    const painting = decodeURIComponent(req.params.name);
    await userService.removeLike(req.user.username, painting);
    res.send("Like removed");
}

export default { getMe, addLike, removeLike };
