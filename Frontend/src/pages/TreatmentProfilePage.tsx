import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  Pencil,
  Trash2,
  Clock,
  Package,
} from "lucide-react";
import { Treatment } from "../types/treatment";
import TreatmentFormModal from "../components/treatments/TreatmentFormModal";
import { useSelector } from "react-redux";
import { treatmentApisHandler } from "../apiService/apis/TreatmentApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { useDispatch } from "react-redux";
import {
  addTreatments,
  updateTreatments,
} from "../dataStore/slices/treatmentSlice";
import { toast } from "react-toastify";

const TreatmentProfilePage: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const loadedProducts = useSelector((state) => state.product);
  const loadedProductNames = loadedProducts.map((product) => product.productName);


  const handleAddTreatment = (treatmentData: Omit<Treatment, "id">) => {

    // let treatmentRequestProducts = [];

    // loadedProducts.forEach((product) => {
    //   if (treatmentData.products.includes(product.name)) {
    //     treatmentRequestProducts.push({productId: product.id, productName: product.name});
    //   }
    // });


    let treatmentRequestProducts = [];

    loadedProducts.forEach((product) => {
      if (treatmentData.products.includes(product.productName)) {
        treatmentRequestProducts.push({productId: product.id, productName: product.productName});
      }
    });

    console.log("Treatment Products>>>>", treatmentRequestProducts);
    
    const treatmentRequest = {
      treatmentId: "",
      treatmentName: treatmentData.name,
      treatmentDuration: treatmentData.duration,
      products:   treatmentRequestProducts,
      amount: treatmentData.amount,
      lastUpdated: new Date(),
    };

    console.log("TREATMENT REQUEST", treatmentRequest);

    setIsLoading(true);
    treatmentApisHandler("add", treatmentRequest)
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          toast.success("Treatment Added Successfully");
          dispatch(updateTreatments(response.data.data.treatment));
          const newTreatment: Treatment = {
            ...treatmentData,
            id: response.data.data.treatment.treatmentId, // Assuming the API returns the new treatment ID
          };
          setTreatments([...treatments, newTreatment]);
          setIsModalOpen(false);
        } else {
          setIsLoading(false);
          toast.error("Failed to add treatment");
          console.error("Failed to add treatment", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Failed to add treatment");
        console.error("Error adding treatment", error);
      });
  };
  const handleEditTreatment = (updatedTreatment: Treatment) => {
   
    setEditingTreatment(null);

    let treatmentRequestProducts = [];

    //console.log("Loaded Products======", loadedProducts);

    loadedProducts.forEach((product) => {
      //console.log("CHECKING PRODUCT", product.productName);
      if (updatedTreatment.products.includes(product.productName)) {
        treatmentRequestProducts.push({productId: product.id, productName: product.productName});
      }
    });

    console.log("LOADED PRODUCTS", treatmentRequestProducts);
    const treatmentRequest = {
      treatmentId: updatedTreatment.id,
      treatmentName: updatedTreatment.name,
      treatmentDuration: updatedTreatment.duration,
      products:   treatmentRequestProducts,
      amount: updatedTreatment.amount,
      lastUpdated: new Date(),
    };

    console.log("TREATMENT REQUEST", treatmentRequest);

    setIsLoading(true);
    treatmentApisHandler("update", treatmentRequest)
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          toast.success("Treatment Updated Successfully");
          dispatch(updateTreatments(response.data.data.treatment));
          const newTreatment: Treatment = {
            ...updatedTreatment,
            id: response.data.data.treatment.treatmentId, // Assuming the API returns the new treatment ID
          };
         
          
      setTreatments(
            treatments.map((treatment) =>
              treatment.id === updatedTreatment.id ? updatedTreatment : treatment
            )
          );
         setIsModalOpen(false);
    
        } else {
          setIsLoading(false);
          toast.error("Failed to edit treatment");
          console.error("Failed to edit treatment", response.data.message);
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsModalOpen(false);
        toast.error("Failed to edit treatment");
        console.error("Error editing treatment", error);
      });

      
  };
  const handleDeleteTreatment = (id: string) => {
    console.log("Remove Treatment ID :", id);
    // if (window.confirm("Are you sure you want to delete this treatment?")) {
    //   setTreatments(treatments.filter((treatment) => treatment.id !== id));
    // }
    
    setIsLoading(true);
    treatmentApisHandler("delete", id)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success("Treatment Deleted Successfully");
          setIsLoading(false);
          setTreatments(treatments.filter((treatment) => treatment.id !== id));

          setIsModalOpen(false);
    
        } else {
          setIsLoading(false);
          toast.error("Failed to delete treatment");
          console.error("Failed to delete treatment", response.data.message);
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsModalOpen(false);
        toast.error("Failed to delete treatment");
        console.error("Error deleting treatment", error);
      });
  };
  const openEditModal = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setIsModalOpen(true);
  };

  

  useEffect(() => {
    setIsLoading(true);
    treatmentApisHandler("list")
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          console.log("TREATMENTS LOADED", response.data.data.treatments);
          const convertedTreatments = response.data.data.treatments.map(
            (item: any) => ({
              id: item.id, // you can change this dynamically if needed
              name: item.treatmentName,
              duration: item.treatmentDuration,
              products: item.products.map((p) => p.productName),
              amount: item.treatmentAmount,
            })
          );
          dispatch(addTreatments(response.data.data.treatments));
          setTreatments(convertedTreatments);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch treatments", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching treatments", error);
      });
  }, []);

  return (
    <div className="container mx-auto">
      {isLoading && <LoadingPopup />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Treatment Profiles
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all treatment details
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Treatment
        </button>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatments.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })).map((treatment) => (
                <tr key={treatment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {treatment.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {treatment.duration} minutes
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {treatment.products.map((product) => (
                        <span
                          key={product}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Package className="w-3 h-3 mr-1" />
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      
                      <span className="w-5 h-5 text-gray-400 mr-1 mr-4">LKR  </span>
                      {treatment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openEditModal(treatment)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTreatment(treatment.id)}
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
      <TreatmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTreatment(null);
        }}
        onSubmit={editingTreatment ? handleEditTreatment : handleAddTreatment}
        treatment={editingTreatment}
        availableProducts={loadedProductNames}
      />
    </div>
  );
};
export default TreatmentProfilePage;
