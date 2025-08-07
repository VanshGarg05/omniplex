import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  authState: boolean;
  userDetails: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  };
  subscription: {
    status: string;
    plan: string;
    startDate: any;
  } | null;
}

const initialState: AuthState = {
  authState: false,
  userDetails: {
    uid: "",
    name: "",
    email: "",
    profilePic: "",
  },
  subscription: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
    setUserDetailsState: (
      state,
      action: PayloadAction<{
        uid: string;
        name: string;
        email: string;
        profilePic: string;
      }>
    ) => {
      state.userDetails = action.payload;
    },
    setSubscriptionState: (
      state,
      action: PayloadAction<{
        status: string;
        plan: string;
        startDate: any;
      } | null>
    ) => {
      state.subscription = action.payload;
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

export const { setAuthState, setUserDetailsState, setSubscriptionState, resetAuth } =
  authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth.authState;
export const selectUserDetailsState = (state: RootState) =>
  state.auth.userDetails;
export const selectSubscriptionState = (state: RootState) => 
  state.auth.subscription;
export const selectIsProUser = (state: RootState) => 
  state.auth.subscription?.status === 'active' && state.auth.subscription?.plan === 'pro';

export default authSlice.reducer;
