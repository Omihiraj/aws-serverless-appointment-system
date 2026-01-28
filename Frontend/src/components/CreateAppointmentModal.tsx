import React, { useState,useEffect } from 'react';
import { X } from 'lucide-react';
import ClientDetailsForm from './ClientDetailsForm';
import AppointmentDetailsForm from './AppointmentDetailsForm';
interface Client {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  medicalHistory: string;
}
interface AppointmentFormData {
  appointmentNumber: string;
  treatmentType: string;
  date: string;
  time: string;
  therapist: string;
}
interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  //onCreateAppointment: (clientData: Client, appointmentData: AppointmentFormData) => void;
  existingClients: Client[];
}
const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  //onCreateAppointment,
  existingClients
}) => {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState<Client | null>(null);
  const handleClientDetailsSubmit = (data: Client) => {
    setClientData(data);
    setStep(2);
  };
  const handleAppointmentDetailsSubmit = (data: AppointmentFormData) => {
    if (clientData) {
      //onCreateAppointment(clientData, data);
    }
    onClose();
  };
  const handleGoBack = () => {
    setStep(1);
  };

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setClientData(null);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {step === 1 ? 'Client Details' : 'Appointment Details'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
          </div>
        </div>
        {step === 1 ? <ClientDetailsForm onSubmit={handleClientDetailsSubmit} existingClients={existingClients} /> : <AppointmentDetailsForm onSubmit={handleAppointmentDetailsSubmit} onBack={handleGoBack} />}
      </div>
    </div>;
};
export default CreateAppointmentModal;