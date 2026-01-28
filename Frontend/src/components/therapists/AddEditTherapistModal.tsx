import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSelector } from "react-redux";


interface Therapist {
  id: string;
  name: string;
  staffId: string;
  mobile: string;
  assignedTreatments: string[];
}
interface AddEditTherapistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (therapist: any) => void;
  therapist?: Therapist | null;
}
//const treatmentOptions = ['Massage Therapy', 'Facial Treatment', 'Haircut & Styling', 'Manicure & Pedicure', 'Waxing'];
const AddEditTherapistModal: React.FC<AddEditTherapistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  therapist
}) => {
  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    mobile: '',
    assignedTreatments: [] as string[]
  });
    const loadedTreatments = useSelector((state) => state.treatment);
  const treatmentOptions = loadedTreatments.map(treatment => treatment.treatmentName);
  useEffect(() => {
    if (therapist) {
      setFormData({
        name: therapist.name,
        staffId: therapist.staffId,
        mobile: therapist.mobile,
        assignedTreatments: therapist.assignedTreatments
      });
    } else {
      setFormData({
        name: '',
        staffId: '',
        mobile: '',
        assignedTreatments: []
      });
    }
  }, [therapist]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(therapist ? {
      ...formData,
      id: therapist.id
    } : formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleTreatmentToggle = (treatment: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTreatments: prev.assignedTreatments.includes(treatment) ? prev.assignedTreatments.filter(t => t !== treatment) : [...prev.assignedTreatments, treatment]
    }));
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {therapist ? 'Edit Therapist' : 'Add New Therapist'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
                Staff ID
              </label>
              <input type="text" id="staffId" name="staffId" value={formData.staffId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Treatments
              </label>
              {/* <div className="space-y-2">
                {treatmentOptions.map(treatment => <label key={treatment} className="flex items-center space-x-2">
                    <input type="checkbox" checked={formData.assignedTreatments.includes(treatment)} onChange={() => handleTreatmentToggle(treatment)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-gray-900">{treatment}</span>
                  </label>)}
              </div> */}
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
    {treatmentOptions.map((treatment) => (
      <label key={treatment} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.assignedTreatments.includes(treatment)}
          onChange={() => handleTreatmentToggle(treatment)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-900">{treatment}</span>
      </label>
    ))}
  </div>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {therapist ? 'Update Therapist' : 'Add Therapist'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddEditTherapistModal;