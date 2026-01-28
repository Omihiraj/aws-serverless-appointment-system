import React, { useState, useEffect } from "react";
import { PlusIcon, Package, MinusIcon, PlusCircleIcon, Trash2, } from "lucide-react";
import ItemFormModal from "../components/stores/ItemFormModal";
import { StoreItem } from "../types/store";
import { productApisHandler } from "../apiService/apis/ProductApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { useDispatch } from "react-redux";
import { addProducts, updateProducts } from "../dataStore/slices/productSlice";
import { toast } from "react-toastify";

const ManageStoresPage: React.FC = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleAddItem = (newItem: Omit<StoreItem, "id" | "lastUpdated">) => {
    setIsLoading(true);
    const productData = {
      productName: newItem.name,
      productCode: newItem.code,
      productQuantity: newItem.quantity,
      lastUpdatedDate: new Date().toISOString(),
    };

    productApisHandler("add", productData)
      .then((response) => {
        if (response.data.isSuccess) {
          dispatch(updateProducts(response.data.data.product));
          setIsLoading(false);
          toast.success("Product Added Successful");
          const item: StoreItem = {
            ...newItem,
            id: `item-${Date.now()}`,
            lastUpdated: new Date(),
          };
          setItems([...items, item]);
          setIsModalOpen(false);
        } else {
          setIsLoading(false);
          toast.error("Failed to fetch products");
          console.error("Failed to fetch products", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Failed to fetch products");
        console.error("Error fetching products", error);
      });
  };
  const updateQuantity = (id: string, change: number) => {

    const newQuantity = Math.max(0, items.find((item) => item.id === id)?.quantity + change);
    
    setIsLoading(true);
    productApisHandler("updateQuantity", {
      productId: id,
      productQuantity: newQuantity,
    })
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          toast.success("Product Quantity Update Successful");
          setItems(
            items.map((item) => {
              if (item.id === id) {
                
                console.log(
                  "Updating quantity for item",
                  id,
                  "to",
                  newQuantity
                );
                return {
                  ...item,
                  quantity: newQuantity,
                  lastUpdated: new Date(),
                };
              }
              return item;
            })
          );
        } else {
          setIsLoading(false);
          toast.error("Product Quantity Update Failed");
          console.error("Failed to update quantity", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Product Quantity Update Failed");
        console.error("Error updating quantity", error);
      });
  };

  const handleDeleteTreatment = (id: string) => {
    setIsLoading(true);
    productApisHandler("delete", id)
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          toast.success("Product Deleted Successful");
  
          setItems(prev =>
            prev.filter(item => item.id !== id)
          );
          setIsModalOpen(false);
        } else {
          setIsLoading(false);
          toast.error("Failed to delete products");
          console.error("Failed to delete products", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Failed to delete products");
        console.error("Error deleting products", error);
      });
  }

  useEffect(() => {
    // Fetch initial items from API
    setIsLoading(true);
    productApisHandler("list")
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          toast.success("Product Loaded Successful");
          console.log("Loaded Products", response.data.data.products);
          //setItems(response.data.data);
          const convertedItems = response.data.data.products.map(
            (item: any) => ({
              id: item.id,
              name: item.productName,
              code: item.productCode,
              quantity: item.productQuantity,
              lastUpdated: new Date(item.lastUpdatedDate).toISOString(),
            })
          );

          dispatch(addProducts(response.data.data.products));

          setItems(convertedItems);
        } else {
          setIsLoading(false);
          toast.error("Product Quantity Update Failed");
          console.error("Failed to fetch products", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Product Quantity Update Failed");
        console.error("Error fetching products", error);
      });
  }, []);

  return (
    <div className="container mx-auto">
      {isLoading && <LoadingPopup />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Manage Store Items
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage salon inventory items
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.quantity > 5
                          ? "bg-green-100 text-green-800"
                          : item.quantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.quantity} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {item.lastUpdated.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                   <button
                        onClick={() => handleDeleteTreatment(item.id)}
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
      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  );
};
export default ManageStoresPage;
