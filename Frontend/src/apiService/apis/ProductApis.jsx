
import axiosInstance from "../AxiosInstance";

export const productApisHandler = (apiType, productData) => {
    switch (apiType) {
        case 'add':
            return axiosInstance.post("/product/v1/add", productData);
        case 'updateQuantity':
            return axiosInstance.put("/product/v1/update-quantity", productData);
        case 'list':
            return axiosInstance.get("/product/v1/list");
        case 'delete':
            return axiosInstance.delete(`/product/v1/delete-product?productId=${productData}`);
        default:
            throw new Error('Invalid API type');
    }
}

