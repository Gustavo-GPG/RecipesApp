import { RecipeDetailsType } from '../../types';

type RecommendationCardProps = {
  recipe: RecipeDetailsType;
  index: number;
};

function RecommendationCard({ recipe, index }: RecommendationCardProps) {
  return (
    <div
      data-testid={ `${index}-recommendation-card` }
      style={ { display: 'block' } }
    >
      <h2
        data-testid={ `${index}-recommendation-title` }
      >
        {recipe.strMeal || recipe.strDrink}
      </h2>
      <img
        src={ recipe.strMealThumb || recipe.strDrinkThumb }
        alt={ recipe.strMeal || recipe.strDrink }
        style={ { width: '250px' } }
      />
    </div>
  );
}

export default RecommendationCard;
