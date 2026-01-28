import axiosInstance from "../AxiosInstance";

export const userApisHandler = (apiType, therapistData) => {
    switch (apiType) {
        case 'add':
            return axiosInstance.post("/user/v1/add", therapistData);
        case 'update':
            return axiosInstance.put("/user/v1/update", therapistData);
        case 'list':
            return axiosInstance.get("/user/v1/list");
        case 'delete':
            return axiosInstance.delete(`/user/v1/delete?email=${therapistData.email}&userId=${therapistData.id}`);
        default:
            throw new Error('Invalid API type');
    }
}

