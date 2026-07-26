// Analytics service stub - Firebase Analytics disabled
export const AnalyticsService = {
  // Log screen view
  logScreenView: async (screenName: string) => {
    console.log('Analytics: Screen view', screenName);
  },

  // Log custom event
  logEvent: async (name: string, params?: { [key: string]: any }) => {
    console.log('Analytics: Event', name, params);
  },

  // Log conversion
  logConversion: async (
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) => {
    console.log('Analytics: Conversion', { fromCurrency, toCurrency, amount });
  },

  // Set user ID
  setUserId: async (userId: string) => {
    console.log('Analytics: Set user ID', userId);
  },

  // Set user properties
  setUserProperty: async (name: string, value: string) => {
    console.log('Analytics: Set user property', name, value);
  },
};
