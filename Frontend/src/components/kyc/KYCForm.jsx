import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCamera, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';

const KYCForm = ({ onKYCComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    contactNumber: '',
    signature: null,
    facialData: null,
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Validation functions
  const validateAadhaar = (number) => {
    return /^\d{12}$/.test(number);
  };

  const validatePAN = (number) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number);
  };

  const validatePhone = (number) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, signature: file }));
      setErrors(prev => ({ ...prev, signature: '' }));
    } else {
      setErrors(prev => ({ ...prev, signature: 'Please upload a valid image file' }));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      setErrors(prev => ({ ...prev, facialData: 'Failed to access camera' }));
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      setFormData(prev => ({ ...prev, facialData: blob }));
      setErrors(prev => ({ ...prev, facialData: '' }));
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    const newErrors = {};
    if (!formData.aadhaarNumber || !validateAadhaar(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Please enter a valid 12-digit Aadhaar number';
    }
    if (!formData.panNumber || !validatePAN(formData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }
    if (!formData.contactNumber || !validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.signature) {
      newErrors.signature = 'Please upload your signature';
    }
    if (!formData.facialData) {
      newErrors.facialData = 'Please capture your facial data';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // First test if KYC routes are accessible
      // try {
      //   console.log('Testing KYC routes...');
      //   const testResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/kyc/test`);
      //   console.log('KYC routes test response:', testResponse.data);
      // } catch (testError) {
      //   console.error('Error testing KYC routes:', testError);
      //   // Continue anyway to see the specific error with the main request
      // }
      
      const formDataToSend = new FormData();
      
      console.log('Preparing form data for submission:', Object.keys(formData));
      
      // Append text fields
      formDataToSend.append('aadhaarNumber', formData.aadhaarNumber);
      formDataToSend.append('panNumber', formData.panNumber);
      formDataToSend.append('contactNumber', formData.contactNumber);
      
      // Append files
      if (formData.signature) {
        console.log('Appending signature file:', formData.signature.name);
        formDataToSend.append('signature', formData.signature);
      }
      
      if (formData.facialData) {
        // Convert base64 to blob if needed
        if (typeof formData.facialData === 'string' && formData.facialData.startsWith('data:')) {
          const response = await fetch(formData.facialData);
          const blob = await response.blob();
          console.log('Converting facial data from base64 to blob');
          formDataToSend.append('facialData', blob, 'facial.jpg');
        } else {
          console.log('Appending facial data file');
          formDataToSend.append('facialData', formData.facialData);
        }
      }
      console.log("user",user);
      console.log("boom:",formDataToSend);
      console.log('Submitting KYC details to:', `${import.meta.env.VITE_API_URL}/api/kyc/details`);
      // Send KYC details
      try {
        const kycResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/kyc/details`,
          formDataToSend,
          user,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        console.log('KYC submission response:', kycResponse.data);
        
        // Send OTP
        console.log('Sending OTP request');
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/kyc/send-otp`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setOtpSent(true);
        setShowOTPInput(true);
        setStep(2);
      } catch (submitError) {
        console.error('Error submitting KYC details:', submitError);
        console.error('Response data:', submitError.response?.data);
        console.error('Status code:', submitError.response?.status);
        throw submitError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error('KYC Submission Error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to submit KYC details';
      if (error.response?.status === 404) {
        errorMessage = 'KYC submission endpoint not found. Please contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kyc/verify-otp`,
        { otp: formData.otp },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        onKYCComplete();
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        otp: error.response?.data?.message || 'Invalid OTP'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complete Your KYC</h2>
        <p className="text-gray-600 mt-2">Please provide the following details to complete your KYC process</p>
      </div>

      {!showOTPInput ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aadhaar Card Number
            </label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.aadhaarNumber ? 'border-red-500' : ''
              }`}
              placeholder="Enter 12-digit Aadhaar number"
            />
            {errors.aadhaarNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.aadhaarNumber}</p>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.panNumber ? 'border-red-500' : ''
              }`}
              placeholder="Enter PAN number (e.g., ABCDE1234F)"
            />
            {errors.panNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.contactNumber ? 'border-red-500' : ''
              }`}
              placeholder="Enter 10-digit mobile number"
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
            )}
          </div>

          {/* Signature Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Signature
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="hidden"
                id="signature-upload"
              />
              <label
                htmlFor="signature-upload"
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaUpload className="inline-block mr-2" />
                Upload Signature
              </label>
              {formData.signature && (
                <span className="text-green-600">
                  <FaCheck className="inline-block mr-1" />
                  Signature uploaded
                </span>
              )}
            </div>
            {errors.signature && (
              <p className="mt-1 text-sm text-red-600">{errors.signature}</p>
            )}
          </div>

          {/* Facial Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Facial Data
            </label>
            <div className="mt-1 space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
                style={{ display: formData.facialData ? 'none' : 'block' }}
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaCamera className="inline-block mr-2" />
                  Start Camera
                </button>
                <button
                  type="button"
                  onClick={captureImage}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Capture Photo
                </button>
              </div>
              {formData.facialData && (
                <span className="text-green-600">
                  <FaCheck className="inline-block mr-1" />
                  Photo captured
                </span>
              )}
            </div>
            {errors.facialData && (
              <p className="mt-1 text-sm text-red-600">{errors.facialData}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit KYC Details'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.otp ? 'border-red-500' : ''
              }`}
              placeholder="Enter the OTP sent to your email"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {errors.submit && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}
    </div>
  );
};

export default KYCForm; 