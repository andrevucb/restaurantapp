import { useRef, useEffect, useState } from "react";

function ProductEditor({ isNew, product, categories, apiUrl, authFetch, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    if (isNew) {
      queueMicrotask(() => setFormData({
        name: "",
        description: "",
        categoryId: categories[0]?.id ?? ""
      }));
    } else if (product) {
      queueMicrotask(() => setFormData({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId
      }));
    }
  }, [isNew, product, categories]);

  function handleNameChange(e) {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }

  function handleDescriptionChange(e) {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }

  function handleCategoryChange(e) {
    setFormData(prev => ({ ...prev, categoryId: e.target.value }));
  }

  function handleImageChange(e) {
    setImageFile(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isNew ? `${apiUrl}/products` : `${apiUrl}/products/${product.id}`;
      const method = isNew ? "POST" : "PUT";

      const body = new FormData();
      body.append("Name", formData.name);
      body.append("Description", formData.description);
      body.append("CategoryId", formData.categoryId);
      if (imageFile) {
        body.append("image", imageFile);
      }

      const response = await authFetch(endpoint, {
        method,
        body
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? "create" : "update"} product`);
      }

      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Error saving product: ${error.message}`);
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

  return (
    <dialog ref={dialogRef} className="product-editor-container" onClose={onClose}>
      <h1 className="product-editor-container__title">{isNew ? "Nuevo Producto" : "Editar Producto"}</h1>

      <form className="product-editor-form" onSubmit={handleSubmit}>
        <fieldset className="product-editor-form__section product-editor-form__general">
          <legend className="product-editor-form__legend">Información General</legend>

          <div className="form__input">
            <label htmlFor="name">Nombre:</label>
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

          <div className="form__input">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>

          <div className="form__input">
            <label htmlFor="group">Grupo:</label>
            <select
              id="group"
              name="group"
              required
              value={formData.categoryId}
              onChange={handleCategoryChange}
            >
              <option value="">Seleccione un grupo</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="product-editor-form__section product-editor-form__media">
          <legend className="product-editor-form__legend">Imagen del Producto</legend>

          {!isNew && product?.image && (
            <div className="form__input">
              <label>Imagen actual:</label>
              <img
                src={`http://localhost:5148${product.image}`}
                alt={product.name}
                className="product-editor-form__preview"
                width="75%"
                height={120}
              />
            </div>
          )}

          <div className="form__input">
            <label htmlFor="image">Imagen:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </fieldset>

        <div className="product-editor-form__actions">
          <button
            className="product-editor-form__button product-editor-form__button--submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="product-editor-form__button product-editor-form__button--cancel"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default ProductEditor
