import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home/Home";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import DeckPage from "@/pages/DeckPage";
import CreateDeck from "@/pages/CreateDeck";
import EditDeck from "@/pages/EditDeck";
import CardMode from "@/pages/CardMode";
import QuizMode from "@/pages/QuizMode";
import NotFound from "@/pages/NotFound/NotFoundPage";
import UserProfile from "@/pages/User/UserProfile";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";
import BrowseDecks from "@/pages/BrowseDecks";
import MyDecks from "@/pages/MyDecks";
import { ROUTES } from "@/routes/paths";
import Support from "@/pages/Support";
import Favorites from "@/pages/Favorites";
const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.TERMS} element={<Terms />} />
      <Route path={ROUTES.SUPPORT} element={<Support />} />
      <Route path={ROUTES.FAQ} element={<FAQ />} />

      <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
      <Route
        path={ROUTES.PROFILE}
        element={<Navigate to={ROUTES.USER_PROFILE} replace />}
      />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

      <Route path={ROUTES.DECKS} element={<BrowseDecks />} />
      <Route path={ROUTES.BROWSE} element={<BrowseDecks />} />
      <Route path={ROUTES.MY_DECKS} element={<MyDecks />} />
      <Route path={ROUTES.FAVORITES} element={<Favorites />} />
      <Route path={ROUTES.DECK_CREATE} element={<CreateDeck />} />
      <Route path={ROUTES.DECK_DETAILS(":id")} element={<DeckPage />} />
      <Route path={ROUTES.DECK_EDIT(":id")} element={<EditDeck />} />
      <Route path={ROUTES.DECK_CARD_MODE(":id")} element={<CardMode />} />
      <Route path={ROUTES.DECK_QUIZ_MODE(":id")} element={<QuizMode />} />

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
