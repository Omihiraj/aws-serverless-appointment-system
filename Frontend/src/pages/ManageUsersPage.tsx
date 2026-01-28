import React, { useState, useEffect } from "react";
import { PlusIcon, Pencil, Trash2, UserCog } from "lucide-react";
import { User, UserStatus } from "../types/user";
import UserFormModal from "../components/users/UserFormModal";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { userApisHandler } from "../apiService/apis/UserApis";
import { toast } from "react-toastify";

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = (userData: Omit<User, "id" | "status">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      status: "Active",
    };

    const userPayload = {
      id: null,
      name: userData.name,
      email: userData.email,
      mobileNumber: userData.mobile,
      roleType: userData.type,
    };
    console.log("Payload to send", userPayload);
    setIsLoading(true);
    userApisHandler("add", userPayload)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success("User Added Successfully");
          setIsLoading(false);
          setUsers([...users, newUser]);
          setIsModalOpen(false);
        } else {
          toast.error("Failed to add user");
          setIsLoading(false);
          setIsModalOpen(false);
          console.error("Failed to add user", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsModalOpen(false);
        toast.error("Error adding user");
        console.error("Error adding user", error);
      });
  };
  const handleEditUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsModalOpen(false);
    setEditingUser(null);
  };
  const handleDeleteUser = (id: string) => {
    

    const selectUser = users.filter((user) => user.id === id)[0];
    const userPayload = {
      id: selectUser.id,
      name: selectUser.name,
      email: selectUser.email,
      mobileNumber: selectUser.mobile,
      roleType: selectUser.type,
    };
    console.log("Payload to delete", userPayload);
    setIsLoading(true);
    userApisHandler("delete", userPayload)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success("User Deleted Successfully");
          setIsLoading(false);
          setUsers(users.filter((user) => user.id !== id));
          setIsModalOpen(false);
        } else {
          toast.error("Failed to delete user");
          setIsLoading(false);
          setIsModalOpen(false);

          console.error("Failed to delete user", response.data.message);
        }
      })
      .catch((error) => {
        toast.error("Error deleting user");
        setIsLoading(false);
        setIsModalOpen(false);

        console.error("Error deleting user", error);
      });
  };
  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            status: user.status === "Active" ? "Inactive" : "Active",
          };
        }
        return user;
      })
    );
  };
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    userApisHandler("list")
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLoading(false);
          console.log("Users LOADED", response.data.data.users);
          const convertedUsers = response.data.data.users.map((item: any) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            mobile: item.mobileNumber,
            staffId: item.staffId,
            type: item.roleType,
            status: "Active",
          }));
          // dispatch(addTreatments(convertedTreatments));
          setUsers(convertedUsers);
          console.log("Converted Users", convertedUsers);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch users", response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching users", error);
      });
  }, []);

  return (
    <div className="container mx-auto">
      {isLoading && <LoadingPopup />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Users</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage system users
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New User
        </button>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCog className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Staff ID: {user.staffId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      {/* <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </button> */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        user={editingUser}
      />
    </div>
  );
};
export default ManageUsersPage;
