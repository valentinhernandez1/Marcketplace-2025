export function filterServices(services, filtros = {}) {
  if (!Array.isArray(services)) return [];

  return services.filter((s) => {
    if (filtros.solicitanteId && s.solicitanteId !== filtros.solicitanteId)
      return false;

    if (filtros.estado && s.estado !== filtros.estado)
      return false;

    if (filtros.categoria && s.categoria !== filtros.categoria)
      return false;

    return true;
  });
}
