import express from "express";
import cors from "cors";
import deckRouter from "./decks/deck.router.js";
import userRouter from "./users/user.router.js";
import userProgressRouter from "./usersProgress/userProgress.router.js";
import generalRouter from "./general/general.router.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import favoriteRouter from "./favorites/favorite.router.js";
// Create an express server
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/decks", deckRouter);
app.use("/api/user-progress", userProgressRouter);
app.use("/api/general", generalRouter);
app.use("/api/favorites", favoriteRouter);
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );

  // Redirect *file requests to client, but skip /api
  app.get("/*file", (req, res, next) => {
    if (req.path.startsWith("/api")) return next(); // Let /api go to notFound

    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    );
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
