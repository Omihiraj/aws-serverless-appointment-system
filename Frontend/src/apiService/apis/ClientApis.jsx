import axiosInstance from "../AxiosInstance";

export const clientApisHandler = (apiType, clientData) => {
    switch (apiType) {
        
        case 'update':
            return axiosInstance.put("/client/v1/update", clientData);
        case 'list':
            return axiosInstance.get("/client/v1/list");
        case 'appointmentsByClientId':
            return axiosInstance.get(`/appointments/v1/list-by-client-id?clientId=${clientData}`);
        default:
            throw new Error('Invalid API type');
    }
}