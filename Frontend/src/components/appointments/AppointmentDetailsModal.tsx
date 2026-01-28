import React from "react";
import { X, Calendar, Clock, User, Sparkles } from "lucide-react";
import { Appointment, AppointmentStatus } from "../../types/appointment";
interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onStatusChange: (status: AppointmentStatus) => void;
}
const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onStatusChange,
}) => {
  if (!isOpen || !appointment) return null;
  const statusActions = {
    pending: ["checked-in", "cancelled"],
    "checked-in": ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };
  const statusColors = {
    pending: "bg-[#F5EDD6] text-[#D4AF37]",
    "checked-in": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">
                {appointment.date.toLocaleDateString()}
              </span>
              <Clock className="w-5 h-5 text-gray-400 ml-4 mr-2" />
              <span className="text-sm text-gray-900">
                {appointment.date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[appointment.status]
              }`}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">
              {appointment.clientName}
            </span>
          </div>
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-[#D4AF37] mr-2" />
            <span className="text-sm text-gray-900">
              {appointment.treatment}
            </span>
          </div>
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">
              {appointment.therapist}
            </span>
          </div>
          {appointment.status.charAt(0).toUpperCase() +
            appointment.status.slice(1) ===
            "Completed" && (
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md 'text-white bg-[#D4AF37] hover:bg-[#B4941F]`}
                 onClick={() => onStatusChange("completed")}
              >
                Print
              </button>
            </div>
          )}
          {statusActions[appointment.status].length > 0 && (
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              {statusActions[appointment.status].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status as AppointmentStatus)}
                  className={`px-4 py-2 text-sm font-medium rounded-md
                    ${
                      status === "cancelled"
                        ? "text-red-700 bg-red-100 hover:bg-red-200"
                        : "text-white bg-[#D4AF37] hover:bg-[#B4941F]"
                    }`}
                >
                  {status === "checked-in"
                    ? "Check In"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AppointmentDetailsModal;
