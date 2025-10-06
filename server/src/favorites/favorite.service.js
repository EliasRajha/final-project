import mongoose from "mongoose";
import FavoriteModel from "./favorite.model.js";
import { DeckModel } from "../decks/deck.model.js";
import { createAndThrowError } from "../util/createAndThrowError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

class FavoriteService {
  async addFavorite(userId, deckId) {
    const deck = await DeckModel.findById(deckId);
    if (!deck) createAndThrowError(HTTP_STATUS.NOT_FOUND, "Deck not found");

    await FavoriteModel.updateOne(
      { userId, deckId },
      {
        $setOnInsert: {
          userId: new mongoose.Types.ObjectId(userId),
          deckId: new mongoose.Types.ObjectId(deckId),
        },
      },
      { upsert: true },
    );
    return { message: "Added to favorites" };
  }

  async removeFavorite(userId, deckId) {
    await FavoriteModel.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
      deckId: new mongoose.Types.ObjectId(deckId),
    });
    return { message: "Removed from favorites" };
  }

  async listFavorites(userId) {
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "decks",
          localField: "deckId",
          foreignField: "_id",
          as: "deck",
        },
      },
      { $unwind: "$deck" },
      {
        $lookup: {
          from: "users",
          localField: "deck.userId",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      { $match: { "deck.isPublic": true, "owner.isDeleted": false } },
      {
        $lookup: {
          from: "cards",
          localField: "deck._id",
          foreignField: "deckId",
          as: "cards",
        },
      },
      {
        $addFields: {
          "deck.cardsCount": { $size: "$cards" },
          "deck.userInfo": {
            username: "$owner.username",
            _id: "$owner._id",
            profilePictureUrl: "$owner.profilePictureUrl",
          },
        },
      },
      {
        $project: {
          _id: 0,
          deck: {
            _id: 1,
            title: 1,
            description: 1,
            language: 1,
            createdAt: 1,
            isPublic: 1,
            cardsCount: 1,
            userInfo: 1,
          },
        },
      },
      { $replaceRoot: { newRoot: "$deck" } },
      { $sort: { createdAt: -1 } },
    ];

    const items = await FavoriteModel.aggregate(pipeline).collation({
      locale: "en",
      strength: 2,
    });
    return { items, total: items.length, pages: 1 };
  }
}

export default FavoriteService;
