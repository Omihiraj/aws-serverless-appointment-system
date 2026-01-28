using Amazon.DynamoDBv2.DataModel;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Models;
using SaloonApi.Services.Utility;

namespace SaloonApi.Services.Therapist;

public class TherapistService(IDynamoDBContext context):ITherapistService
{
    public async Task<BaseResponse> AddTherapist(TherapistData therapistData)
    {
        try
        {

            Models.Therapist therapist = new()
            {
                Id = UtilityService.GenerateUniqueId(UtilityService.UniqueId.Therapist),
                TherapistName = therapistData.TherapistName,
                TherapistMobile = therapistData.TherapistMobile,
                AssignedTreatments = therapistData.AssignedTreatments
                    .Select(treatment => new TherapistTreatmentData
                    {
                        TreatmentId = treatment.TreatmentId,
                        TreatmentName = treatment.TreatmentName
                    })
                    .ToList()
            };

            await context.SaveAsync(therapist);

            return new BaseResponse(true, "Therapist Added Successfully.✌️", new { Therapist = therapist });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Therapist Added Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> GetTherapists()
    {
        try
        {
            var therapists = await context.ScanAsync<Models.Therapist>(new List<ScanCondition>()).GetRemainingAsync();
            return new BaseResponse(true, "Get Therapists Successfully.✌️", new { Therapists = therapists });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Failed to Get Therapists.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> UpdateTherapist(TherapistData therapistData)
    {
        try
        {
            var existingTherapist = await context.LoadAsync<Models.Therapist>(therapistData.TherapistId);

            if (existingTherapist == null)
                return new BaseResponse(false, "Can't Found Therapists.😒", null); 

            
            var isEqualTreatments = 
                existingTherapist.AssignedTreatments != null && existingTherapist.AssignedTreatments.Select(
                        p => new { p.TreatmentId }).
                    OrderBy(o=>o.TreatmentId).
                    SequenceEqual(
                        therapistData.AssignedTreatments.
                            Select(
                                p=>new{ p.TreatmentId }).
                            OrderBy(o=>o.TreatmentId)!
                    );
          
            if (!isEqualTreatments)
            {
                existingTherapist.AssignedTreatments = therapistData.AssignedTreatments
                    .Select(treatment => new TherapistTreatmentData
                    {
                        TreatmentId = treatment.TreatmentId,
                        TreatmentName = treatment.TreatmentName
                    })
                    .ToList();
            }

            if (existingTherapist.TherapistName != therapistData.TherapistName)
            {
                existingTherapist.TherapistName = therapistData.TherapistName;
            }

            if (existingTherapist.TherapistMobile != therapistData.TherapistMobile)
            {
                existingTherapist.TherapistMobile = therapistData.TherapistMobile;
            }

 
            await context.SaveAsync(existingTherapist);

            return new BaseResponse(true, "Therapist Updated Successfully.✌️", new { Treatment = existingTherapist });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Therapist Updated Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> DeleteTherapist(string therapistId)
    {
        try
        {
            var existingTherapist = await context.LoadAsync<Models.Therapist>(therapistId);

            if (existingTherapist == null)
                return new BaseResponse(false, "Can't Found Therapists.😒", null); 

            await context.DeleteAsync(existingTherapist);

            return new BaseResponse(true, "Therapist Deleted Successfully.✌️", null);
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Therapist Deleted Unsuccessfully.😒", ex.Message);
        }
    }
}