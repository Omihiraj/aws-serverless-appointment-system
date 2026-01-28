import React, { useEffect, useState } from 'react';
import { X, Plus, XCircle } from 'lucide-react';
import { Treatment } from '../../types/treatment';
interface TreatmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treatment: any) => void;
  treatment?: Treatment | null;
  availableProducts: string[];
}
const TreatmentFormModal: React.FC<TreatmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  treatment,
  availableProducts
}) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    products: [] as string[],
    amount: ''
  });
  useEffect(() => {
    if (treatment) {
      setFormData({
        name: treatment.name,
        duration: treatment.duration,
        products: treatment.products,
        amount: treatment.amount
      });
    } else {
      setFormData({
        name: '',
        duration: '',
        products: [],
        amount: ''
      });
    }
  }, [treatment]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(treatment ? {
      ...formData,
      id: treatment.id
    } : formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };
  const handleAddProduct = (product: string) => {
    if (!formData.products.includes(product)) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, product]
      }));
    }
  };
  const handleRemoveProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p !== product)
    }));
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {treatment ? 'Edit Treatment' : 'Add New Treatment'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Treatment Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required min="1" />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (LKR)
              </label>
              <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required min="1"  />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products Used
              </label>
              <div className="mb-2">
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" onChange={e => handleAddProduct(e.target.value)} value="">
                  <option value="">Select a product to add</option>
                  {availableProducts.filter(product => !formData.products.includes(product)).sort().map(product => <option key={product} value={product}>
                        {product}
                      </option>)}
                </select>
              </div>
              <div className="space-y-2">
                {formData.products.map(product => <div key={product} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{product}</span>
                    <button type="button" onClick={() => handleRemoveProduct(product)} className="text-red-500 hover:text-red-700">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {treatment ? 'Update Treatment' : 'Add Treatment'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default TreatmentFormModal;