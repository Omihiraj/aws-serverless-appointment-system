import React, { useState, useEffect } from "react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment, AppointmentStatus } from "../types/appointment";
import AppointmentDetailsModal from "./appointments/AppointmentDetailsModal";
import BillingModal from "./appointments/BillingModal";
import { useSelector } from "react-redux";
import { getDashboardData } from "../apiService/apis/dashboardApis";
import { updateAppointment } from "../apiService/apis/AppointmentApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { updateAppointmentStatus } from "../dataStore/slices/appointmentSlice";
import { addAppointments } from "../dataStore/slices/appointmentSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const HOURS = Array.from(
  {
    length: 12,
  },
  (_, i) => i + 8
); // 8 AM to 7 PM

// const HOURS = Array.from({ length: 24 }, (_, i) => {
//   const hour = 8 + Math.floor(i / 2);   // starting from 8
//   const minutes = i % 2 === 0 ? "00" : "30";
//   return `${hour}:${minutes}`;
// });

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
}
const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onUpdateAppointment,
}) => {
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
 
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
 
  const therapists = useSelector((state) => state.therapist);
  const savedTreatmnets = useSelector((state) => state.treatment);
  const loadedAppointments = useSelector((state) => state.appointment);
  const THERAPISTS = therapists.map((therapist) => therapist.therapistName);



  const colorList = [
    "#FF6B6B",
    "#FF8C6B",
    "#FF9F80",
    "#FFB380",
    "#FFD580",

    "#FFB6C1",
    "#FF99B3",
    "#FF80A6",
    "#FF6699",
    "#FF4D8C",
    "#FF3380",
    "#FF1A73",
    "#FF99FF",
    "#FF80FF",
    "#FF66FF",
    "#FF4DFF",
    "#FF33FF",
    "#E066FF",
    "#CC33FF",
    "#BA55D3",
    "#9932CC",
    "#8A2BE2",
    "#7B68EE",
    "#6A5ACD",
    "#836FFF",
    "#6495ED",
    "#87CEEB",
    "#87CEFA",
    "#00BFFF",
    "#1E90FF",
    "#4169E1",
    "#4682B4",
    "#5F9EA0",
    "#00CED1",
    "#20B2AA",
    "#48D1CC",
    "#40E0D0",
    "#00FA9A",
    "#00FF7F",
    "#3CB371",
    "#2E8B57",
    "#66CDAA",
    "#8FBC8F",

    "#32CD32",

    "#00FF7F",
    "#98FB98",
    "#90EE90",
    "#8FBC8F",
    "#B0E57C",
    "#C1E1A6",

    "#FFC300",
    "#FFA500",
    "#FF8C00",
    "#FF7F50",
    "#FF6347",
    "#FF4500",
    "#DC143C",
    "#FF1493",
    "#FF69B4",
    "#FFB6C1",
    "#DB7093",
    "#C71585",
    "#DDA0DD",
    "#EE82EE",
    "#DA70D6",
    "#BA55D3",
    "#9932CC",
    "#8B008B",
    "#800080",
    "#9370DB",
    "#7B68EE",
    "#6A5ACD",
    "#483D8B",
    "#4169E1",
    "#4682B4",
    "#5F9EA0",
    "#00CED1",
    "#20B2AA",
    "#48D1CC",
    "#40E0D0",
    "#00FA9A",
    "#00FF7F",
    "#3CB371",
    "#2E8B57",
    "#66CDAA",
    "#8FBC8F",
    "#ADFF2F",
    "#7FFF00",
    "#32CD32",
    "#00FF00",
  ];

  const statusBorderColors = {
    "checked-in": "#301abcff", // Teal
    pending: "#f3e812ff", // Orange
    completed: "#27AE60", // Green
  };

  function getLightColorFromId(id) {
    const index =
      Math.abs([...id].reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
      colorList.length;
    return colorList[index];
  }

  const goToPreviousDay = () => {
    const previousDate = addDays(currentDate, -1);
    setCurrentDate(previousDate);
    console.log("Previous Day", previousDate);
    getAppointmentsAccordingDate(new Date(previousDate));
  };
  const goToNextDay = () => {
    const nextDate = addDays(currentDate, 1);
    setCurrentDate(nextDate);
    console.log("Next Day", nextDate);
    getAppointmentsAccordingDate(new Date(nextDate));
  };
  const goToToday = () => {
    setCurrentDate(startOfToday());
    console.log("Today", startOfToday());
    getAppointmentsAccordingDate(new Date(startOfToday()));
  };
  const getAppointmentsForSlot = (therapist: string, hour: number) => {
    return appointments.filter((appointment) => {
      
      const appointmentDate = appointment.date;
      return (
        isSameDay(appointmentDate, currentDate) &&
        appointmentDate.getHours() === hour &&
        appointment.therapist === therapist
      );
    });
  };
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const getAppointmentsAccordingDate = (date: Date) => {
    setLoading(true);
    getDashboardData(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    )
      .then((res) => {
        setLoading(false);
        console.log("APPOINTMENTS DATA", res.data.data.appointments);
        if (res.data.isSuccess) {
          // dispatch(addAppointments(res.data.data.appointments));
          var appointmentList = [];
          res.data.data.appointments.forEach((appointment: any) => {
            appointment.appointmentTreatmentData.forEach((treatment: any) => {
              appointmentList.push({
                id: appointment.id,
                clientId: appointment.clientId,
                clientName: appointment.clientName,
                appointmentStatus: appointment.appointmentStatus,
                assignedTherapist: treatment.assignedTherapist,
                treatmentType: treatment.treatmentType,
                appointmentDateTime: treatment.treatmentStartTime,
              });
            });
          });
        
          dispatch(addAppointments(appointmentList));
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch appointments", err);
      });
  };
  const handleStatusChange = (status: AppointmentStatus) => {
    console.log("AP-STATUS", status);
    if (selectedAppointment) {
      console.log("Selected Appointment", selectedAppointment);
      const treatmentId = savedTreatmnets.find(
        (ap) => ap.treatmentName === selectedAppointment.treatment
      )?.id;

      console.log("TREATMENT ID", treatmentId);

      const appointmentFormData = {
        appointmentId: selectedAppointment.id,
        appointmentStatus: status.toUpperCase(),
        treatmentId: treatmentId,
      };
      

    
        setLoading(true);
        updateAppointment(appointmentFormData)
          .then((res) => {
            setLoading(false);
            toast.success("Appointment Updated Successful");
            res.data.data.appointment.appointmentTreatmentData.forEach(
              (appointment) => {
                dispatch(
                  updateAppointmentStatus({
                    id: res.data.data.appointment.id,
                    clientId: res.data.data.appointment.clientId,
                    clientName: res.data.data.appointment.clientName,
                    appointmentStatus:
                      res.data.data.appointment.appointmentStatus,
                    assignedTherapist: appointment.assignedTherapist,
                    treatmentType: appointment.treatmentType,
                    appointmentDateTime: appointment.treatmentStartTime,
                  })
                );
              }
            );
            getAppointmentsAccordingDate(new Date(currentDate));
            setIsDetailsModalOpen(false);
            //dispatch(updateAppointmentStatus(res.data.data.appointment));
            // const updatedAppointment = {
            //   ...selectedAppointment,
            //   status,
            // };
            // onUpdateAppointment(updatedAppointment);
            // setSelectedAppointment(updatedAppointment);
            if (status === "completed") {
              const completedAppointment = {
                ...selectedAppointment,
                ...{
                  clientId: res.data.data.appointment.clientId,
                  amount: res.data.data.packageDetails.amount,
                  appointmentTreatments: res.data.data.appointment.appointmentTreatmentData,
                },
              };
              setSelectedAppointment(completedAppointment);
              console.log("Merged Selected Appointment", completedAppointment);
              setIsDetailsModalOpen(false);
              setIsBillingModalOpen(true);
            }
            // console.log("APPOINTMENT API CALLED : ", res.data.data);
          })
          .catch((err) => {
            setLoading(false);
            toast.error("Appointment Updated Failed");
            console.error("Failed APPOINTMENT API CALLED", err);
          });
      
    }
  };
  const handleBillingSave = (billingDetails: BillingDetails) => {
    if (selectedAppointment) {
      const updatedAppointment = {
        ...selectedAppointment,
        billing: billingDetails,
      };
      onUpdateAppointment(updatedAppointment);
      setIsBillingModalOpen(false);
      setSelectedAppointment(null);
    }
  };


  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      {isLoading ? <LoadingPopup /> : <></>}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={goToPreviousDay}
            className="p-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextDay}
            className="p-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <div
          className="grid border border-gray-200"
          style={{
            gridTemplateColumns: `100px repeat(${THERAPISTS.length}, 1fr)`,
          }}
        >
          {/* Header Row */}
          <div className="bg-gray-50 h-12 border-r border-b"></div>
          {THERAPISTS.map((therapist) => (
            <div
              key={therapist}
              className="h-12 text-xs text-center font-medium bg-gray-50 border-r border-b flex items-center justify-center"
            >
              {therapist}
            </div>
          ))}

          {/* Time rows */}
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time column */}
              <div className="text-xs text-gray-500 border-r border-b flex items-center justify-center">
                {hour % 12 === 0 ? "12" : hour % 12}:00{" "}
                {hour >= 12 ? "PM" : "AM"}
                {/* {time} */}
                {/* {time.split(":")[0] >= 12 ? "PM" : "AM"} */}
              </div>

              {/* Appointment slots per therapist */}
              {THERAPISTS.map((therapist) => {
                const appointmentsForSlot = getAppointmentsForSlot(
                  therapist,
                  hour
                  // time.split(":")[0]
                );

                return (
                  <div key={therapist} className="h-20 border-r border-b p-1">
                    {appointmentsForSlot.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        style={{
                          backgroundColor: getLightColorFromId(appointment.id),
                          color: "#ffffff",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          borderLeft: `8px solid ${
                            statusBorderColors[appointment.status] || "#ccc"
                          }`,
                        }}
                        className="p-1 mb-1 text-xs  rounded cursor-pointer hover:bg-indigo-200"
                      >
                        <div className="font-medium">
                          {appointment.clientName}
                        </div>
                        <div>{appointment.treatment}</div>
                        <div>
                          {new Date(appointment.date).toLocaleTimeString(
                            "en-US",
                            {
                              timeZone: "Asia/Colombo",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onStatusChange={handleStatusChange}
      />
      {selectedAppointment && (
        <BillingModal
          isOpen={isBillingModalOpen}
          onClose={() => setIsBillingModalOpen(false)}
          appointment={selectedAppointment}
          onSaveBilling={handleBillingSave}
        />
      )}
    </div>
  );
};
export default AppointmentCalendar;
