import React from "react";
import { Outlet, useLocation, useParams } from "react-router";
import { FaCheck } from "react-icons/fa";

const steps = [
  { label: "Booking Details", path: "" },
  { label: "Payment", path: "payment" },
  { label: "Confirmation", path: "confirmation" },
];

const BookingLayout = () => {
  const { id } = useParams();
  const location = useLocation();

  const currentStep = steps.findIndex((step, index) =>
    location.pathname === `/book/vehicle/${id}/${step.path}` || (index === 0 && location.pathname === `/book/vehicle/${id}`)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="relative flex justify-between items-center mb-12 w-full">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-300"></div>

          <div
            className="absolute top-5 left-0 h-1 bg-orange-500 transition-all duration-300 ease-in-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>

          {steps.map((step, index) => (
            <div key={step.label} className="relative flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold transition-all duration-300
                  ${
                    index < currentStep
                      ? "bg-orange-600" 
                      : index === currentStep
                      ? "bg-orange-500 shadow-lg scale-110" 
                      : "bg-gray-400" 
                  }`}
              >
                {index < currentStep ? <FaCheck className="text-white" /> : index + 1}
              </div>

              <p
                className={`mt-2 text-sm font-medium ${
                  index <= currentStep ? "text-orange-600 font-semibold" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BookingLayout;
