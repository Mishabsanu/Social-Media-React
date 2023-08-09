import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  posts: [],
};

export const userSlise = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      state.user = action.payload;
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
  },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setSearchKey: (state, action) => {
      state.searchKey = action.payload.searchKey;
    },
    setNotFollowingUsers: (state, action) => {
      state.notFollowingUsers = action.payload.notFollowingUsers;
    },
    setFollowers: (state, action) => {
      state.followers = action.payload.followers;
    },
    setFollowings: (state, action) => {
      state.followings = action.payload.followings;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setPosts,
  setSearchKey,
  setNotFollowingUsers,
  setFollowers,
  setFollowings,
  setUser,

} = userSlise.actions;



export default userSlise.reducer;
