import { createSlice } from '@reduxjs/toolkit';


const treatmentSlice = createSlice({
  name: 'treatment',
  initialState: {},
  reducers: {
    addTreatments: (state, action) => {
      return action.payload;
    },

    updateTreatments: (state, action) => {
      state.push(action.payload);
    },
    
  },
});

export const { addTreatments, updateTreatments } = treatmentSlice.actions;
export default treatmentSlice.reducer;
