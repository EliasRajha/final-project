import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Deck",
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, deckId: 1 }, { unique: true });

const FavoriteModel = mongoose.model("Favorite", favoriteSchema, "favorites");
export default FavoriteModel;
