import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    login: false,
    user: null,
    loading: false,
    error: "",
  };

  const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
      loginRequest: (state = initialState, action) => {
        state.loading = true;
        state.error = "";
        state.user = null;
        state.login = false;
      },
      loginSuccess: (state = initialState, { payload }) => {
        state.loading = false;
        state.login = true;
        state.error = "";
        state.user = payload;
        // console.log(state);
      },
      loginFailure: (state = initialState, action) => {
        state.loading = false;
        state.login = false;
        state.user = null;
        state.error = action.payload;
      },
  
      logout: (state = initialState) => {
        state.login = false;
        state.user = null;
        state.error = "";
      },
    },
  });
  
  const { actions, reducer } = loginSlice;
  
  export const { loginSuccess, loginFailure, loginRequest, logout } = actions;
  
  export default reducer;
  