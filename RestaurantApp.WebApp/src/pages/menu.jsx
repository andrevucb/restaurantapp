import logoImage from '../assets/logo.png';
import pizzaImage from '../assets/pizza_placeholder.jpeg';

function Menu() {
  return (
    <>
      <header className="menu-header">
        <nav className="menu-header__nav">
          <img src={logoImage} alt="Logo de la aplicación" />
        </nav>
      </header>

      <main className="menu-container">
        <article className="menu-group">
          <h2>Grupo 1</h2>

          <div className="menu-group__items">
            <article className="menu-item__card">
              <figure className="menu-item__image">
                <img src={pizzaImage} alt="Imagen de referencia de una pizza" />
              </figure>

              <div className="menu-item__content">
                <h3>Criolla</h3>
                <p>Salsa de tomate, mozzarella, pimenton, cebolla, acituna negras, lomito, locoto (opcional).</p>
                <div className="menu-item__actions">
                  <button type="button" aria-label="Añadir Criolla al pedido">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 font-bold text-white">
                      <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </article>

        <article className="menu-group">
          <h2>Grupo 2</h2>

          <div className="menu-group__items">
            <article className="menu-item__card">
              <figure className="menu-item__image">
                <img src={pizzaImage} alt="Imagen de referencia de una pizza" />
              </figure>

              <div className="menu-item__content">
                <h3>Morron</h3>
                <p>Salsa de tomate, mozzarella, calabresa, pimentón verde.</p>
                <div className="menu-item__actions">
                  <button type="button" aria-label="Añadir Morron al pedido">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 font-bold text-white">
                      <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </article>
      </main>
    </>
  );
}

export default Menu