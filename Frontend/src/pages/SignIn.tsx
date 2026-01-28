import React, { useState, useEffect } from "react";
import { Lock, User } from "lucide-react";
import { getInitialDashboardData } from "../apiService/apis/DashboardApis";
import { LoadingPopup } from "../components/loadingSkelotons/LoadingPopup";
import { addProducts } from "../dataStore/slices/productSlice";
import { addTherapists } from "../dataStore/slices/therapistSlice";
import { addTreatments } from "../dataStore/slices/treatmentSlice";
import { addAppointments } from "../dataStore/slices/appointmentSlice";
import { useDispatch } from "react-redux";
import { signIn, getCurrentUser, confirmSignIn } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

interface SignInProps {
  onSignIn: () => void;
}
const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       var user = await getCurrentUser();
  //       console.log("USER", user);
  //       navigate("/dashboard");
  //       setLoading(true);
  //       var val = await signIn({ username, password });
  //       getInitialDashboardData()
  //         .then((res) => {
  //           setLoading(false);
  //           if (res.data.isSuccess) {
  //             var appointmentList = [];
  //             res.data.data.appointments.forEach((appointment: any) => {
  //               appointment.appointmentTreatmentData.forEach(
  //                 (treatment: any) => {
  //                   appointmentList.push({
  //                     id: appointment.id,
  //                     clientId: appointment.clientId,
  //                     clientName: appointment.clientName,
  //                     appointmentStatus: appointment.appointmentStatus,
  //                     assignedTherapist: treatment.assignedTherapist,
  //                     treatmentType: treatment.treatmentType,
  //                     appointmentDateTime: treatment.treatmentStartTime,
  //                   });
  //                 }
  //               );
  //             });
  //             dispatch(addAppointments(appointmentList));
  //             dispatch(addTreatments(res.data.data.treatments));
  //             dispatch(addTherapists(res.data.data.therapists));
  //             dispatch(addProducts(res.data.data.products));

  //             console.log("Dashbord API CALLED : ", res.data.data);

  //             // if (!username || !password) {
  //             //   setError("Please enter both username and password");
  //             //   return;
  //             // }
  //             onSignIn();
  //           }
  //         })
  //         .catch((err) => {
  //           setLoading(false);
  //           console.error("Failed Dashbord API CALLED", err);
  //         });
  //     } catch {}
  //   };

  //   checkAuth();
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //!WARNING THIS FLOW MUST BE CHANGE AFTER AUTH - 1 First Ath 2. GetDashboard (if only auth)

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    try {
      setLoading(true);
      //var val = await signIn({ username, password });
      getInitialDashboardData()
        .then((res) => {
          setLoading(false);
          if (res.data.isSuccess) {
            var appointmentList = [];
            res.data.data.appointments.forEach((appointment: any) => {
              appointment.appointmentTreatmentData.forEach((treatment: any) => {
                appointmentList.push({
                  id: appointment.id,
                  clientId: appointment.clientId,
                  clientName: appointment.clientName,
                  appointmentStatus: appointment.appointmentStatus,
                  assignedTherapist: treatment.assignedTherapist,
                  treatmentType: treatment.treatmentType,
                  appointmentDateTime: treatment.treatmentStartTime,
                });
              });
            });
            dispatch(addAppointments(appointmentList));
            dispatch(addTreatments(res.data.data.treatments));
            dispatch(addTherapists(res.data.data.therapists));
            dispatch(addProducts(res.data.data.products));

            console.log("Dashbord API CALLED : ", res.data.data);

            // if (!username || !password) {
            //   setError("Please enter both username and password");
            //   return;
            // }
            onSignIn();
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Failed Dashbord API CALLED", err);
        });
    } catch (err) {
      setLoading(false);
      setError("Authentication failed. Please try again.");
      return;
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {isLoading == true ? <LoadingPopup /> : <></>}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Derma Plan Academy
          </h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#D4AF37] border border-transparent rounded-md shadow-sm hover:bg-[#B4941F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
