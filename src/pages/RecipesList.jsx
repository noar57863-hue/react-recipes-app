import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef(null);

  const search = searchParams.get("q") || "";

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((res) => {
        if (!res.ok) {
          throw new Error("שגיאה בטעינת המתכונים");
        }
        return res.json();
      })
      .then((data) => {
        setRecipes(data.recipes);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  function handleSearch(e) {
    const value = e.target.value;
    if (value.trim() === "") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ q: value }, { replace: true });
    }
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px", color: "#1e293b" }}>מתכונים</h1>

      <input
        ref={searchRef}
        type="text"
        placeholder="חיפוש מתכון (באנגלית)"
        value={search}
        onChange={handleSearch}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "12px 16px",
          fontSize: "1rem",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          marginBottom: "24px",
          outline: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      />

      {loading && <p style={{ color: "#64748b", fontSize: "1.1rem" }}>טוען...</p>}
      {error && <p style={{ color: "#dc2626", fontWeight: "bold" }}>{error}</p>}

      {!loading && !error && (
        filteredRecipes.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredRecipes.map((recipe) => (
              <li
                key={recipe.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <Link
                  to={`/recipes/${recipe.id}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "#0f172a",
                    height: "100%",
                  }}
                >
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }}
                    />
                  )}
                  <div style={{ padding: "14px", fontWeight: "600", fontSize: "1.05rem" }}>
                    {recipe.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>לא נמצאו מתכונים</p>
        )
      )}
    </div>
  );
}