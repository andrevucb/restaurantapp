import { useEffect, useState } from 'react';
import logoImage from '../assets/logo.png';
import pizzaImage from '../assets/pizza_placeholder.jpeg';

function Menu() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:5148/api/products');

        if (!response.ok) {
          throw new Error(`Unable to load products: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          console.error('Error fetching products:', fetchError);
          setError('No se pudieron cargar los productos.');
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const productGroups = products.reduce((groups, product) => {
    const categoryId = product.category.id;
    const existingGroup = groups.find(group => group.id === categoryId);

    if (existingGroup) {
      existingGroup.products.push(product);
    } else {
      groups.push({
        id: categoryId,
        name: product.category.name,
        products: [product],
      });
    }

    return groups;
  }, []);

  return (
    <>
      <header className="menu-header">
        <nav className="menu-header__nav">
          <img src={logoImage} alt="Logo de la aplicación" />
        </nav>
      </header>

      <main className="menu-container">
        {error && <p>{error}</p>}
        {!isLoading && !error && productGroups.length === 0 && (
          <p>No hay productos disponibles.</p>
        )}

        {productGroups.map(group => (
          <article className="menu-group" key={group.id}>
            <h2>{group.name}</h2>

            <div className="menu-group__items">
              {group.products
                .sort((firstProduct, secondProduct) => firstProduct.name.localeCompare(secondProduct.name))
                .map(product => (
                  <article className="menu-item__card" key={product.id}>
                    <figure className="menu-item__image">
                      <img
                        src={product.image ? `http://localhost:5148${product.image}` : pizzaImage}
                        alt={product.image ? `Imagen de ${product.name}` : 'Imagen de referencia de una pizza'}
                      />
                    </figure>

                    <div className="menu-item__content">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="menu-item__actions">
                        <button type="button" aria-label={`Añadir ${product.name} al pedido`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 font-bold text-white">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </article>
        ))}
      </main>
    </>
  );
}

export default Menu