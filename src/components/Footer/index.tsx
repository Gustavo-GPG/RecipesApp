import { Link } from 'react-router-dom';
import drinkIcon from '../../images/drinkIcon.svg';
import mealIcon from '../../images/mealIcon.svg';
import './index.css';

function Footer() {
  return (
    <footer data-testid="footer">
      <Link to="/drinks">
        <img src={ drinkIcon } data-testid="drinks-bottom-btn" alt="" />
      </Link>
      <Link to="/meals">
        <img src={ mealIcon } data-testid="meals-bottom-btn" alt="" />
      </Link>
    </footer>
  );
}

export default Footer;
