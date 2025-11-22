import { getCotizacionesByServiceApi } from "../../cotizaciones/api/cotizacionesApi.js";
import { sortQuotes } from "../../../core/logic/sortQuotes.js";

function simulateDelay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function compararCotizacionesApi(serviceId, criterio) {
  await simulateDelay();

  const cotizaciones = await getCotizacionesByServiceApi(serviceId);
  return sortQuotes(cotizaciones, criterio);
}
