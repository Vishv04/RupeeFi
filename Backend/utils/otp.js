/**
 * OTP utility for generating one-time passwords
 */

/**
 * Generate a random numeric OTP of specified length
 * @param {number} [length=6] - Length of the OTP
 * @returns {string} - Generated OTP
 */
export const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}; 