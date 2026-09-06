import { useCallback, useEffect, useState } from "react";
import ProductCategoryEditor from "../../components/ProductCategoryEditor";
import { useAuth } from '../../contexts/useAuth';

function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { authFetch } = useAuth();

  const apiUrl = 'http://localhost:5148/api'

  const fetchCategories = useCallback(async function fetchCategories() {
    try {
      const response = await authFetch(`${apiUrl}/product-categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [authFetch]);

  const fetchProductSizes = useCallback(async function fetchProductSizes() {
    try {
      const response = await authFetch(`${apiUrl}/product-sizes`);
      const data = await response.json();
      setProductSizes(data);
    } catch (error) {
      console.error('Error fetching product sizes:', error);
    }
  }, [authFetch]);

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

  async function handleDeleteCategory(e, categoryId) {
    e.preventDefault();
    
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      const response = await authFetch(`${apiUrl}/product-categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  }

  useEffect(() => {
    async function loadDashboardData() {
      await Promise.all([fetchCategories(), fetchProductSizes()]);
    }

    void loadDashboardData();
  }, [fetchCategories, fetchProductSizes]);

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
                <button className="dashboard-section__delete" onClick={(e) => handleDeleteCategory(e, category.id)}>Borrar</button>
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
          authFetch={authFetch}
          onClose={handleCloseEditor}
          onSave={handleSaveCategory}
        />
      )}
    </section>
  )
}

export default ProductCategories
