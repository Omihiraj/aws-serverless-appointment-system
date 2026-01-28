using Amazon.DynamoDBv2.DataModel;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Models;
using SaloonApi.Services.Utility;

namespace SaloonApi.Services.Treatment;

public class TreatmentService(IDynamoDBContext context) : ITreatmentService
{
    public async Task<BaseResponse> AddTreatment(TreatmentData treatmentData)
    {
        try
        {

            Models.Treatment treatment = new()
            {
                Id = UtilityService.GenerateUniqueId(UtilityService.UniqueId.Treatment),
                TreatmentName = treatmentData.TreatmentName,
                TreatmentDuration = treatmentData.TreatmentDuration,
                TreatmentAmount = treatmentData.Amount,
                Products = treatmentData.Products
                    .Select(product => new TreatmentProduct
                    {
                        ProductId = product.ProductId,
                        ProductName = product.ProductName
                    })
                    .ToList()
            };

            await context.SaveAsync(treatment);

            return new BaseResponse(true, "Treatment Added Successfully.✌️", new { Treatment = treatment });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Treatment Added Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> GetTreatments()
    {
        try
        {
            var treatmentQueryConfig = new DynamoDBOperationConfig
            {
                IndexName = "SaloonIndex" // Use GSI
            };

            var treatments = await context.QueryAsync<Models.Treatment>("ALL", treatmentQueryConfig).GetRemainingAsync();
            
            return new BaseResponse(true, "Get Treatments Successfully.✌️", new { Treatments = treatments });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Failed to Get Treatments.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> UpdateTreatment(TreatmentData treatmentData)
    {
        try
        {
            var existingTreatment = await context.LoadAsync<Models.Treatment>(treatmentData.TreatmentId);

            if (existingTreatment == null)
                return new BaseResponse(false, "Can't Found Treatments.😒", null); 

          
            var isEqualProducts = 
                existingTreatment.Products != null && existingTreatment.Products.Select(
                        p => new { p.ProductId }).
                    OrderBy(o=>o.ProductId).
                    SequenceEqual(
                        treatmentData.Products.
                            Select(
                                p=>new{ p.ProductId }).
                            OrderBy(o=>o.ProductId)!
                    );
            
            
            if (!isEqualProducts)
            {
                existingTreatment.Products = treatmentData.Products
                    .Select(product => new TreatmentProduct
                    {
                        ProductId = product.ProductId,
                        ProductName = product.ProductName
                    })
                    .ToList();
            }

            if (existingTreatment.TreatmentName != treatmentData.TreatmentName)
            {
                existingTreatment.TreatmentName = treatmentData.TreatmentName;
            }

            if (existingTreatment.TreatmentDuration != treatmentData.TreatmentDuration)
            {
                existingTreatment.TreatmentDuration = treatmentData.TreatmentDuration;
            }

            if (Math.Round(existingTreatment.TreatmentAmount, 2) != Math.Round(treatmentData.Amount, 2))
            {
                existingTreatment.TreatmentAmount = treatmentData.Amount;
            }

          
            await context.SaveAsync(existingTreatment);

            return new BaseResponse(true, "Treatment Updated Successfully.✌️", new { Treatment = existingTreatment });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Treatment Updated Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> DeleteTreatment(string treatmentId)
    {
        try
        {
            var existingTreatment = await context.LoadAsync<Models.Treatment>(treatmentId);

            if (existingTreatment == null)
                return new BaseResponse(false, "Can't Found Treatments.😒", null); 

            await context.DeleteAsync(existingTreatment);

            return new BaseResponse(true, "Treatment Deleted Successfully.✌️", null);
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Treatment Deleted Unsuccessfully.😒", ex.Message);
        }
    }
}