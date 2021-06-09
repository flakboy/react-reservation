const seatsReducer = (
    state = { seats: [], width: 0, height: 0 },
    action
) => {
    switch (action.type) {
        case "FETCH_SEATS_SUCCESS":
            return {
                // ...state,
                seats: action.payload.seats,
                width: action.payload.width,
                height: action.payload.height,
            }

        default:
            return state
    }
}

export default seatsReducer;