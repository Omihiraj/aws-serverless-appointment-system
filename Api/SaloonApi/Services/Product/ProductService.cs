using Amazon.DynamoDBv2.DataModel;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Utility;

namespace SaloonApi.Services.Product;

public class ProductService(IDynamoDBContext context): IProductService
{
    public async Task<BaseResponse> AddProduct(ProductData productData)
    {
        try
        {

            Models.Product product = new()
            {
                Id = UtilityService.GenerateUniqueId(UtilityService.UniqueId.Product),
                ProductName = productData.ProductName,
                ProductCode = productData.ProductCode,
                ProductQuantity = productData.ProductQuantity,
                LastUpdatedDate =   productData.LastUpdatedDate,
            };

            await context.SaveAsync(product);

            return new BaseResponse(true, "Product Added Successfully.✌️", new { Product = product });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Product Added Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> UpdateProductQuantity(UpdateProductQuantityData productData)
    {
        try
        {
            var existingProduct = await context.LoadAsync<Models.Product>(productData.ProductId);

            if (existingProduct == null)
                return new BaseResponse(false, "Can't Found Products.😒", null); 

            existingProduct.ProductQuantity = productData.ProductQuantity;

            await context.SaveAsync(existingProduct);

            return new BaseResponse(true, "Product Quantity Updated Successfully.✌️", new { Product = existingProduct });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Product Quantity Updated Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> GetProducts()
    {
        try
        {
            var products = await context.ScanAsync<Models.Product>(new List<ScanCondition>()).GetRemainingAsync();
            return new BaseResponse(true, "Get Products Successfully.✌️", new { Products = products });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Failed to Get Products.😒", ex.Message);
        }
    }
    public async Task<BaseResponse> DeleteProduct(string productId)
    {
        try
        {
            var existingProduct = await context.LoadAsync<Models.Product>(productId);

            if (existingProduct == null)
                return new BaseResponse(false, "Can't Found Product.😒", null); 

            await context.DeleteAsync(existingProduct);

            return new BaseResponse(true, "Product Deleted Successfully.✌️", null);
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Product Deleted Unsuccessfully.😒", ex.Message);
        }
    }
    
    
}