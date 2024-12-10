const mongoose = require("mongoose");

const PaintingSchema = new mongoose.Schema({
    painting_number: Number,
    name:       String,
    highest_bid:      Number,
    img:    String,
    sold:       {
        type: Boolean,
        default: false
    }
});
const Painting = mongoose.model("Painting", PaintingSchema);

const UserSchema = new mongoose.Schema({
    user_number: Number,
    username: String,
    admin_acct: Boolean,
    my_bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Painting"
    }],
    my_likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Painting"
    }],
});
const User = mongoose.model("User", UserSchema);

