const PaintingSchema = new mongoose.Schema({
    work_number: Number,
    name:       String,
    price:      Number,
    sold:       {
        type: Boolean,
        default: false
    },
});
const Painting = mongoose.model("Painting", PaintingSchema);

const UserSchema = new mongoose.Schema({
    user_number: Number,
    username: String,
    admin_acct: Boolean,
    my_bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Painting
    }],
    my_likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Painting"
    }],
});
const User = mongoose.model("User", UserSchema);
