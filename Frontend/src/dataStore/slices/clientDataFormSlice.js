import { createSlice } from '@reduxjs/toolkit';


const clientSlice = createSlice({
  name: 'client',
  initialState: {},
  reducers: {
    addClient: (state, action) => {
      return action.payload;
    },
    
  },
});

export const { addClient } = clientSlice.actions;
export default clientSlice.reducer;
