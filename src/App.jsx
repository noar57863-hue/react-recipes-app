import { Routes, Route } from 'react-router';
import RecipesList from './pages/RecipesList';

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<RecipesList />} />
        {/* בהמשך תלמידה ב׳ תוסיף כאן נתיבים נוספים */}
      </Routes>
    </div>
  );
}