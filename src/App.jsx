import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
// ↓ כאן כל אחת מוסיפה את ה-import שלה ↓
import RecipesList from "./pages/RecipesList";
import RecipeDetails from "./pages/RecipeDetails";
// ↓ כאן כל אחת מוסיפה את ה־import שלה ↓

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* ↓ כאן כל אחת מוסיפה את ה-Route שלה ↓ */}
        <Route path="recipes" element={<RecipesList />} />
        <Route path="*" element={<NotFound />} />
        <Route path="recipes/:id" element={<RecipeDetails />} />
      </Route>
    </Routes>
  );
}