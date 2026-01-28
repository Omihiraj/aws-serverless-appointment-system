import { createSlice } from '@reduxjs/toolkit';


const productSlice = createSlice({
  name: 'product',
  initialState: {},
  reducers: {
    addProducts: (state, action) => {
      return action.payload;
    },

    updateProducts: (state, action) => {
      state.push(action.payload);
    },
    
  },
});

export const { addProducts, updateProducts } = productSlice.actions;
export default productSlice.reducer;
