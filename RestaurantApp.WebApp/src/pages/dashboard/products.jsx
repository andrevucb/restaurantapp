import { useCallback, useEffect, useState } from "react";
import { useAuth } from '../../contexts/useAuth';

function Products() {
  const [products, setProducts] = useState([]);
  const { authFetch } = useAuth();

  const apiUrl = 'http://localhost:5148/api';

  const fetchProducts = useCallback(async function fetchProducts() {
    try {
      const response = await authFetch(`${apiUrl}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [authFetch]);

  useEffect(() => {
    async function loadProducts() {
      await fetchProducts();
    }

    void loadProducts();
  }, [fetchProducts]);

  return (
    <section className="dashboard-section">
      <h1 className="dashboard-section__title">Productos</h1>

      <button className="dashboard-section__add">+ Nuevo Producto</button>

      <table className="dashboard-section__table">
        <colgroup>
          <col className="dashboard-section__column--image" />
          <col className="dashboard-section__column--name" />
          <col className="dashboard-section__column--description" />
          <col className="dashboard-section__column--group" />
          <col className="dashboard-section__column--actions" />
        </colgroup>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Grupo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!products.length && <tr><td colSpan="5">No hay productos disponibles</td></tr>}
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <div className="dashboard-section__image">
                  {product.image ? (
                    <img src={`http://localhost:5148${product.image}`} alt={product.name} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category.name}</td>
              <td className="dashboard-section__actions">
                <button className="dashboard-section__edit">Editar</button>
                <button className="dashboard-section__delete">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Products
