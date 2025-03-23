/**
 * Email utility for sending emails
 * Note: This is a simplified version for development.
 * In production, you would integrate with a real email service like Nodemailer, SendGrid, etc.
 */

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email text content
 * @param {string} [options.html] - Email HTML content (optional)
 * @returns {Promise<void>}
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  // In development, just log the email
  console.log('-------------------------');
  console.log('EMAIL SENDING SIMULATION');
  console.log('-------------------------');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  if (html) {
    console.log(`HTML: ${html}`);
  }
  console.log('-------------------------');
  
  // Return a resolved promise to simulate successful email sending
  return Promise.resolve();
}; 