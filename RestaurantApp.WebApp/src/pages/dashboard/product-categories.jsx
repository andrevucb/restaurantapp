import { useEffect, useState } from "react";
import ProductCategoryEditor from "../../components/ProductCategoryEditor";

function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
    if (!category.prices || category.prices.length === 0) {
      return "Sin precios configurados";
    }

    return category.prices
      .map(price => `Bs. ${price.price.toFixed(2).replace('.', ',')} (${price.size} ${price.unit})`)
      .join(", ");
  }

  function handleOpenNewEditor(e) {
    e.preventDefault();
    setIsNewCategory(true);
    setEditingCategory(null);
    setShowEditor(true);
  }

  function handleOpenEditEditor(e, category) {
    e.preventDefault();
    setIsNewCategory(false);
    setEditingCategory(category);
    setShowEditor(true);
  }

  function handleCloseEditor() {
    setShowEditor(false);
    setIsNewCategory(false);
    setEditingCategory(null);
  }

  function handleSaveCategory() {
    fetchCategories();
    handleCloseEditor();
  }

  useEffect(() => {
    fetchCategories();
    fetchProductSizes();
  }, []);

  return (
    <section className="dashboard-section">
      <h1 className="dashboard-section__title">Categorias</h1>

      <button className="dashboard-section__add" onClick={handleOpenNewEditor}>+ Nueva Categoria</button>

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
                <button className="dashboard-section__edit" onClick={(e) => handleOpenEditEditor(e, category)}>Editar</button>
                <button className="dashboard-section__delete">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditor && (
        <ProductCategoryEditor
          isNew={isNewCategory}
          category={editingCategory}
          productSizes={productSizes}
          apiUrl={apiUrl}
          onClose={handleCloseEditor}
          onSave={handleSaveCategory}
        />
      )}
    </section>
  )
}

export default ProductCategories
