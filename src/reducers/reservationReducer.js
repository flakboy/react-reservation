const reservationReducer = (
    state = {
        reservedSeats: [],
        amount: 0,
        neighboring: false
    },
    action
) => {
    switch (action.type) {
        case "reservations/saveReservation":
            return {
                ...state,
                reservedSeats: action.payload
            }
        case "reservations/saveOptions":
            console.log(action)
            return {
                ...state,
                amount: action.payload.amount,
                neighboring: action.payload.neighboring
            }
        default:
            return state;
    }
}

export default reservationReducer;