import analytics from '@react-native-firebase/analytics';

export const AnalyticsService = {
  // Log screen view
  logScreenView: async (screenName: string) => {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  // Log custom event
  logEvent: async (name: string, params?: { [key: string]: any }) => {
    try {
      await analytics().logEvent(name, params);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  // Log conversion
  logConversion: async (
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) => {
    try {
      await analytics().logEvent('conversion', {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount: amount,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  // Set user ID
  setUserId: async (userId: string) => {
    try {
      await analytics().setUserId(userId);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },

  // Set user properties
  setUserProperty: async (name: string, value: string) => {
    try {
      await analytics().setUserProperty(name, value);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },
};
