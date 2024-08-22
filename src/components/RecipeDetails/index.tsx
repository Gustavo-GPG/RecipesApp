import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { RecipeDetailsType } from '../../types';
import RecommendationCard from '../../containers/RecommendationCard';
import { getMealById, getDrinkById } from '../../helpers/fetchApi';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import shareIcon from '../../images/shareIcon.svg';
import useRecipeInProgress from '../../hooks/useRecipeInProgress';

function RecipeDetails(props: any) {
  const [mealsRecomendation, setMealsRecomendation] = useState<RecipeDetailsType[]>([]);
  const [linkCopied, setLinkCopied] = useState(false); // req33
  const { handleFavorite,
    isFavorited, setIsFavorited, setMealData, serDrinkData,
    handleCountIngredients } = useRecipeInProgress();
  const { pathname } = useLocation();

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erro ao buscar as refeições.');
      })
      .then((data) => {
        setMealsRecomendation(data.meals); // Atualiza o estado com os dados recebidos
      })
      .catch((error) => {
        console.error('.Erro ao buscar as refeições:', error);
      });
  }, []);

  const [drinksRecomendations, setDrinksRecomendation] = useState();

  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erro ao buscar as refeições');
      })
      .then((data) => {
        setDrinksRecomendation(data.drinks); // Atualiza o estado com os dados recebidos
      })
      .catch((error) => {
        console.error('Erro ao buscar as refeições:', error);
      });
  }, []);
  console.log(drinksRecomendations);

  const { tipo } = props;
  const { id } = useParams<string>();
  const path = tipo === 'meals' ? 'themealdb' : 'thecocktaildb';
  const [recipes, setRecipes] = useState<RecipeDetailsType[]>([]);
  const paragraphs = Array.from({ length: 20 }, (_, index) => index + 1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://www.${path}.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erro ao buscar as refeições');
      })
      .then((data) => {
        setRecipes(data.meals || data.drinks); // Atualiza o estado com os dados recebidos
      })
      .catch((error) => {
        console.error('Erro ao buscar as refeições:', error);
      });
  }, [id, path]);

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

  const handleShare = () => { // req33
    const newPathname = window.location.href.replace('/in-progress', '');
    navigator.clipboard.writeText(newPathname);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  const recommendations = tipo === 'meals' ? drinksRecomendations : mealsRecomendation;
  const handleProgress = () => {
    if (tipo === 'meals') {
      navigate(`/meals/${id}/in-progress`);
    } else if (tipo === 'drinks') {
      navigate(`/drinks/${id}/in-progress`);
    }
  };

  return (
    <div>
      {recipes && recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <div key={ index }>
            <h1 data-testid="recipe-title">{recipe.strMeal || recipe.strDrink}</h1>
            <img
              src={ tipo === 'meals' ? recipe.strMealThumb : recipe.strDrinkThumb }
              alt=""
              data-testid="recipe-photo"
            />
            <p data-testid="recipe-category">
              {recipe.strCategory}
              {recipe.strAlcoholic}
            </p>
            <div>
              {paragraphs.map((index1) => {
                const ingredientKey = `strIngredient${index1}` as keyof RecipeDetailsType;
                const measureKey = `strMeasure${index1}` as keyof RecipeDetailsType;

                return (
                  <p
                    key={ index1 }
                    data-testid={ `${index1 - 1}-ingredient-name-and-measure` }
                  >
                    {recipe[ingredientKey]}
                    <br />
                    {recipe[measureKey]}
                  </p>
                );
              })}
            </div>
            <p data-testid="instructions">{recipe.strInstructions}</p>
            <p data-testid="video">{recipe.strYoutube}</p>
          </div>
        ))
      ) : (
        <p>loading...</p>
      )}

      <div style={ { display: 'flex', overflowX: 'scroll' } }>
        { recommendations && recommendations.slice(0, 6).map((recipe, index) => (
          <RecommendationCard key={ index } recipe={ recipe } index={ index } />
        ))}
      </div>
      <button
        data-testid="start-recipe-btn"
        style={ { position: 'fixed', bottom: 0 } }
        onClick={ handleProgress }
      >
        {tipo === 'meals' ? 'Start' : 'Continue'}
        {' '}
        Recipe
      </button>
      <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
        <button data-testid="share-btn" onClick={ handleShare }>
          <img src={ shareIcon } alt="Share" />
        </button>
        {linkCopied && <h3>Link copied!</h3>}

        <button
          onClick={ handleFavorite }
        >
          <img
            src={ isFavorited ? blackHeartIcon : whiteHeartIcon }
            alt="Favorite Recipe"
            data-testid="favorite-btn"
          />
          Favorite
        </button>
      </div>
    </div>
  );
}

export default RecipeDetails;
