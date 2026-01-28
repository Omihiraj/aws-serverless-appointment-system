using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Product;

public interface IProductService
{
    Task<BaseResponse> AddProduct(ProductData productData);
    Task<BaseResponse> UpdateProductQuantity(UpdateProductQuantityData productData);
    Task<BaseResponse> GetProducts();
    Task<BaseResponse> DeleteProduct(string productId);
}