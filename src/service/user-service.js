import User from "../model/user.js";

async function getUserByUsername(username) {
    return await User.findOne({ username });
}

async function addLike(username, painting) {
    const user = await User.findOne({ username });
    if (!user.my_likes.includes(painting)) {
        user.my_likes.push(painting);
        await user.save();
    }
}

async function removeLike(username, painting) {
    const user = await User.findOne({ username });
    user.my_likes = user.my_likes.filter((p) => p !== painting);
    await user.save();
}

export default { getUserByUsername, addLike, removeLike };
