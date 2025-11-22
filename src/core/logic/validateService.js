export function validateService(servicio) {
  const errores = [];

  if (!servicio.titulo || servicio.titulo.trim().length < 3)
    errores.push("El título es muy corto.");

  if (!servicio.descripcion || servicio.descripcion.trim().length < 10)
    errores.push("La descripción es muy corta.");

  if (!servicio.categoria)
    errores.push("La categoría es obligatoria.");

  if (!servicio.fechaPreferida)
    errores.push("La fecha es obligatoria.");

  return errores;
}
