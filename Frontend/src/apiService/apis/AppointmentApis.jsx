import axiosInstance from "../AxiosInstance";

export const createAppoinment = (appointmentData) => {
    return axiosInstance.post("/appointments/v1/create", appointmentData);
};
export const updateAppointment = (appointmentData) => {
    return axiosInstance.put("/appointments/v1/update", appointmentData);
};
export const getAppointmentsByDate = (appointmentDate) => {
  const date = encodeURIComponent(appointmentDate);
  console.log("getAppointmentsByDate 1", appointmentDate);
  console.log("getAppointmentsByDate", date);
  return axiosInstance.get(
    `/dashboard/v1/list?date=${date}`
  );
};
export const deleteAppoinment = (appointmentId) => {
    return axiosInstance.delete(`/appointments/v1/delete?appointmentId=${appointmentId}`);
};
