import React, { useState, useRef } from 'react';
import { Appointment, BillingDetails } from '../../types/appointment';
import { X, Scissors, Calendar, Phone, MapPin, Heart } from 'lucide-react';
import { useReactToPrint } from "react-to-print";
import { all } from 'axios';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment;
  onSaveBilling: (billing: BillingDetails) => void;
}
const BillingModal: React.FC<BillingModalProps> = ({
  isOpen,
  onClose,
  appointment,

  onSaveBilling
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
const reactToPrintFn = useReactToPrint({ contentRef });
  const [billing, setBilling] = useState<BillingDetails>({
    productCost: 0,
    serviceCost: 0,
    returns: 0,
    backbar: 0,
    tips: 0,
    numberOfTickets: 1,
    total: 0
  });
  if (!isOpen) return null;
  
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBilling(billing);
    onClose();
  };
  const receipt = {
    appointmentNumber: appointment.id,
    clientName: appointment.clientName,
    clientId: appointment.clientId,
    treatment: appointment.treatment,
    allTreatments: appointment.appointmentTreatments,
    price: `LKR ${appointment.amount.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 3
})}`,
    therapist: appointment.therapist,
    date: appointment.date.toLocaleDateString(),
    time: appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: true }),
    companyName: 'Derma Plan & Academy',
    address: '85/8 Barnes Pl, Colombo 00700',
    telephone: '071 984 8114',
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="relative z-50 w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Billing Details
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Receipt Template */}
            <div className=" border border-gray-200 rounded-lg overflow-hidden" ref={contentRef}>
              {/* Receipt Header */}
              <div className="bg-[#B4941F] text-white p-4 text-center">
                <div className="flex justify-center items-center mb-2">
                  <Scissors className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">{receipt.companyName}</h3>
                </div>
                <div className="text-sm flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{receipt.address}</span>
                </div>
                <div className="text-sm flex items-center justify-center mt-1">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{receipt.telephone}</span>
                </div>
              </div>
              {/* Receipt Body */}
              <div className="p-6 bg-white">
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Appointment No.</div>
                    <div className="font-semibold">
                      {receipt.appointmentNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Date & Time</div>
                    <div className="font-semibold">{receipt.date}</div>
                    <div>{receipt.time}</div>
                  </div>
                </div>
                <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Client Name</div>
                      <div className="font-semibold">{receipt.clientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Client ID</div>
                      <div className="font-semibold">{receipt.clientId}</div>
                    </div>
                  </div>
                </div>
                <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Service Details
                  </div>
                  {receipt.allTreatments.map((treatment, index) => (
                    <div
                      key={index}
                      className="flex justify-between mb-1"
                    >
                     <div className="flex justify-between mb-2">
                      <div className="font-medium">{treatment.treatmentType}</div>
                    
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="mr-1">Therapist:</span>
                      <span className="font-medium">{treatment.assignedTherapist}</span>
                    </div>
                    </div>
                  ))}
               
                  
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-bold text-[#B4941F]">
                    {receipt.price}
                  </div>
                </div>
              </div>
              {/* Receipt Footer */}
              <div className="bg-gray-50 p-4 text-center">
                <div className="flex justify-center items-center text-[#B4941F] mb-1">
                  <Heart className="w-4 h-4 mr-1 fill-[#B4941F] stroke-[#B4941F]" />
                  <span className="font-medium">Thank you for your visit!</span>
                </div>
                <div className="text-sm italic text-gray-600">
                  "Indulge in beauty again soon, we're looking forward to
                  pampering you!"
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-[#B4941F] text-white rounded hover:bg-[#9a7e1a] transition-colors"
                onClick={reactToPrintFn}
                
              >
                Print Receipt
              </button>
              
            </div>
          </div>
        </div>
  );
};
export default BillingModal;