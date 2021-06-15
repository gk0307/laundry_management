import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "service",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    message:""
  },
  reducers: {
    serviceRequested: (service, action) => {
      service.loading = true;
    },

    serviceReceived: (service, action) => {
      service.list = action.payload;
      service.loading = false;
      service.lastFetch = Date.now();
    },

    serviceRequestFailed: (service, action) => {
      service.loading = false;
      service.message=action.payload;
    },
  }
});

export const {
    serviceRequested,
    serviceReceived,
    serviceRequestFailed,
    // serviceUpadte
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "services/";

export const loadservice = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.service;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url:url+"user/service",
      onStart: serviceRequested.type,
      onSuccess: serviceReceived.type,
      onError: serviceRequestFailed.type
    })
  );
};

// export const updateUser = user => 
// apiCallBegan({
//   url:url+"/update",
//   method:"put",
//   data: user,
//   onSuccess:userUpadte.type,
//   onStart: userRequested.type,
//   onError: userRequestFailed.type
// })

