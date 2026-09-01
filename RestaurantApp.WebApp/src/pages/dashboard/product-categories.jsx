function ProductCategories() {
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
          <tr>
            <td>Experiencia inolvidable</td>
            <td>Bs. 32,00 (4 porciones), Bs. 55,00 (6 porciones), Bs. 65,00 (8 porciones), Bs. 80,00 (10 porciones)</td>
            <td className="dashboard-section__actions">
              <button className="dashboard-section__edit">Editar</button>
              <button className="dashboard-section__delete">Borrar</button>
            </td>
          </tr>
          <tr>
            <td>Sabores que inspiran</td>
            <td>Bs. 30,00 (4 porciones), Bs. 50,00 (6 porciones), Bs. 60,00 (8 porciones), Bs. 75,00 (10 porciones)</td>
            <td className="dashboard-section__actions">
              <button className="dashboard-section__edit">Editar</button>
              <button className="dashboard-section__delete">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default ProductCategories
