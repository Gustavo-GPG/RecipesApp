import { FormEvent, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchCocktailsAPI, searchMealsAPI } from '../../helpers/fetchApi';
import { RecipeType } from '../../types';
import { GlobalContext } from '../../Context/GlobalContext';

function SearchBar() {
  const [searchOption, setsearchOption] = useState('ingredient');
  const [searchInput, setSearchInput] = useState('');
  const [layout, setLayout] = useContext(GlobalContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const updateSearchBar = (value: RecipeType[], key: string) => {
    setLayout(
      {
        searchResults: {
          ...layout.searchResults,
          [key]: value,
        },
      },
    );
  };
  const firstLetter = 'first-letter';
  const alertMessage = "Sorry, we haven't found any recipes for these filters";

  const handleSearchMeals = async () => {
    const mealsData = await searchMealsAPI(searchOption, searchInput);
    updateSearchBar(mealsData || [], 'meals');
    if (!mealsData.length && searchOption !== firstLetter) {
      return window.alert(alertMessage);
    }
    if (mealsData.length === 1) {
      navigate(`/meals/${mealsData[0].idMeal}`);
    }
  };

  const handleSearchDrinks = async () => {
    const drinksData = await searchCocktailsAPI(searchOption, searchInput);
    updateSearchBar(drinksData || [], 'drinks');
    if (!drinksData.length && searchOption !== firstLetter) {
      return window.alert(alertMessage);
    }
    if (drinksData.length === 1) {
      navigate(`/drinks/${drinksData[0].idDrink}`);
    }
  };

  async function aaa(event: FormEvent) {
    event.preventDefault();
    if (searchOption === firstLetter && searchInput.length > 1) {
      window.alert('Your search must have only 1 (one) character');
    }
    if (pathname === '/meals') {
      await handleSearchMeals();
    }
    if (pathname === '/drinks') {
      await handleSearchDrinks();
    }
  }

  return (
    <div>
      <form onSubmit={ aaa }>
        <input
          type="text"
          name="searchValue"
          onChange={ (e) => setSearchInput(e.target.value) }
          data-testid="search-input"
        />

        <div>
          <label htmlFor="">
            <input
              type="radio"
              name="search"
              value="ingredient"
              checked={ searchOption === 'ingredient' }
              id="ingredient"
              onChange={ () => setsearchOption('ingredient') }
              data-testid="ingredient-search-radio"
            />
            Ingredient
          </label>
          <label htmlFor="name">
            <input
              type="radio"
              name="search"
              value="name"
              id="name"
              checked={ searchOption === 'name' }
              onChange={ () => setsearchOption('name') }
              data-testid="name-search-radio"
            />
            Name
          </label>
          <label htmlFor="">
            <input
              type="radio"
              name="search"
              value="first-letter"
              id="first-letter"
              checked={ searchOption === firstLetter }
              onChange={ () => setsearchOption('first-letter') }
              data-testid="first-letter-search-radio"
            />
            First Letter
          </label>
        </div>

        <button data-testid="exec-search-btn" type="submit">SEARCH</button>
      </form>
    </div>
  );
}

export default SearchBar;
