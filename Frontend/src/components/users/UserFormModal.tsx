import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { User, UserType } from '../../types/user';
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: any) => void;
  user?: User | null;
}
const userTypes: UserType[] = ['Admin', 'Super Admin'];
const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user
}) => {
  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    mobile: '',
    email: '',
    type: 'Admin' as UserType,
    status: 'Active' as const
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        staffId: user.staffId,
        mobile: user.mobile,
        email: user.email,
        type: user.type,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        staffId: '',
        mobile: '',
        email: '',
        type: 'Admin',
        status: 'Active'
      });
    }
  }, [user]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user ? {
      ...formData,
      id: user.id
    } : formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {user ? 'Edit User' : 'Add New User'}
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
            {/* <div>
              <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
                Staff ID
              </label>
              <input type="text" id="staffId" name="staffId" value={formData.staffId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div> */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                {userTypes.map(type => <option key={type} value={type}>
                    {type}
                  </option>)}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default UserFormModal;