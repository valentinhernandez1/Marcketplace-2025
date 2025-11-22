export function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };


    case "LOGOUT":
      localStorage.removeItem("user");
      return { ...state, currentUser: null };

    case "ADD_SERVICE":
      return { ...state, services: [...state.services, action.payload] };

    case "SELECT_QUOTE":
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.serviceId
            ? {
                ...s,
                estado: "ASIGNADO",
                cotizacionSeleccionadaId: action.payload.quoteId,
              }
            : s
        ),
      };

    case "ADD_QUOTE":
      return { ...state, quotes: [...state.quotes, action.payload] };

    case "ADD_SUPPLY_OFFER":
      return {
        ...state,
        supplyOffers: [...state.supplyOffers, action.payload],
      };
    case "SET_SERVICES":
      return { ...state, services: action.payload };

    case "SET_QUOTES":
      return { ...state, quotes: action.payload };
    
    case "SET_SUPPLIES":
      return { ...state, supplies: action.payload };
    case "ADD_SUPPLY":
      return { ...state, supplies: [...state.supplies, action.payload] };
    case "SET_SUPPLY_OFFERS":
      return { ...state, supplyOffers: action.payload };

    default:
      return state;
  }
}
