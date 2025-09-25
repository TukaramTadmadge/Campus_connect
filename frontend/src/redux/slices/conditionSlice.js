import { createSlice } from "@reduxjs/toolkit";

const conditionSlice = createSlice({
  name: "condition",
  initialState: {
    isLoading: false,
    isChatLoading: false,
    isMessageLoading: false,
    isSendLoading: false,
    isProfileDetail: false,
    isHeaderMenu: false,
    isChatDetailsBox: false,
    isUserSearchBox: false,
    isGroupChatBox: false,
    isGroupChatId: "",
    isSocketConnected: false,
    isTyping: false,
    isNotificationBox: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setChatLoading: (state, action) => {
      state.isChatLoading = action.payload;
    },
    setMessageLoading: (state, action) => {
      state.isMessageLoading = action.payload;
    },
    setSendLoading: (state, action) => {
      state.isSendLoading = action.payload;
    },
    setProfileDetail: (state) => {
      state.isProfileDetail = !state.isProfileDetail;
    },
    setHeaderMenu: (state, action) => {
      state.isHeaderMenu = action.payload;
      state.isChatDetailsBox = false;
    },
    setChatDetailsBox: (state, action) => {
      state.isHeaderMenu = false;
      state.isChatDetailsBox = action.payload;
    },
    setUserSearchBox: (state) => {
      state.isUserSearchBox = !state.isUserSearchBox;
    },
    setGroupChatBox: (state) => {
      state.isGroupChatBox = !state.isGroupChatBox;
    },
    setGroupChatId: (state, action) => {
      state.isGroupChatId = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setNotificationBox: (state, action) => {
      state.isNotificationBox = action.payload;
    },
  },
});

export const {
  setLoading,
  setChatLoading,
  setMessageLoading,
  setSendLoading,
  setProfileDetail,
  setHeaderMenu,
  setChatDetailsBox,
  setUserSearchBox,
  setGroupChatBox,
  setGroupChatId,
  setSocketConnected,
  setTyping,
  setNotificationBox,
} = conditionSlice.actions;

export default conditionSlice.reducer;
