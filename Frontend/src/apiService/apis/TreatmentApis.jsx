import axiosInstance from "../AxiosInstance";

export const treatmentApisHandler = (apiType, treatmetData) => {
    switch (apiType) {
        case 'add':
            return axiosInstance.post("/treatment/v1/add", treatmetData);
        case 'update':
            return axiosInstance.put("/treatment/v1/update", treatmetData);
        case 'list':
            return axiosInstance.get("/treatment/v1/list");
        case 'delete':
            return axiosInstance.delete(`/treatment/v1/delete/?treatmentId=${treatmetData}`);
        default:
            throw new Error('Invalid API type');
    }
}

