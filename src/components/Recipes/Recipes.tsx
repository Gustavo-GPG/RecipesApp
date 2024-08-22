import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAllRecipes } from '../../helpers/fetchApi';
import RecipeCard from '../RecipeCard/RecipeCard';
import { RecipeType } from '../../types';
import { GlobalContext } from '../../Context/GlobalContext';

export default function Recipes() {
  const [layout, setLayout] = useContext(GlobalContext);
  const { searchResults } = layout;
  const { pathname } = useLocation();
  useEffect(() => {
    const initialFetch = async () => {
      const data = await fetchAllRecipes(pathname);
      setLayout({ searchResults: {
        ...layout.searchResults,
        [pathname.replace('/', '')]: data,
      } });
    };
    initialFetch();
  }, []);

  return ( //
    <div>
      {pathname === '/meals' && searchResults.meals.length > 0 && (
        searchResults.meals.slice(0, 12).map((meal:RecipeType, index: any) => (
          <RecipeCard
            index={ index }
            key={ meal.idMeal }
            recipe={ meal }
            data-testid={ `${meal.idMeal}-recipe-card` }
          />
        ))
      )}
      {pathname === '/drinks' && searchResults.drinks.length > 0 && (
        searchResults.drinks.slice(0, 12).map((drink: RecipeType, index: any) => (
          <RecipeCard
            index={ index }
            key={ drink.idDrink }
            recipe={ drink }
            data-testid={ `${drink.idDrink}-recipe-card` }
          />
        ))
      )}
    </div>
  );
}
