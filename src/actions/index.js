export const saveReservation = data => {
    return {
        type: "reservations/saveReservation",
        payload: data
    }
}

export const saveOptions = data => {
    return {
        type: "reservations/saveOptions",
        payload: data
    }
}