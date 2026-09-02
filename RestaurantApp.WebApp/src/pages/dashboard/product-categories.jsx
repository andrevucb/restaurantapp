import { useEffect, useState } from "react";

function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [productSizes, setProductSizes] = useState([]);

  const apiUrl = 'http://localhost:5148/api'

  async function fetchCategories() {
    try {
      const response = await fetch(`${apiUrl}/product-categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchProductSizes() {
    try {
      const response = await fetch(`${apiUrl}/product-sizes`);
      const data = await response.json();
      setProductSizes(data);
    } catch (error) {
      console.error('Error fetching product sizes:', error);
    }
  }

  function getProductPriceSummary(category) {

  }

  useEffect(() => {
    fetchCategories();
    fetchProductSizes();
  }, []);

  return (
    <section className="dashboard-section">
      <h1 className="dashboard-section__title">Categorias</h1>

      <button className="dashboard-section__add">+ Nueva Categoria</button>

      <table className="dashboard-section__table">
        <colgroup>
          <col className="dashboard-section__column--name" />
          <col className="dashboard-section__column--prices" />
          <col className="dashboard-section__column--actions" />
        </colgroup>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precios Configurados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!categories.length && <tr><td colSpan="3">No hay categorías disponibles.</td></tr>}
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{getProductPriceSummary(category)}</td>
              <td className="dashboard-section__actions">
                <button className="dashboard-section__edit">Editar</button>
                <button className="dashboard-section__delete">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ProductCategories
