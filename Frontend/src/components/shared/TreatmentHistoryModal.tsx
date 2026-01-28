import React from 'react';
import { X, Calendar, Clock, User, Sparkles } from 'lucide-react';
interface TreatmentHistory {
  id: string;
  date: Date;
  treatmentName: string;
  clientName?: string;
  therapistName?: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}
interface TreatmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  history: TreatmentHistory[];
  viewType: 'therapist' | 'client';
}
const TreatmentHistoryModal: React.FC<TreatmentHistoryModalProps> = ({
  isOpen,
  onClose,
  title,
  history,
  viewType
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Treatment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {viewType === 'therapist' ? 'Client' : 'Therapist'}
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map(item => <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {item.date.toLocaleDateString()}
                        </div>
                        <Clock className="w-4 h-4 text-gray-400 ml-4 mr-2" />
                        <div className="text-sm text-gray-500">
                          {item.date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 text-[#D4AF37] mr-2" />
                        <span className="text-sm text-gray-900">
                          {item.treatmentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {viewType === 'therapist' ? item.clientName : item.therapistName}
                        </span>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === 'completed' ? 'bg-green-100 text-green-800' : item.status === 'upcoming' ? 'bg-[#F5EDD6] text-[#D4AF37]' : 'bg-red-100 text-red-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td> */}
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};
export default TreatmentHistoryModal;