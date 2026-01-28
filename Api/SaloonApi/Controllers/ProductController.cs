using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Services.Product;

namespace SaloonApi.Controllers
{
    [Route("api/product/v1")]
    [ApiController]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpPost("add")]
        
        public async Task<IActionResult> AddProduct(ProductData productData)
        {
            var productBaseResponse =  await productService.AddProduct(productData);

            return productBaseResponse.IsSuccess ? Ok(productBaseResponse) : StatusCode(500, productBaseResponse);
        }
        
        [HttpPut("update-quantity")]
        
        public async Task<IActionResult> UpdateQuantity(UpdateProductQuantityData productData)
        {
            var productBaseResponse =  await productService.UpdateProductQuantity(productData);

            return productBaseResponse.IsSuccess ? Ok(productBaseResponse) : StatusCode(500, productBaseResponse);
        }
        
        [HttpGet("list")]
        
        public async Task<IActionResult> GetProducts()
        {
            var productBaseResponse =  await productService.GetProducts();

            return productBaseResponse.IsSuccess ? Ok(productBaseResponse) : StatusCode(500, productBaseResponse);
        }
        
        [HttpDelete("delete-product")]
        
        public async Task<IActionResult> DeleteProduct(string productId)
        {
            var productBaseResponse =  await productService.DeleteProduct(productId);

            return productBaseResponse.IsSuccess ? Ok(productBaseResponse) : StatusCode(500, productBaseResponse);
        }
    }
}
