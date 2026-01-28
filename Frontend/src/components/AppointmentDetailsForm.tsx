import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createAppoinment } from "../apiService/apis/AppointmentApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { updateAppointments } from "../dataStore/slices/appointmentSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface AppointmentFormData {
  appointmentNumber: string;
  treatmentType: string;
  date: string;
  time: string;
  therapist: string;
}
interface AppointmentDetailsFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onBack: () => void;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  onSubmit,
  onBack,
}) => {
  const client = useSelector((state) => state.client);
  const therapists = useSelector((state) => state.therapist);
  const treatments = useSelector((state) => state.treatment);

  const [selectDateTime, setSelectDateTime] = useState("");
  const [selectFirstDate, setSelectDate] = useState("");

  const treatmentOptions = treatments.map((treatment) => ({
    value: treatment.id,
    label: treatment.treatmentName,
    price: treatment.treatmentAmount,
    duration: treatment.treatmentDuration,
  }));
  const therapistOptions = therapists.map((therapist) => ({
    value: therapist.id,
    label: therapist.therapistName,
  }));

  console.log("THERAPIST OPTIONS", therapistOptions);
  console.log("TREATMENT OPTIONS", treatmentOptions);

  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    appointmentNumber: `APT-${Date.now().toString().slice(-6)}`,
    treatmentType: "",
    date: "",
    time: "",
    therapist: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("Target Value", e.target.name);
    if(multipleTreatments.length > 0) {
      setTreatments([]);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("TESTING DATE", `${e.target.value}`);
    if(name==="date"){
      setSelectDate(`${e.target.value}`);
    }
    if(name==="time"){
      setSelectDateTime(`${e.target.value}`);
    }
    console.log(
      "Hours",
      formData.time.split(":")[0],
      " Minutes",
      formData.time.split(":")[1]
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    console.log("TESTING DATE 2", `${formData.date}T${formData.time}`);
    e.preventDefault();
    const appointmentFormData = {
      appointmentId: "",
      appointmentStatus: "PENDING",
      clientId: client.id,
      clientName: client.name,
      clientBirthDay: client.dob,
      medicalHistory: client.medicalHistory,
      mobileNumber: client.mobile,
      appointmentTreatmentData: multipleTreatments.map((item)=>({
        treatmentId:  treatments.find(
        (treatment) => treatment.treatmentName === item.treatmentType
      )?.id,
        treatmentType:item.treatmentType,
        assignedTherapist:item.therapist,
        treatmentStartTime:item.startTime.toISOString(),
      })),
      // treatmentType: formData.treatmentType,
      // treatmentId: treatments.find(
      //   (treatment) => treatment.treatmentName === formData.treatmentType
      // )?.id,
      // assignedTherapist: formData.therapist,
      // appointmentDateTime: new Date(
      //   `${formData.date}T${formData.time}`
      // ).toISOString(),


    };

    console.log("APPOINTMENT FORM DATA SUBMIT : ", appointmentFormData);
    setLoading(true);
    createAppoinment(appointmentFormData)
      .then((res) => {
        setLoading(false);
        //dispatch(updateAppointments(res.data.data.appointment));
        toast.success("Appointment Created Successfully");
        res.data.data.appointment.appointmentTreatmentData.forEach((appointment)=>{

          dispatch(updateAppointments({
            id: res.data.data.appointment.id,
            clientId: res.data.data.appointment.clientId,
            clientName: res.data.data.appointment.clientName,
            appointmentStatus: res.data.data.appointment.appointmentStatus,
            assignedTherapist: appointment.assignedTherapist,
            treatmentType: appointment.treatmentType,
            appointmentDateTime: appointment.treatmentStartTime,
          }));
        });
        onSubmit(formData);
        console.log("APPOINTMENT API CALLED : ", res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Failed to Create Appointment");
        console.error("Failed APPOINTMENT API CALLED", err);
      });
  };

  //////////
  const treatmentMultipleOptions = treatments.map((treatment) => ({
    value: treatment.id,
    label: treatment.treatmentName,
    price: treatment.treatmentAmount,
    duration: treatment.treatmentDuration,
  }));
  // Alternative names: doctorOptions, practitionerOptions, availableTherapists
  const therapistMultipleOptions = therapists.map((therapist) => ({
    value: therapist.id,
    label: therapist.therapistName,
  }));
  // State for the form inputs
  // Alternative names: inputData, selectionData, userSelections
  const [formMultipleData, setMultipleFormData] = useState({
    treatmentType: "",
    therapist: "", // Alternative: doctor, practitioner
  });
  // State for the list of added treatments
  // Alternative names: selectedTreatments, treatmentList, appointmentList
  const [multipleTreatments, setTreatments] = useState([]);
  // Handle form input changes
  // Alternative names: updateFormData, onInputChange, handleFieldChange
  const handleMultipleInputChange = (e) => {
    const { name, value } = e.target;
    setMultipleFormData({
      ...formMultipleData,
      [name]: value,
    });
  };
  // Calculate the start time for a new treatment
  // Alternative names: computeStartTime, getNextAvailableTime, scheduleStartTime
  const calculateStartTime = (existingTreatments) => {
    if (existingTreatments.length === 0) {
      // First treatment starts at 8:00 AM

      const [y, m, d] = selectFirstDate.split("-");
     
      const startTime = new Date(y, m - 1, d);
      startTime.setHours(
        Number(selectDateTime.split(":")[0]),
        Number(selectDateTime.split(":")[1]),
        0,
        0
      );

      console.log("StartTIME TEST",startTime);
      console.log("SELECT DATE TIME",selectDateTime); 
      return startTime;
    }
    // Get the last treatment
    const lastTreatment = existingTreatments[existingTreatments.length - 1];
    const lastTreatmentOption = treatmentMultipleOptions.find(
      (option) => option.label === lastTreatment.treatmentType
    );
    // Calculate when the last treatment ends
    const lastTreatmentEndTime = new Date(new Date(lastTreatment.startTime).getTime()+lastTreatmentOption?.duration*60000);
    // lastTreatmentEndTime.setMinutes(
    //   lastTreatmentEndTime.getMinutes() + (lastTreatmentOption?.duration || 60)
    // );
    console.log("StartTime :", lastTreatment.startTime,"End Time :",lastTreatmentEndTime.toLocaleString("en-US", { timeZone: "Asia/Colombo" }),"Get Minutes :",lastTreatmentEndTime.getMinutes(),"Duration :",lastTreatmentOption?.duration);
    return lastTreatmentEndTime;
  };
  // Format time to display in the UI
  // Alternative names: getTimeString, convertTimeToString, formatTimeDisplay
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Add treatment to the list
  // Alternative names: addNewTreatment, createTreatment, saveTreatment
  const handleAddTreatment = () => {
    if (selectDateTime === "") {
      alert("Please select DATE & TIME first!");
      return;
    }
    if (!formMultipleData.treatmentType || !formMultipleData.therapist) return;
    // Alternative names: chosenTreatment, currentTreatment
    const selectedTreatment = treatmentMultipleOptions.find(
      (option) => option.label === formMultipleData.treatmentType
    );
    if (selectedTreatment) {
      // Calculate start time based on existing treatments
      const startTime = calculateStartTime(multipleTreatments);
      // Alternative names: treatmentEntry, appointmentItem
      const newTreatment = {
        id: Date.now(),
        treatmentType: formMultipleData.treatmentType,
        therapist: formMultipleData.therapist,
        price: selectedTreatment.price,
        startTime: startTime,
        duration: selectedTreatment.duration,
      };
      setTreatments([...multipleTreatments, newTreatment]);
      // Reset form
      setMultipleFormData({
        treatmentType: "",
        therapist: "",
      });
    }
  };
  // Remove treatment from the list
  // Alternative names: deleteTreatment, cancelTreatment, removeTreatmentItem
  const handleRemoveTreatment = (id) => {
    // Find the index of the treatment to remove
    const index = multipleTreatments.findIndex(
      (treatment) => treatment.id === id
    );
    if (index === -1) return;
    // Get all treatments that come after the removed one
    const affectedTreatments = multipleTreatments.slice(index + 1);
    const updatedTreatments = multipleTreatments.slice(0, index);
    // Recalculate start times for all subsequent treatments
    let lastEndTime =
      index > 0 ? new Date(multipleTreatments[index - 1].startTime) : null;
    if (lastEndTime && index > 0) {
      const lastTreatmentOption = treatmentMultipleOptions.find(
        (option) => option.label === multipleTreatments[index - 1].treatmentType
      );
      // lastEndTime.setMinutes(
      //   lastEndTime.getMinutes() + (lastTreatmentOption?.duration || 60)
      // );
      lastEndTime = new Date(new Date(lastEndTime).getTime()+lastTreatmentOption?.duration * 60000);
    }
    // Update start times for all subsequent treatments
    affectedTreatments.forEach((treatment) => {
      const startTime = lastEndTime || calculateStartTime([]);
      const treatmentOption = treatmentMultipleOptions.find(
        (option) => option.label === treatment.treatmentType
      );
      updatedTreatments.push({
        ...treatment,
        startTime,
      });
      lastEndTime = new Date(new Date(startTime).getTime()+treatmentOption?.duration * 60000);

      
      // lastEndTime.setMinutes(
      //   lastEndTime.getMinutes() + (treatmentOption?.duration || 60)
      // );
    });
    setTreatments(updatedTreatments);
  };
  // Calculate total price
  // Alternative names: sumPrice, treatmentsCost, appointmentTotal
  const totalPrice = multipleTreatments.reduce(
    (sum, treatment) => sum + treatment.price,
    // sum alternative: accumulator, total
    0
  );

  //////////

  return (
    <form onSubmit={handleSubmit}>
      {isLoading == true ? <LoadingPopup /> : <></>}
<div className="max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      {
        <div className="max-w-4xl mx-auto mt-8  bg-white min-h-full">
          <p className="text-lg font-semibold mb-6">Treatment Selection</p>
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="treatmentType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Treatment Type
                </label>
                <select
                  id="treatmentType"
                  name="treatmentType"
                  value={formMultipleData.treatmentType}
                  onChange={handleMultipleInputChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  
                >
                  <option value="">Select Treatment</option>
                  {treatmentMultipleOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label} ({option.duration} min)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="therapist"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assigned Therapist
                </label>
                <select
                  id="therapist"
                  name="therapist"
                  value={formMultipleData.therapist}
                  onChange={handleMultipleInputChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  
                >
                  <option value="">Select Therapist</option>
                  {therapistMultipleOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-700 sm:text-sm">
                  <span className="mr-1">LKR</span>
                  {formMultipleData.treatmentType
                    ? treatmentMultipleOptions.find(
                        (option) =>
                          option.label === formMultipleData.treatmentType
                      )?.price || 0
                    : 0}
                </div>
              </div>
            </div>
            <button
              onClick={handleAddTreatment}
              disabled={
                !formMultipleData.treatmentType || !formMultipleData.therapist
              }
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              Add Treatment
            </button>
          </div>
          {multipleTreatments.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">
                Selected Treatments
              </h4>
              <div className="border rounded-md overflow-hidden mb-4">
                <div className="max-h-56 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Treatment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Start Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Therapist
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {multipleTreatments.map((treatment) => (
                      <tr key={treatment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {treatment.treatmentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(new Date(treatment.startTime))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {treatment.therapist}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="mr-1">LKR</span>
                          {treatment.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveTreatment(treatment.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-right font-medium"
                      >
                        Total:
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        <span className="mr-1">LKR</span>
                        {totalPrice.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 3
})}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
                </div>
              </div>
            </div>
          )}
        </div>
      }

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Appointment
        </button>
      </div>
      </div>
    </form>
  );
};
export default AppointmentDetailsForm;
