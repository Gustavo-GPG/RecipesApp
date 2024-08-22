import { Link, useLocation } from 'react-router-dom';
import { RecipeCardProps } from '../../types';

function RecipeCard({ recipe, index, baseHeadTestId = 'card-name' }: RecipeCardProps) {
  const { pathname } = useLocation();
  return (
    <div data-testid={ `${index}-recipe-card` }>
      <Link to={ `${pathname}/${recipe.idMeal || recipe.idDrink}` }>
        <>
          <img
            data-testid={ `${index}-card-img` }
            src={ recipe.strMealThumb || recipe.strDrinkThumb }
            alt={ recipe.strMeal || recipe.strDrink }
          />
          <h2
            data-testid={ `${index}-${baseHeadTestId}` }
          >
            {recipe.strMeal || recipe.strDrink }
          </h2>
        </>
      </Link>
    </div>
  );
}

export default RecipeCard;
