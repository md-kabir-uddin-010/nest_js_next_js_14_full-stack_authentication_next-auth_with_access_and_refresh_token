import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  accessToken: undefined | null | string;
  refreshToken: undefined | null | string;
  userInfo: object | undefined;
}

interface LoginPayload {
  accessToken: undefined | null | string;
  refreshToken: undefined | null | string;
  userInfo: object | undefined | any;
}

const initialState: InitialState = {
  accessToken: undefined,
  refreshToken: undefined,
  userInfo: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<LoginPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userInfo = action.payload.userInfo;
    },
    userLogout: (state) => {
      localStorage.clear();
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.userInfo = undefined;
    },
  },
});

export const { userLogin, userLogout } = authSlice.actions;
export default authSlice.reducer;
