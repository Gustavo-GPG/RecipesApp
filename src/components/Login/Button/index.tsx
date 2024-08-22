import { ButtonType } from '../../../types';

function Button({ clicar, dataTestId, disabled }: ButtonType) {
  return (
    <button
      data-testid={ dataTestId }
      disabled={ !disabled }
    >
      { clicar }
    </button>
  );
}

export default Button;
