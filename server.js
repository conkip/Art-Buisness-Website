/*
    Author: Connor Kippes

    Includes GET, POST, and DELETE enpoints for the server.
    Follows RESTful API principles.

    Handles:
        - User authentication
        - User GET and DELETE from the database
        - Painting GET from the database
        - User likes GET, POST, and DELETE
        - Guest likes GET, POST, and DELETE
*/

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const setupPaintings = require("./setup-paintings");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;
const domainName = process.env.DOMAIN || "127.0.0.1";
const dbURL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

let User, Painting;

/** authenticates the user with JWT */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).send("Access token missing");

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token");
        req.user = user; // { username }
        next();
    });
}

/* ========== SERVER SETUP ========== */
async function startServer() {
    await mongoose.connect(dbURL);

    const PaintingSchema = new mongoose.Schema({
        name: String,
        image: String,
        dimensions: {
            type: {
                length: Number,
                width: Number,
                depth: Number
            },
            default: undefined
        },
        date: { type: Number, default: undefined },
        paint: { type: String, default: undefined },
        canvas: { type: String, default: undefined },
        finish: { type: String, default: undefined },
        desc: { type: String, default: undefined },
        price: { type: Number, default: undefined },
        mult: { type: Boolean, default: false },
        framed: { type: Boolean, default: false },
        sold: { type: Boolean, default: false },
    });

    const UserSchema = new mongoose.Schema({
        username: String,
        password: String,
        my_likes: { type: [String], default: [] },
    });

    Painting = mongoose.model("Painting", PaintingSchema);
    User = mongoose.model("User", UserSchema);

    // delete first and then add paintings to db when running the server
    await mongoose.connection.db.collection("paintings").deleteMany({});
    await setupPaintings(Painting);

    /** ========== AUTH ROUTES ========== */
    app.post("/auth/signup", async (req, res) => {
        const { username, password } = req.body;
        if (await User.findOne({ username: username })) {
            return res.status(409).send("User already exists");
        }

        const hashed = await bcrypt.hash(password, 10);
        await new User({ username, password: hashed }).save();

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    });

    app.post("/auth/login", async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid username or password");
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    });


    app.delete("/auth/delete", authenticateToken, async (req, res) => {
        const deleted = await User.deleteOne({ username: req.user.username });
        if (deleted.deletedCount === 0) {
            return res.status(404).send("User not found");
        }

        res.sendStatus(200);
    });

    /* ========== USER ROUTES ========== */
    app.get("/users/me", authenticateToken, async (req, res) => {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.send(null);
        }

        res.json(user);
    });

    app.post("/users/me/likes/:name", authenticateToken, async (req, res) => {
        const painting = decodeURIComponent(req.params.name);
        const user = await User.findOne({ username: req.user.username });

        if (!user.my_likes.includes(painting)) {
            user.my_likes.push(painting);
            await user.save();
        }

        res.send("Like added");
    });

    app.delete("/users/me/likes/:name", authenticateToken, async (req, res) => {
        const painting = decodeURIComponent(req.params.name);
        const user = await User.findOne({ username: req.user.username });

        user.my_likes = user.my_likes.filter(p => p !== painting);
        await user.save();

        res.send("Like removed");
    });

    /* ========== GUEST ROUTES ========== */
    app.get("/user/guest/likes", (req, res) => {
        let curPaintings = req.cookies.paintings;
        if (curPaintings != undefined) {
            curPaintings = decodeURIComponent(curPaintings);
            res.send(curPaintings);
            return;
        }
        res.send("");
    });

    app.post("/users/guest/likes/:name", (req, res) => {
        const painting = decodeURIComponent(req.params.name);

        let paintings = req.cookies.paintings;

        if (paintings === undefined) {
            res.cookie("paintings", painting, { httpOnly: true });
            res.send("Cookie set!");
            return;
        }

        paintings = decodeURIComponent(paintings);
        paintings = paintings.split(",");

        if(paintings == ""){
            res.cookie("paintings", painting, {httpOnly: true,});
        }
        else {
            // add the painting to the end if theres already one
            res.cookie("paintings", paintings + "," + painting, {
                httpOnly: true,
            });
        }
        res.send("Cookie set!");
    });

    app.delete("/users/guest/likes/:name", (req, res) => {
        const painting = decodeURIComponent(req.params.name);

        let paintings = req.cookies.paintings;
        if (paintings != undefined) {
            paintings = decodeURIComponent(paintings);
            paintings = paintings.split(",");
        }

        // remove the painting from likes
        const index = paintings.indexOf(painting);
        paintings.splice(index, 1);

        // convert back to a string
        let newPaintings = "";
        for (let painting of paintings) {
            newPaintings += painting + ",";
        }

        // remove trailing comma if there were multiple paintings
        newPaintings = newPaintings.endsWith(",")
            ? newPaintings.slice(0, -1)
            : newPaintings;

        res.cookie("paintings", newPaintings, { httpOnly: true });
        res.send("Cookie set!");
    });

    /* ========== PAINTING ROUTES ========== */
    app.get("/paintings", async (req, res) => {
        const paintings = await Painting.find();
        res.json(paintings);
    });

    app.get("/paintings/:name", async (req, res) => {
        const name = decodeURIComponent(req.params.name);
        const painting = await Painting.findOne({ name: name });
        res.json(painting);
    });

    /** ========== STATIC + 404 ========== */
    app.use(express.static("public_html"));
    app.use("/images", express.static("images"));
    app.use("/paintings_webp", express.static("paintings_webp"));
    app.use("/script", express.static("script"));
    app.use("/style", express.static("style"));

    app.use((req, res, next) => {
        res.status(404).send("<h1>404 - Not Found</h1>");
    });

    app.listen(port, domainName, () => {
        console.log(`Server running at http://${domainName}:${port}/`);
    });
}

startServer();
