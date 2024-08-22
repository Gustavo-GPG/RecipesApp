import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import { isValidForm, handleSubmit } from '../../helpers/loginFunctions';
import { INITIAL_STATE_LOGIN } from './InitialState';

function Login() {
  const [loginForm, setLoginForm] = useState(INITIAL_STATE_LOGIN);
  const navigate = useNavigate();

  const { email, password } = loginForm;

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const submitAndNavigate = (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(email)(event);
    navigate('/meals');
  };

  return (
    <form onSubmit={ submitAndNavigate }>
      <Input
        label="Email"
        name="email"
        type="email"
        dataTestId="email-input"
        value={ email }
        handleChange={ handleChange }
      />

      <Input
        label="Senha"
        name="password"
        type="password"
        dataTestId="password-input"
        value={ password }
        handleChange={ handleChange }
      />

      <Button
        clicar="Entrar"
        dataTestId="login-submit-btn"
        disabled={ isValidForm(email, password) }
        handleSubmit={ handleSubmit(email) }
      />
    </form>
  );
}

export default Login;
