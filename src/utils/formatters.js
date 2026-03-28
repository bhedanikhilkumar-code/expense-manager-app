/**
 * Formats a number into Indian Rupee (INR) currency format.
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    // Fallback if Intl is not supported
    return '₹' + Math.floor(amount).toLocaleString('en-IN');
  }
};

/**
 * Formats a date string into a readable format.
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Today';
    }
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
  } catch (e) {
    // Fallback simple date format
    return String(dateString).split('T')[0];
  }
};
