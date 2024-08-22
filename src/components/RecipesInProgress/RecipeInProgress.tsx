import { useEffect } from 'react';
import { getMealById, getDrinkById } from '../../helpers/fetchApi';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import useRecipeInProgress from '../../hooks/useRecipeInProgress';

export default function RecipesInProgress() {
  const { copiedMessageVisible, copyToClipboard, drinkData, handleFavorite,
    isFavorited, mealData, selectedCheckboxes, serDrinkData, setIsFavorited, setMealData,
    setSelectedCheckboxes, id, pathname, handleCheck,
    numberOfIngredients, setNumberOfIngredients, totalIngredientsCount,
    handleCountIngredients, handleFinishRecipe } = useRecipeInProgress();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (id !== undefined) {
          if (pathname.includes('meals')) {
            data = await getMealById(id);
            setMealData(data);
          } else {
            data = await getDrinkById(id);
            serDrinkData(data);
          }
          handleCountIngredients(data);
        }
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };
    fetchData();
    const storedFavoriteRecipes = JSON
      .parse(localStorage.getItem('favoriteRecipes') || '[]');
    const isAlreadyFavorited = storedFavoriteRecipes
      .some((recipe: { id: string | undefined; }) => recipe.id === id);
    setIsFavorited(isAlreadyFavorited);
  }, [id, pathname]);
  console.log(pathname);

  useEffect(() => {
    const storedCheckboxes = JSON
      .parse(localStorage.getItem('inProgressRecipes') || '[]');
    setSelectedCheckboxes(storedCheckboxes);
  }, []);

  const saveSelectedCheckboxesToLocalStorage = (updatedCheckboxes: string[]) => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(updatedCheckboxes));
  };

  const generateCheckBox = (data: any) => {
    const handleCheckboxChange = (ingredientKey: string) => {
      const updatedCheckboxes = selectedCheckboxes.includes(ingredientKey)
        ? selectedCheckboxes.filter((key) => key !== ingredientKey)
        : [...selectedCheckboxes, ingredientKey];

      const markedIngredientsCount = Object.keys(data)
        .filter((key) => key.startsWith('strIngredient')
        && updatedCheckboxes.includes(key))
        .length;

      setSelectedCheckboxes(updatedCheckboxes);
      saveSelectedCheckboxesToLocalStorage(updatedCheckboxes);

      handleCheck(ingredientKey);
      setNumberOfIngredients(markedIngredientsCount);
    };

    return (
      <div>
        {Object.keys(data)
          .filter((key) => key.startsWith('strIngredient') && data[key])
          .map((ingredientKey, index) => (
            <div
              key={ ingredientKey }
            >
              <label
                htmlFor={ ingredientKey }
                data-testid={ `${index}-ingredient-step` }
                style={ {
                  textDecoration: selectedCheckboxes.includes(ingredientKey)
                    ? 'line-through solid rgb(0, 0, 0)'
                    : 'none',
                } }
              >
                <input
                  type="checkbox"
                  id={ ingredientKey }
                  onChange={ () => handleCheckboxChange(ingredientKey) }
                  checked={ selectedCheckboxes.includes(ingredientKey) }
                />
                {data[ingredientKey]}
              </label>
            </div>
          ))}
      </div>
    );
  };
  return (
    <div>
      {mealData && (
        <div>
          <h1
            data-testid="recipe-title"
          >
            {mealData.strMeal}
          </h1>
          <img
            data-testid="recipe-photo"
            src={ mealData.strMealThumb }
            alt={ mealData.strMeal }
          />
          <p
            data-testid="instructions"
          >
            { mealData.strInstructions}
          </p>
          <p
            data-testid="recipe-category"
          >
            {mealData.strCategory}
          </p>
          <div>
            <h3>Ingredientes</h3>
            {generateCheckBox(mealData)}
          </div>
        </div>
      )}
      {drinkData && (
        <div>
          <h1
            data-testid="recipe-title"
          >
            {drinkData.strDrink}
          </h1>
          <img
            data-testid="recipe-photo"
            src={ drinkData.strDrinkThumb }
            alt={ drinkData.strDrink }
          />
          <p
            data-testid="instructions"
          >
            { drinkData.strInstructions}
          </p>
          <p
            data-testid="recipe-category"
          >
            {drinkData.strCategory}
          </p>
          <div>
            <h3>Ingredientes</h3>
            {generateCheckBox(drinkData)}
          </div>
        </div>
      )}
      <button
        data-testid="share-btn"
        onClick={ copyToClipboard }
      >
        Compartilhar
      </button>
      {copiedMessageVisible && <p>Link copied!</p>}
      <button
        onClick={ handleFavorite }
      >
        <img
          src={ isFavorited ? blackHeartIcon : whiteHeartIcon }
          alt="Favorite Recipe"
          data-testid="favorite-btn"
        />
        Favoritar
      </button>
      <button
        data-testid="finish-recipe-btn"
        disabled={ numberOfIngredients !== totalIngredientsCount }
        onClick={ () => handleFinishRecipe(mealData || drinkData) }
      >
        Finalizar receita
      </button>
    </div>
  );
}
