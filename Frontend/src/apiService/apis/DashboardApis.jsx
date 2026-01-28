import axiosInstance from "../AxiosInstance";

export const getDashboardData = (appointmentDate) => {
  const date = encodeURIComponent(appointmentDate);
  console.log("getDashboardData 1", appointmentDate);
  console.log("getDashboardData", date);
  return axiosInstance.get(
    `/dashboard/v1/list?date=${date}`
  );
};

export const getInitialDashboardData = () => {

  return axiosInstance.get(
    `/dashboard/v1/initial-data`
  );
};
