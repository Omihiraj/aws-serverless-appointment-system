import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {},
  reducers: {
    addAppointments: (state, action) => {
      return action.payload;
    },
    updateAppointments: (state, action) => {
      state.push(action.payload);
    },

    updateAppointmentStatus: (state, action) => {
      console.log("APPOINTMENT SLICE 1 ", state);
      console.log("APPOINTMENT SLICE 2 ", action.payload);

      const { id, status } = action.payload;

      const appointment = state.find((ap) => ap.id === id);
      if (appointment) {
        appointment.status = status;
      }
    },
  },
});

export const { addAppointments, updateAppointments, updateAppointmentStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;
