import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  User,
  Scissors,
  CalendarIcon,
  Trash2,

} from "lucide-react";
import { getAppointmentsByDate } from "../apiService/apis/AppointmentApis";
import { deleteAppoinment } from "../apiService/apis/AppointmentApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { Calendar } from "../components/calendar/Calendar";
import { toast } from "react-toastify";

interface Appointment {
  id: string;
  clientName: string;
  treatment: string[];
  date: Date;
}
interface AppointmentsHistoryPageProps {
  appointments: Appointment[];
}
const AppointmentsHistoryPage: React.FC<AppointmentsHistoryPageProps> = ({
  appointments,
}) => {
  const [loadedAppointments, setLoadedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

const handleDateSelected = (d: Date) => {
  console.log("Selected Date:", d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"));
    setIsLoading(true);
    getAppointmentsByDate(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"))
      .then((response) => {
        if (response.data.isSuccess) {
          //dispatch(updateProducts(response.data.data.product));
          setIsLoading(false);
          var allLoadedAppointments = response.data.data.appointments.map(
            (d) => ({
              id: d.id,
              clientName: d.clientName,
              treatment: d.appointmentTreatmentData,
              date: d.appointmentDateTime,
            })
          );
          setLoadedAppointments(allLoadedAppointments);
          console.log("Loaded Appointments", allLoadedAppointments);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch appointments", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching appointments", error);
      });
  };

    const handleDeleteTreatment = (id: string) => {
      console.log("Deleting Appointment with ID:", id);
      setIsLoading(true);
      deleteAppoinment( id)
        .then((response) => {
          if (response.data.isSuccess) {
            setIsLoading(false);
            
            setLoadedAppointments(loadedAppointments.filter(x => x.id !== id));
            toast.success("Appointment Deleted Successful");
    
           
          } else {
            setIsLoading(false);
            toast.error("Failed to delete Appointment");
            console.error("Failed to delete Appointment", response.data.message);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error("Failed to delete Appointment");
          console.error("Error deleting Appointment", error);
        });
    }


  useEffect(() => {
    
    setIsLoading(true);
    const d = new Date();
    getAppointmentsByDate(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"))
      .then((response) => {
        if (response.data.isSuccess) {
          //dispatch(updateProducts(response.data.data.product));
          setIsLoading(false);
          var allLoadedAppointments = response.data.data.appointments.map(
            (d) => ({
              id: d.id,
              clientName: d.clientName,
              treatment: d.appointmentTreatmentData,
              date: d.appointmentDateTime,
            })
          );
          setLoadedAppointments(allLoadedAppointments);
          console.log("Loaded Appointments", allLoadedAppointments);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch appointments", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching appointments", error);
      });
      function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []);

  return (
    <div className="container mx-auto">
      {isLoading && <LoadingPopup />}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Appointments History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View all past and upcoming appointments
          </p>
        </div>

        <div className="flex items-center">
          {/* Calendar Button */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={`p-2 rounded-full mr-2 ${
                calendarOpen
                  ? "bg-gray-800 text-[#D4AF37]"
                  : "text-gray-300 hover:text-[#D4AF37]"
              }`}
              aria-label="Toggle calendar"
            >
              <CalendarIcon size={20} />
            </button>
            {/* Calendar Dropdown */}
            {calendarOpen && (
              <div className="absolute right-0 mt-2 origin-top-right">
                <Calendar CallBackMethod={handleDateSelected}/>
              </div>
            )}
          </div>
         
        </div>
      </div>
      <div className="mt-4 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadedAppointments.length === 0
                ? ""
                : loadedAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="flex items-center text-blue-400">
                              {appointment.id}
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">
                                {new Date(appointment.date).toLocaleDateString(
                                  "en-CA",
                                  { timeZone: "Asia/Colombo" }
                                )}
                              </div>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="w-5 h-5 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-500">
                                {new Date(appointment.date).toLocaleTimeString(
                                  "en-US",
                                  { timeZone: "Asia/Colombo", hour12: true }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.clientName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">
                            {appointment.treatment.map((treat, index) => (
                              <div key={index} className="flex items-center">
                                <Scissors className="w-3 h-3 text-gray-400 mr-2" />
                                <div>
                                  {treat.treatmentType} -{" "}
                                  <span className="text-pink-400">
                                    {treat.assignedTherapist}
                                  </span>{" "}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                                                onClick={() => handleDeleteTreatment(appointment.id)}
                                                className="text-red-600 hover:text-red-900"
                                              >
                                                <Trash2 className="w-5 h-5" />
                                              </button>
                                          
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AppointmentsHistoryPage;
