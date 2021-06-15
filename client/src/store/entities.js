import { combineReducers } from "redux";
import userReducer from "./users";
import bookingsReducer from  "./bookings";
import serviceReducer from './service';
export default combineReducers({
  user: userReducer,
  bookings:bookingsReducer,
  service:serviceReducer
});
