import { z } from "zod";
import { objectIdSchema } from "../constants/shared.js";

export const favoriteDeckParamsSchema = z.object({
  deckId: objectIdSchema,
});
