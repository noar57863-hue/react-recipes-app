import { useState, useEffect } from 'react';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockRecipes = [
      { id: 1, title: 'עוגת שוקולד עשירה', category: 'קינוחים', time: '45 דק׳', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
      { id: 2, title: 'מרק עגבניות חם', category: 'מרקים', time: '30 דק׳', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300' },
      { id: 3, title: 'סלט יווני טעיממם', category: 'סלטים', time: '15 דק׳', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300' },
    ];
    setRecipes(mockRecipes);
    setLoading(false);
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '20px' }}>טוען מתכונים...</div>;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', direction: 'rtl' }}>
      <h1>רשימת מתכונים</h1>
      
      {/* שדה חיפוש */}
      <div style={{ marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="חפש לפי שם מתכון או קטגוריה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 15px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* רשת כרטיסיות המתכונים */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <div 
              key={recipe.id}
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
                background: '#fff' 
              }}
            >
              <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <span style={{ fontSize: '12px', background: '#eef2f5', padding: '4px 8px', borderRadius: '4px', color: '#555' }}>
                  {recipe.category}
                </span>
                <h3 style={{ margin: '10px 0 5px 0', fontSize: '18px' }}>{recipe.title}</h3>
                <p style={{ margin: '0', color: '#777', fontSize: '14px' }}>זמן הכנה: {recipe.time}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#777' }}>לא נמצאו מתכונים התואמים את החיפוש.</p>
        )}
      </div>
    </div>
  );
}