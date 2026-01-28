import React, { useState,useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, PlusIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AppointmentCalendar from '../components/AppointmentCalendar';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import ClientProfilesPage from './ClientProfilesPage';
import AppointmentsHistoryPage from './AppointmentsHistoryPage';
import ManageTherapistsPage from './ManageTherapistsPage';
import ManageStoresPage from './ManageStoresPage';
import ManageUsersPage from './ManageUsersPage';
import TreatmentProfilePage from './TreatmentProfilePage';
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";


const initialClients = [{
  id: 'client-1',
  name: 'Jane Doe',
  mobile: '555-123-4567',
  dob: '1985-06-15',
  medicalHistory: 'No allergies'
}, {
  id: 'client-2',
  name: 'John Smith',
  mobile: '555-987-6543',
  dob: '1990-03-22',
  medicalHistory: 'Allergic to certain oils'
}, {
  id: 'client-3',
  name: 'Alice Johnson',
  mobile: '555-456-7890',
  dob: '1978-11-30',
  medicalHistory: 'Back pain issues'
}];
const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState(initialClients);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const location = useLocation();
  const isRootPath = location.pathname === "/dashboard";
  console.log(location.pathname,isRootPath);
  
  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
  };
  const handleUpdateAppointment = (updatedAppointment: Appointment) => {


    console.log("UpdatedUppointment",updatedAppointment)
    setAppointments(appointments.map(apt => apt.id === updatedAppointment.id ? apt.status=updatedAppointment.status : apt));
  };

  const treatments = useSelector((state) => state.treatment);
  const loadedAppointments = useSelector((state) => state.appointment);

  console.log("LOADED APOINTMENTS",loadedAppointments);
  console.log("LOADED TREATMENTS",treatments);

  useEffect(() => {
    if (!loadedAppointments || loadedAppointments.length === 0) return;
    console.log("MODIFIED APPOINTMENTS","2",loadedAppointments);

    const modifiedAppointments = loadedAppointments.map(appointment => ({
          id: appointment.id,
          clientName: appointment.clientName,
          treatment: appointment.treatmentType,
          date: new Date(new Date(appointment.appointmentDateTime).toLocaleString("en-US", { timeZone: "Asia/Colombo" })),
          therapist: appointment.assignedTherapist,
          status: appointment.appointmentStatus.toLowerCase()
        }));
      console.log("MODIFIED APPOINTMENTS","+++++",modifiedAppointments);
    setAppointments(modifiedAppointments);
   
  }, [loadedAppointments]);

 

  return <div className="flex h-screen bg-gray-100">
      <Sidebar isMobileOpen={isMobileOpen} toggleMobileSidebar={toggleMobileSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button className="p-1 mr-3 rounded-md lg:hidden hover:bg-gray-200" onClick={toggleMobileSidebar}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            {/* <button onClick={() => setIsAppointmentModalOpen(true)} className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create New Appointment
            </button> */}
            {isRootPath && (
  <button
    onClick={() => setIsAppointmentModalOpen(true)}
    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <PlusIcon className="w-4 h-4 mr-2" />
    Create New Appointment
  </button>
)}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<div className="h-full">
                  <AppointmentCalendar appointments={appointments} onAppointmentClick={handleAppointmentClick} onUpdateAppointment={handleUpdateAppointment} />
                </div>} />
            <Route path="/clients" element={<ClientProfilesPage clients={clients} />} />
            <Route path="/appointments" element={<AppointmentsHistoryPage appointments={appointments} />} />
            <Route path="/therapists" element={<ManageTherapistsPage />} />
            <Route path="/users" element={<ManageUsersPage />} />
            <Route path="/stores" element={<ManageStoresPage />} />
            <Route path="/reports" element={<div>Reports</div>} />
            <Route path="/activity" element={<div>Activity Log</div>} />
            <Route path="/treatments" element={<TreatmentProfilePage />} />
          </Routes>
        </main>
      </div>
      <CreateAppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)}  existingClients={clients} />
    </div>;
};
export default Dashboard;