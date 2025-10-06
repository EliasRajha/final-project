import { HTTP_STATUS } from "../constants/httpStatus.js";
import FavoriteService from "./favorite.service.js";
import { favoriteDeckParamsSchema } from "./favorite.schema.js";

const favoriteService = new FavoriteService();

export const addFavorite = async (req, res) => {
  const { deckId } = favoriteDeckParamsSchema.parse(req.params);
  const result = await favoriteService.addFavorite(req.user.id, deckId);
  res.status(HTTP_STATUS.OK).json(result);
};

export const removeFavorite = async (req, res) => {
  const { deckId } = favoriteDeckParamsSchema.parse(req.params);
  const result = await favoriteService.removeFavorite(req.user.id, deckId);
  res.status(HTTP_STATUS.OK).json(result);
};

export const listFavorites = async (req, res) => {
  const result = await favoriteService.listFavorites(req.user.id);
  res.status(HTTP_STATUS.OK).json(result);
};
