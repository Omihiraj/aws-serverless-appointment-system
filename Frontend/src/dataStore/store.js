import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import therapistReducer from './slices/therapistSlice';
import treatmentReducer from './slices/treatmentSlice';
import appointmentReducer from './slices/appointmentSlice';
import clientFormReducer from './slices/clientDataFormSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    therapist: therapistReducer,
    treatment: treatmentReducer,
    appointment: appointmentReducer,
    client: clientFormReducer,
  },
});
