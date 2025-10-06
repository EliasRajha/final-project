import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  addFavorite,
  removeFavorite,
  listFavorites,
} from "./favorite.controller.js";

const favoriteRouter = Router();

favoriteRouter.get("/", authenticate, listFavorites);
favoriteRouter.post("/:deckId", authenticate, addFavorite);
favoriteRouter.delete("/:deckId", authenticate, removeFavorite);

export default favoriteRouter;
