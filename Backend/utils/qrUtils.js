import QRCode from 'qrcode';

/**
 * Generate a QR code from the given data
 * @param {string} data - The data to encode in the QR code
 * @returns {Promise<string>} - A promise that resolves to the QR code data URL
 */
export const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export default {
  generateQRCode
}; 