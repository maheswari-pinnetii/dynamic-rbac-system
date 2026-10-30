/**
 * Human-Centric Formatting Utilities for Natural Dates, Friendly Money, and Warm Greetings
 */

export const getHumanGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options,
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Natural conversational relative time
 */
export const timeAgo = (dateString) => {
  if (!dateString) return 'just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 45) return 'just a moment ago';
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;

  return formatDate(dateString, { hour: undefined, minute: undefined });
};

/**
 * Human-Friendly Stock & Supply Status
 */
export const getHumanStockStatus = (stock) => {
  const qty = Number(stock) || 0;
  if (qty === 0) {
    return {
      label: 'Needs Restocking',
      tone: 'danger',
      description: 'Currently zero units on hand',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }
  if (qty <= 10) {
    return {
      label: `Low Supply (${qty} left)`,
      tone: 'warning',
      description: 'Running low, recommend reordering soon',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  return {
    label: `In Good Hands (${qty} available)`,
    tone: 'success',
    description: 'Generous inventory ready for delivery',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
};
