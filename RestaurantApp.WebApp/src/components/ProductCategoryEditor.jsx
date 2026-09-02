import { useRef, useEffect, useState } from "react";

function ProductCategoryEditor({ isNew, category, productSizes, apiUrl, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    prices: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    // Initialize form data
    if (isNew) {
      // For new categories, initialize prices with all product sizes
      setFormData({
        name: "",
        prices: productSizes.map(size => ({
          productSizeId: size.id,
          price: 1
        }))
      });
    } else if (category) {
      // For editing, populate with existing category data
      setFormData({
        name: category.name,
        prices: category.prices.map(p => ({
          productSizeId: p.productSizeId,
          price: p.price
        }))
      });
    }
  }, [isNew, category, productSizes]);

  function handleNameChange(e) {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  }

  function handlePriceChange(productSizeId, value) {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map(p =>
        p.productSizeId === productSizeId
          ? { ...p, price: parseFloat(value) || 0 }
          : p
      )
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isNew ? `${apiUrl}/product-categories` : `${apiUrl}/product-categories/${category.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          prices: formData.prices
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? "create" : "update"} category`);
      }

      onSave();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(`Error saving category: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  }

  const sizeMap = productSizes.reduce((acc, size) => {
    acc[size.id] = size;
    return acc;
  }, {});

  return (
    <dialog ref={dialogRef} className="group-editor-container" onClose={onClose}>
      <h1 className="group-editor-container__title">{isNew ? "Nueva Categoria" : "Editar Grupo"}</h1>

      <form className="group-editor-form" onSubmit={handleSubmit}>
        <fieldset className="group-editor-form__section group-editor-form__general">
          <legend className="group-editor-form__legend">Información General</legend>

          <div className="form__input">
            <label htmlFor="name">Nombre del grupo:</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              autoFocus
              required
              value={formData.name}
              onChange={handleNameChange}
            />
          </div>
        </fieldset>

        <fieldset className="group-editor-form__section group-editor-form__pricing">
          <legend className="group-editor-form__legend">Matriz de Precios</legend>

          <div className="group-editor-form__header" aria-hidden="true">
            <span>Tamaño</span>
            <span>Unidad</span>
            <span>Precio</span>
          </div>

          {formData.prices.map(price => {
            const size = sizeMap[price.productSizeId];
            return (
              <div key={price.productSizeId} className="group-editor-form__row">
                <span>{size?.size}</span>
                <span>{size?.unit}</span>
                <div className="form__input">
                  <label htmlFor={`price-${price.productSizeId}`}>Precio para {size?.size} {size?.unit}</label>
                  <input
                    type="number"
                    id={`price-${price.productSizeId}`}
                    name={`price-${price.productSizeId}`}
                    min="1"
                    step="0.01"
                    required
                    value={price.price}
                    onChange={(e) => handlePriceChange(price.productSizeId, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </fieldset>
        <div className="group-editor-form__actions">
          <button
            className="group-editor-form__button group-editor-form__button--submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="group-editor-form__button group-editor-form__button--cancel"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default ProductCategoryEditor