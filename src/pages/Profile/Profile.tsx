import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { Header } from '../../components';

export default function Profile() {
  const navigate = useNavigate();
  const email = localStorage.getItem('user');

  const recipesDone = () => {
    navigate('/done-recipes');
  };

  const recipesFavorite = () => {
    navigate('/favorite-recipes');
  };

  const logoutRecipe = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <Header />
      <p>
        Email:
        {' '}
        <span data-testid="profile-email">
          {email}
          {' '}
        </span>
      </p>
      <button
        onClick={ recipesDone }
        data-testid="profile-done-btn"
      >
        Done Recipes
      </button>
      {' '}
      <button
        onClick={ recipesFavorite }
        data-testid="profile-favorite-btn"
      >
        Favorite Recipes
      </button>
      {' '}
      <button
        onClick={ logoutRecipe }
        data-testid="profile-logout-btn"
      >
        Logout
      </button>
      <div>
        <Footer />
      </div>
    </>
  );
}
