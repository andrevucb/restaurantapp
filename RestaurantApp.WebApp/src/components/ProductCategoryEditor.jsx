import { useRef, useEffect } from "react";

function ProductCategoryEditor({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  function handleCancel() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  }

  return (
    <dialog ref={dialogRef} className="group-editor-container" onClose={onClose}>
      <h1 className="group-editor-container__title">Editar Grupo</h1>

      <form className="group-editor-form">
        <fieldset className="group-editor-form__section group-editor-form__general">
          <legend className="group-editor-form__legend">Información General</legend>

          <div className="form__input">
            <label htmlFor="name">Nombre del grupo:</label>
            <input type="text" id="name" name="name" autoComplete="off" autoFocus required />
          </div>
        </fieldset>

        <fieldset className="group-editor-form__section group-editor-form__pricing">
          <legend className="group-editor-form__legend">Matriz de Precios</legend>

          <div className="group-editor-form__header" aria-hidden="true">
            <span>Tamaño</span>
            <span>Unidad</span>
            <span>Precio</span>
          </div>

          <div className="group-editor-form__row">
            <span>4</span>
            <span>Porciones</span>
            <div className="form__input">
              <label htmlFor="price-4">Precio para 4 porciones</label>
              <input type="number" id="price-4" name="price-4" min="0" step="0.01" required />
            </div>
          </div>

          <div className="group-editor-form__row">
            <span>6</span>
            <span>Porciones</span>
            <div className="form__input">
              <label htmlFor="price-6">Precio para 6 porciones</label>
              <input type="number" id="price-6" name="price-6" min="0" step="0.01" required />
            </div>
          </div>

          <div className="group-editor-form__row">
            <span>8</span>
            <span>Porciones</span>
            <div className="form__input">
              <label htmlFor="price-8">Precio para 8 porciones</label>
              <input type="number" id="price-8" name="price-8" min="0" step="0.01" required />
            </div>
          </div>

          <div className="group-editor-form__row">
            <span>10</span>
            <span>Porciones</span>
            <div className="form__input">
              <label htmlFor="price-10">Precio para 10 porciones</label>
              <input type="number" id="price-10" name="price-10" min="0" step="0.01" required />
            </div>
          </div>
        </fieldset>
        <div className="group-editor-form__actions">
          <button className="group-editor-form__button group-editor-form__button--submit" type="submit">Guardar</button>
          <button className="group-editor-form__button group-editor-form__button--cancel" type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </dialog>
  )
}

export default ProductCategoryEditor