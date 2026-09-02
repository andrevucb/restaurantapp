import logoImage from '../../assets/logo.png'

function Login() {
  return(
    <>
      <header className="login-header">
        <img src={logoImage} alt="Logo de la aplicación" className="login-header__logo" />
      </header>

      <main className="login-container">
          <form className="login-form">
              <div className="form__input">
                  <label htmlFor="username">Usuario:</label>
                  <input type="text" id="username" name="username" autocomplete="username" autofocus required />
              </div>
              <div className="form__input">
                  <label htmlFor="password">Contraseña:</label>
                  <input type="password" id="password" name="password" required />
              </div>
              <button className="form__submit" type="submit">Iniciar sesión</button>
          </form>
      </main>
    </>
  );
}

export default Login