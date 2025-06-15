import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaGooglePay,
  FaPaypal, FaCcVisa, FaCcMastercard, FaCcAmex, FaApplePay,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { paymentProcess, } from "../../slices/Payment/paymentSlice";
import { userCancleBooking } from "../../slices/Booking/BookingSlice";

const allMethods = [
  { label: "Credit Card", value: "card", icon: <FaCreditCard /> },
  { label: "UPI", value: "UPI", icon: <FaMobileAlt /> },
  { label: "Cash", value: "cash", icon: <FaMoneyBillWave /> },
];

const upiProviders = [
  { name: "Google Pay", icon: <FaGooglePay />, id: "Google Pay" },
  { name: "PhonePe", icon: <FaMobileAlt />, id: "PhonePe" },
  { name: "Paytm", icon: <FaPaypal />, id: "Paytm" },
];

const cardProviders = [FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal, FaApplePay];

const PaymentPage = () => {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isUserAuthenticated } = useSelector((state) => state.auth);
  const { status, formError } = useSelector((state) => state.payment);
  const { bookingDetails } = useSelector((state) => state.booking);

  const [mainMethod, setMainMethod] = useState("");
  const [subMethod, setSubMethod] = useState("");
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(600); 
  const [showPaymentExpiredPopup, setShowPaymentExpiredPopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (!bookingDetails) {
      navigate("/");
    }
  }, [bookingDetails, navigate]);

  useEffect(() => {
    if (!isUserAuthenticated) {
      setShowLoginPopup(true);
    }
  }, [isUserAuthenticated]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setShowPaymentExpiredPopup(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
const availableMethods =
    mainMethod === "cash" ? allMethods.filter((m) => m.value !== "cash") : allMethods.filter((m) => m.value !== "cash");
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "Do you really want to leave? Your booking will be canceled.";
        setShowExitPopup(true);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handleBeforeUnload);
      };
    }, []);

  const advancePayment = Math.floor(bookingDetails?.priceDetails?.totalPrice * 0.3) || 0;
  const fullPayment = bookingDetails?.priceDetails?.totalPrice || 0;

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "", expiryDate: "", cvv: "", upiId: upiProviders[0].id,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!mainMethod) {
      setError("Please select a payment method.");
      return;
    }

    let processedBy = "Bank Transfer";
    if (mainMethod === "cash") {
      processedBy = "Cash";
    } else if (mainMethod === "UPI") {
      const selectedUPI = upiProviders.find((provider) => provider.id === paymentDetails.upiId);
      processedBy = selectedUPI ? selectedUPI.name : "UPI";
    }

    const paymentData = {
      bookingId: bookingDetails._id,
      isInCash: mainMethod === "cash",
      method: mainMethod === "cash" ? subMethod : mainMethod,
      amount: mainMethod === "cash" ? advancePayment : fullPayment,
      processedBy,
    };

    dispatch(paymentProcess(paymentData));
  };

  if (status === "procceed") {
    setTimeout(() => navigate(`/book/vehicle/${bookingDetails?.vehicle}/confirmation`), 1000);
  }

  const handleCancelBooking = () => {
    dispatch(userCancleBooking({id:bookingDetails._id,reason:null}));
    navigate("/");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Payment</h2>

      <p className="text-lg text-gray-700 font-semibold">
        Payment Time Left: <span className="text-red-500 font-bold">{Math.floor(countdown / 60)}:{countdown % 60}</span>
      </p>

      <p className="text-lg text-gray-700 font-semibold">
        {mainMethod === "cash" ? "Advance Payment Required:" : "Total Amount:"}
        <span className="text-orange-500 font-bold"> ₹{mainMethod === "cash" ? advancePayment : fullPayment}</span>
      </p>
      <h3 className="text-xl font-semibold mt-6 text-orange-600">How Would You Like to Pay?</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {allMethods.map((method) => (
          <button
            key={method.value}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
              mainMethod === method.value ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-300 hover:border-orange-500"
            }`}
            onClick={() => {
              setMainMethod(method.value);
              setSubMethod("");
            }}
          >
            <span className="text-2xl">{method.icon}</span>
            <span className="text-sm mt-2">{method.label}</span>
          </button>
        ))}
      </div>

      {mainMethod === "cash" && (
        <>
          <h3 className="text-lg font-semibold mt-6 text-orange-600">Select Advance Payment Method</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {availableMethods.map((method) => (
              <button
                key={method.value}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  subMethod === method.value ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-300 hover:border-orange-500"
                }`}
                onClick={() => setSubMethod(method.value)}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-sm mt-2">{method.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {(subMethod || mainMethod !== "cash") && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          {subMethod === "card" || mainMethod === "card" ? (
            <>
              <h3 className="text-lg font-semibold text-orange-600 mb-3">Enter Card Details</h3>
              <div className="flex justify-between mb-3 text-3xl text-gray-500">
                {cardProviders.map((Icon, index) => (
                  <Icon key={index} className="text-orange-500" />
                ))}
              </div>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full p-3 border rounded mb-3 focus:ring-2 focus:ring-orange-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          ) : null}

          {subMethod === "UPI" || mainMethod === "UPI" ? (
            <>
              <h3 className="text-lg font-semibold text-orange-600 mb-3">Select UPI Provider</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {upiProviders.map((provider) => (
                  <button
                    key={provider.name}
                    className={`flex items-center justify-center p-2 rounded-lg border-2 transition-all ${
                      paymentDetails.upiId === provider.id ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-300 hover:border-orange-500"
                    }`}
                    onClick={() => setPaymentDetails((prev) => ({ ...prev, upiId: provider.id }))}
                  >
                    <span className="text-2xl">{provider.icon}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
      <button onClick={handlePayment} disabled={status === "processing"} className="mt-6 w-full p-3 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700">
        {status === "processing" ? "Processing..." : "Pay Now"}
      </button>

      {showPaymentExpiredPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Payment Session Expired</h3>
            <p className="text-gray-600 mb-4">Please try booking again.</p>
            <button onClick={handleCancelBooking} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">
              Close
            </button>
          </div>
        </div>
      )}

      {showExitPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-4">Leaving this page will cancel your booking.</p>
            <button onClick={handleCancelBooking} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">
              Yes, Cancel Booking
            </button>
            <button onClick={() => setShowExitPopup(false)} className="ml-3 bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700">
              Stay on Page
            </button>
          </div>
        </div>
      )}

      {showLoginPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <h3 className="text-xl font-semibold text-red-600 mb-4">You are not logged in</h3>
            <p className="text-gray-600 mb-4">Please log in to continue.</p>
            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
