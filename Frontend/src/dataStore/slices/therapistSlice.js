import { createSlice } from '@reduxjs/toolkit';


const therapistSlice = createSlice({
  name: 'therapist',
  initialState: {},
  reducers: {
    addTherapists: (state, action) => {
      return action.payload;
    },
    
  },
});

export const { addTherapists} = therapistSlice.actions;
export default therapistSlice.reducer;
