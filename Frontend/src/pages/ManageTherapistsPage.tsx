import React, { useState, useEffect } from "react";
import { PlusIcon, Pencil, Trash2, History } from "lucide-react";
import AddEditTherapistModal from "../components/therapists/AddEditTherapistModal";
import TreatmentHistoryModal from "../components/shared/TreatmentHistoryModal";

import { therapistApisHandler } from "../apiService/apis/TherapistApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


interface Therapist {
  id: string;
  name: string;
  staffId: string;
  mobile: string;
  assignedTreatments: string[];
}

const sampleTreatmentHistory = [
  {
    id: "1",
    date: new Date(2024, 0, 15, 10, 30),
    treatmentName: "Massage Therapy",
    clientName: "Jane Doe",
    status: "completed" as const,
  },
  {
    id: "2",
    date: new Date(2024, 0, 16, 14, 0),
    treatmentName: "Facial Treatment",
    clientName: "John Smith",
    status: "completed" as const,
  },
  {
    id: "3",
    date: new Date(2024, 1, 20, 11, 0),
    treatmentName: "Hair Treatment",
    clientName: "Alice Johnson",
    status: "upcoming" as const,
  },
];

const ManageTherapistsPage: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(
    null
  );
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null
  );
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadedTreatments = useSelector((state) => state.treatment);
  const handleAddTherapist = (therapist: Omit<Therapist, "id">) => {
    const newTherapist = {
      ...therapist,
      id: `T${Date.now()}`,
    };

    const therapistPayload = {
      therapistId: null,
      therapistName: therapist.name,
      therapistMobile: therapist.mobile,
      AssignedTreatments: loadedTreatments
        .filter((treatment) =>
          therapist.assignedTreatments.includes(treatment.treatmentName)
        )
        .map((t) => ({ treatmentId: t.id, treatmentName: t.treatmentName })),
    };
    console.log("Payload to send", therapistPayload);
    setIsLoading(true);
    therapistApisHandler("add", therapistPayload)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success("Therapist Added Successfully");
          setIsLoading(false);
          setTherapists([...therapists, newTherapist]);
          setIsModalOpen(false);
        } else {
          toast.error("Failed to add therapist");
          setIsLoading(false);
          setIsModalOpen(false);
          console.error("Failed to add therapist", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsModalOpen(false);
        toast.error("Error adding therapists");
        console.error("Error adding therapists", error);
      });
  };
  const handleEditTherapist = (updatedTherapist: Therapist) => {
    const therapistPayload = {
      therapistId: updatedTherapist.id,
      therapistName: updatedTherapist.name,
      therapistMobile: updatedTherapist.mobile,
      AssignedTreatments: loadedTreatments
        .filter((treatment) =>
          updatedTherapist.assignedTreatments.includes(treatment.treatmentName)
        )
        .map((t) => ({ treatmentId: t.id, treatmentName: t.treatmentName })),
    };
    console.log("Payload to send", therapistPayload);
    setIsLoading(true);
    therapistApisHandler("update", therapistPayload)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success("Therapist Updated Successfully");
          setIsLoading(false);
          setTherapists(
            therapists.map((t) =>
              t.id === updatedTherapist.id ? updatedTherapist : t
            )
          );
          setIsModalOpen(false);
          setEditingTherapist(null);
        } else {
          toast.error("Failed to update therapist");
          setIsLoading(false);
          setIsModalOpen(false);
          setEditingTherapist(null);
          console.error("Failed to update therapist", response.data.message);
        }
      })
      .catch((error) => {
        toast.error("Error updating therapist");
        setIsLoading(false);
        setIsModalOpen(false);
        setEditingTherapist(null);
        console.error("Error updating therapist", error);
      });
  };
  const handleDeleteTherapist = (id: string) => {
    setIsLoading(true);
    therapistApisHandler("delete", id)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success("Therapist Deleted Successfully");
          setIsLoading(false);
          setTherapists(therapists.filter((t) => t.id !== id));
          setIsModalOpen(false);
          setEditingTherapist(null);
        } else {
          toast.error("Failed to delete therapist");
          setIsLoading(false);
          setIsModalOpen(false);
          setEditingTherapist(null);
          console.error("Failed to delete therapist", response.data.message);
        }
      })
      .catch((error) => {
        toast.error("Error deleting therapist");
        setIsLoading(false);
        setIsModalOpen(false);
        setEditingTherapist(null);
        console.error("Error deleting therapist", error);
      });

  };
  const openEditModal = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    setIsModalOpen(true);
  };
  const openHistoryModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsHistoryModalOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    therapistApisHandler("list")
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          console.log("THERAPISTS LOADED", response.data.data.therapists);
          const convertedTherapists = response.data.data.therapists.map(
            (item: any) => ({
              id: item.id,
              name: item.therapistName,
              staffId: item.id,
              mobile: item.therapistMobile,
              assignedTreatments: item.assignedTreatments.map(
                (t) => t.treatmentName
              ),
            })
          );
          // dispatch(addTreatments(convertedTreatments));
          setTherapists(convertedTherapists);
          console.log("Converted Therapists", convertedTherapists);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch therapists", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching therapists", error);
      });
  }, []);
  return (
    <div className="container mx-auto">
      {isLoading && <LoadingPopup />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Manage Therapists
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage salon therapists
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Therapist
        </button>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Treatments
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {therapists.map((therapist) => (
                <tr key={therapist.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {therapist.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Staff ID: {therapist.staffId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {therapist.mobile}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {therapist.assignedTreatments.map((treatment) => (
                        <span
                          key={treatment}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {treatment}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      {/* <button
                        onClick={() => openHistoryModal(therapist)}
                        className="text-[#D4AF37] hover:text-[#B4941F]"
                      >
                        <History className="w-5 h-5" />
                      </button> */}
                      <button
                        onClick={() => openEditModal(therapist)}
                        className="text-[#D4AF37] hover:text-[#B4941F]"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTherapist(therapist.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddEditTherapistModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTherapist(null);
        }}
        onSubmit={editingTherapist ? handleEditTherapist : handleAddTherapist}
        therapist={editingTherapist}
      />
      <TreatmentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedTherapist(null);
        }}
        title={`Treatment History - ${selectedTherapist?.name || ""}`}
        history={sampleTreatmentHistory}
        viewType="therapist"
      />
    </div>
  );
};
export default ManageTherapistsPage;
