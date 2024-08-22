import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import profileIcon from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import SearchBar from '../SearchBar';

function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);
  const { pathname } = useLocation();

  const mostrarIcone = () => {
    return !['/profile', '/done-recipes', '/favorite-recipes'].includes(pathname);
  };

  const headerTitle = () => {
    if (pathname === '/meals') return 'Meals';
    if (pathname === '/drinks') return 'Drinks';
    if (pathname === '/profile') return 'Profile';
    if (pathname === '/done-recipes') return 'Done Recipes';
    if (pathname === '/favorite-recipes') return 'Favorite Recipes';
  };

  const handleClick = () => {
    navigate('/profile');
  };

  const handleSearch = () => {
    setSearch((state) => !state);
  };

  return (
    <div>
      <button
        type="button"
        onClick={ handleClick }
      >
        <img
          src={ profileIcon }
          alt="profile icon"
          data-testid="profile-top-btn"
        />
      </button>
      {mostrarIcone() && (
        <button
          onClick={ handleSearch }
        >
          <img
            data-testid="search-top-btn"
            src={ searchIcon }
            alt="search icon"
          />
        </button>
      )}
      <h1 data-testid="page-title">
        { headerTitle() }
      </h1>
      {search && (
        <SearchBar />
      )}
    </div>
  );
}

export default Header;
