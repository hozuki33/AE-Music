import { createSlice } from "@reduxjs/toolkit"; 
export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    changeValueAction: (state, action) => {
      state.value = action.payload
    }
  }
})
export const { changeValueAction } = counterSlice.actions
export default counterSlice.reducer