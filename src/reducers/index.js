// import seatsReducer from "./seatsReducer";
import reservationReducer from "./reservationReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    reservations: reservationReducer
})

export default rootReducer;