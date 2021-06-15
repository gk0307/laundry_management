import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    message: "",
  },
  reducers: {
    userRequested: (users, action) => {
      users.loading = true;
    },

    userReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.lastFetch = Date.now();
    },

    userRequestFailed: (users, action) => {
      users.loading = false;
      users.message = action.payload;
    },

    userUpadte: (users, action) => {
      users.message = action.message;
      users.list = action.payload;
      users.loading = false;
    },
  },
});

export const {
  userRequested,
  userReceived,
  userRequestFailed,
  userUpadte,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/user";

export const loadUser = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.user;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: userRequested.type,
      onSuccess: userReceived.type,
      onError: userRequestFailed.type,
    })
  );
};

export const updateUser = (user) =>
  apiCallBegan({
    url: url + "/update",
    method: "put",
    data: user,
    onSuccess: userUpadte.type,
    onStart: userRequested.type,
    onError: userRequestFailed.type,
  });
