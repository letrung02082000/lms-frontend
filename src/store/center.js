import { createSlice } from "@reduxjs/toolkit";

const center = (() => {
    try {
      const raw = localStorage.getItem("center");
      if (raw && raw !== "undefined") {
        return JSON.parse(raw);
      }
    } catch (_) {}
    return {};
  })();
 

export const centerSlice = createSlice({
    name: "center",
    initialState: { data: center || {} },
    reducers: {
        updateCenter: (state, action) => {
            state.data = action.payload;
        },
    }
});

export const {
    updateCenter,
} = centerSlice.actions;
export const selectCenter = (state) => state.center;
export default centerSlice.reducer;
