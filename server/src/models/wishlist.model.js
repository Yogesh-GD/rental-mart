import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  });
export  const Wishlist = mongoose.model("Wishlist", wishlistSchema);  