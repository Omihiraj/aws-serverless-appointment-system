import React, { useState,useEffect } from 'react';
import { Calendar, Phone, History } from 'lucide-react';
import TreatmentHistoryModal from '../components/shared/TreatmentHistoryModal';
import { clientApisHandler } from "../apiService/apis/ClientApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";


interface Client {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  medicalHistory: string;
}
interface ClientProfilesPageProps {
  clients: Client[];
}
const sampleTreatmentHistory = [{
  id: '1',
  date: new Date(2024, 0, 15, 10, 30),
  treatmentName: 'Massage Therapy',
  therapistName: 'John Smith',
  status: 'completed' as const
}, {
  id: '2',
  date: new Date(2024, 0, 16, 14, 0),
  treatmentName: 'Facial Treatment',
  therapistName: 'Sarah Johnson',
  status: 'completed' as const
}, {
  id: '3',
  date: new Date(2024, 1, 20, 11, 0),
  treatmentName: 'Hair Treatment',
  therapistName: 'Emma Davis',
  status: 'upcoming' as const
}];
const ClientProfilesPage: React.FC<ClientProfilesPageProps> = ({
  clients
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadedClients, setLoadedClients] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState(sampleTreatmentHistory);
  const openHistoryModal = (client: Client) => {
    setSelectedClient(client);

    console.log("Selected Client", client.id);

    setIsLoading(true);
          clientApisHandler("appointmentsByClientId", client.id)
            .then((response) => {
              if (response.data.isSuccess) {
                //dispatch(updateProducts(response.data.data.product));
                setIsLoading(false);

                var allHistoryData = [];
                response.data.data.appointments.forEach((d) => {

                  d.appointmentTreatmentData.forEach((treatment) => {
                    console.log("Treatment Data", treatment);
                    const historyEntry = {
                      id: d.id,
                      date: new Date(treatment.treatmentStartTime),
                      treatmentName: treatment.treatmentType,
                      therapistName: treatment.assignedTherapist,
                      status: "Completed"
                    };
                    allHistoryData.push(historyEntry);
                  });
                });
                console.log("All History Data", allHistoryData);
                setHistoryData(allHistoryData);
                setIsHistoryModalOpen(true);
               
              } else {
                setIsLoading(false);
                console.error("Failed to fetch data", response.data.message);
              }
            })
            .catch((error) => {
              setIsLoading(false);
              console.error("Error fetching data", error);
            });




    
  };

  useEffect(() => {
    setIsLoading(true);
          clientApisHandler("list", null)
            .then((response) => {
              if (response.data.isSuccess) {
                //dispatch(updateProducts(response.data.data.product));
                setIsLoading(false);
                var allLoadedClients = response.data.data.clients.map((d) => ({
                  id: d.id,
                  name: d.name,
                  mobile: d.mobileNumber,
                  dob: d.dateOfBirth,
                  medicalHistory: d.medicalHistory,
                }));
                setLoadedClients(allLoadedClients);
                console.log("Loaded Clients", allLoadedClients);
              } else {
                setIsLoading(false);
                console.error("Failed to fetch clients", response.data.message);
              }
            })
            .catch((error) => {
              setIsLoading(false);
              console.error("Error fetching clients", error);
            });
  }, []);
  return <div className="container mx-auto">
    {isLoading && <LoadingPopup />}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Client Profiles
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all client information
        </p>
      </div>
      <div className="mt-4 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical History
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  History
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadedClients===""?"":loadedClients.map(client => <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {client.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {client.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {client.mobile}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(client.dob).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {client.medicalHistory || 'No medical history recorded'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openHistoryModal(client)} className="text-[#D4AF37] hover:text-[#B4941F]">
                      <History className="w-5 h-5" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <TreatmentHistoryModal isOpen={isHistoryModalOpen} onClose={() => {
      setIsHistoryModalOpen(false);
      setSelectedClient(null);
    }} title={`Treatment History - ${selectedClient?.name || ''}`} history={historyData} viewType="client" />
    </div>;
};
export default ClientProfilesPage;