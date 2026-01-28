import axiosInstance from "../AxiosInstance";

export const therapistApisHandler = (apiType, therapistData) => {
    switch (apiType) {
        case 'add':
            return axiosInstance.post("/therapist/v1/add", therapistData);
        case 'update':
            return axiosInstance.put("/therapist/v1/update", therapistData);
        case 'list':
            return axiosInstance.get("/therapist/v1/list");
        case 'delete':
            return axiosInstance.delete(`/therapist/v1/delete/?therapistId=${therapistData}`);
        default:
            throw new Error('Invalid API type');
    }
}

