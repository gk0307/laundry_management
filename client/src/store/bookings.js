import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "bookings",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    message: "",
  },
  reducers: {
    bookingsRequested: (bookings, action) => {
      bookings.loading = true;
    },

    bookingsReceived: (bookings, action) => {
      bookings.list = action.payload;
      bookings.loading = false;
      bookings.lastFetch = Date.now();
    },

    bookingsRequestFailed: (bookings, action) => {
      bookings.loading = false;
      bookings.message = action.payload;
    },

    bookingUpadte: (bookings, action) => {
      bookings.message = action.message;
      const index = bookings.list.findIndex(
        (book) => book._id === action.payload._id
      );
      bookings.list[index].bookingStatus = action.payload.bookingStatus;
      bookings.list[index].rejectReason = action.payload.rejectReason;
      bookings.loading = false;
    },
  },
});

const {
  bookingsRequested,
  bookingsReceived,
  bookingsRequestFailed,
  bookingUpadte,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/booking";

export const loadBookings = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bookings;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url: url + "/info",
      onStart: bookingsRequested.type,
      onSuccess: bookingsReceived.type,
      onError: bookingsRequestFailed.type,
    })
  );
};

export const updateBooking = (data) =>
  apiCallBegan({
    url: url + "/update",
    method: "put",
    data,
    onStart: bookingsRequested.type,
    onSuccess: bookingUpadte.type,
    onError: bookingsRequestFailed.type,
  });
