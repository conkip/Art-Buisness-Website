import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
const JWT_SECRET = process.env.JWT_SECRET;

async function signup(username, password) {
    if (await User.findOne({ username })) {
        throw { status: 409, message: "User already exists" };
    }

    const hashed = await bcrypt.hash(password, 10);
    await new User({ username, password: hashed }).save();

    return jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
}

async function login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
        throw { status: 401, message: "User does not exist" };
    }
    if (!(await bcrypt.compare(password, user.password))) {
        throw { status: 401, message: "Wrong password" };
    }

    return jwt.sign({ username, isAdmin: user.isAdmin }, JWT_SECRET, {
        expiresIn: "1d",
    });
}

async function deleteUser(username) {
    const deleted = await User.deleteOne({ username });
    if (deleted.deletedCount === 0) {
        throw { status: 404, message: "User not found" };
    }
}

export default { signup, login, deleteUser };
