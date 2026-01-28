import React, { useState } from "react";
import { addClient } from "../dataStore/slices/clientDataFormSlice";
import { useDispatch } from "react-redux";
import { clientApisHandler } from "../apiService/apis/ClientApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";

interface Client {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  medicalHistory: string;
}
interface ClientDetailsFormProps {
  onSubmit: (data: Client) => void;
  existingClients: Client[];
}

const ClientDetailsForm: React.FC<ClientDetailsFormProps> = ({
  onSubmit,
  existingClients,
}) => {
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedClients, setLoadedClients] = useState<Client[]>(existingClients);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const suggestions = loadedClients.filter(
    (c) =>
      (c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.mobile.includes(query)) &&
      query.trim() !== ""
  );

  const handleSelect = (client) => {
    setQuery(`${client.name} (${client.mobile})`);
    setResult(client);
    setSelectedClientId(client.id);
  };

  const [formData, setFormData] = useState<Omit<Client, "id">>({
    name: "",
    mobile: "",
    dob: "",
    medicalHistory: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleExistingClientChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedClientId(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
   
    e.preventDefault();
    if (loadedClients) {
      const selectedClient = loadedClients.find(
        (client) => client.id === selectedClientId
      );
      if (selectedClient) {
        dispatch(addClient(selectedClient));
        onSubmit(selectedClient);
         console.log("PRESSED SUBMIT IF");
      }else {
        console.log("PRESSED SUBMIT ELSE")
        dispatch(addClient(formData));

        onSubmit({
          id: `client-${Date.now()}`,
          ...formData,
        });
      }
    } else {
      dispatch(addClient(formData));

      onSubmit({
        id: `client-${Date.now()}`,
        ...formData,
      });
    }
  };

  const checkBoxHandler = () => {
    setUseExistingClient(!useExistingClient);
    if (!useExistingClient) {
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
            console.log("Loaded Clients", existingClients);
            // const item: StoreItem = {
            //   ...newItem,
            //   id: `item-${Date.now()}`,
            //   lastUpdated: new Date(),
            // };
            // setItems([...items, item]);
            // setIsModalOpen(false);
          } else {
            setIsLoading(false);
            console.error("Failed to fetch clients", response.data.message);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error fetching clients", error);
        });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {isLoading && <LoadingPopup />}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="useExistingClient"
            checked={useExistingClient}
            onChange={checkBoxHandler}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="useExistingClient"
            className="text-sm font-medium text-gray-700"
          >
            Select an existing client
          </label>
        </div>
        {useExistingClient ? (
          <div className="mb-4">
            {/* <label
              htmlFor="clientId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Client
            </label>
            <select
              id="clientId"
              name="clientId"
              value={selectedClientId}
              onChange={handleExistingClientChange}
              className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a client</option>
              {loadedClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.mobile}
                </option>
              ))}
            </select> */}

            
              <input
                type="text"
                placeholder="Search by name or mobile"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResult(null); // reset result when typing
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition-all duration-200"
              />

              {/* Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute bg-white border w-72 mt-1 rounded shadow-lg z-10">
                  {suggestions.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {c.name} – {c.mobile}
                    </li>
                  ))}
                </ul>
              )}
            
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="medicalHistory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows={3}
                value={formData.medicalHistory}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};
export default ClientDetailsForm;
