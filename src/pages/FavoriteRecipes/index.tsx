import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { FavoriteRecipeType } from '../../types/index';
import { Header } from '../../components';

export default function FavoriteRecipes() {
  const [listFavorites, setListFavorites] = useState<FavoriteRecipeType[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecipeType[]>([]);
  const [copyIndex, setCopyIndex] = useState<number | null>(null);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setFavorites(storage);
    setListFavorites(storage);
  }, []);

  const handleFavorite = (id: string) => {
    setListFavorites(listFavorites.filter((list) => list.id !== id)); //
    localStorage.setItem('favoriteRecipes', JSON.stringify(
      listFavorites.filter((list) => list.id !== id),
    ));
  };

  const handleClick = (
    id: string,
    type: string,
    index: number,
  ) => {
    navigator.clipboard.writeText(`${window.location.origin}/${type}s/${id}`)
      .then(() => {
        setCopyIndex(index);
        setTimeout(() => {
          setCopyIndex(null);
        }, 3000);
      });
  };

  return (
    <>
      <Header />
      <button
        data-testid="filter-by-all-btn"
        onClick={ () => setListFavorites(favorites) }
      >
        All
      </button>
      <button
        data-testid="filter-by-meal-btn"
        onClick={ () => setListFavorites(
          favorites.filter((list) => list.type === 'meal'),
        ) }
      >
        Meals
      </button>
      <button
        data-testid="filter-by-drink-btn"
        onClick={ () => setListFavorites(
          favorites.filter((list) => list.type !== 'meal'),
        ) }
      >
        Drinks
      </button>
      <div>
        { listFavorites.length > 0 ? (
          <>
            { listFavorites.map((list, index) => (
              <div key={ list.id }>
                <Link
                  to={ list.type === 'meal' ? `http://localhost:3000/meals/${list.id}`
                    : `http://localhost:3000/drinks/${list.id}` }
                >
                  <img
                    data-testid={ `${index}-horizontal-image` }
                    src={ list.image }
                    alt={ list.name }
                    style={ { width: '150px' } }
                  />
                </Link>
                <h5
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  { list.type === 'meal' ? `${list.nationality} - ${list.category} `
                    : `${list.alcoholicOrNot}`}
                </h5>
                <Link
                  to={ list.type === 'meal' ? `http://localhost:3000/meals/${list.id}`
                    : `http://localhost:3000/drinks/${list.id}` }
                >
                  <h4
                    data-testid={ `${index}-horizontal-name` }
                  >
                    {list.name}
                  </h4>
                </Link>
                <button
                  data-testid={ `btn-Copy${index}` }
                  onClick={ () => handleClick(list.id, list.type, index) }
                >
                  <img
                    data-testid={ `${index}-horizontal-share-btn` }
                    src={ shareIcon }
                    alt="copiar"
                  />
                </button>
                { copyIndex === index && <p>Link copied!</p>}
                <button
                  data-testid={ `btn-favorite${index}` }
                  onClick={ () => handleFavorite(list.id) }
                >
                  <img
                    data-testid={ `${index}-horizontal-favorite-btn` }
                    src={ blackHeartIcon }
                    alt="heart-black"
                  />
                </button>
              </div>
            ))}
          </>) : 'Nenhuma receita favorita.'}
      </div>
    </>
  );
}
