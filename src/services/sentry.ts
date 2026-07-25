import * as Sentry from '@sentry/react-native';

export const SentryService = {
  init: () => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN || 'YOUR_SENTRY_DSN',
      tracesSampleRate: 1.0,
      environment: __DEV__ ? 'development' : 'production',
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
    });
  },

  captureException: (error: Error) => {
    Sentry.captureException(error);
  },

  captureMessage: (
    message: string,
    level: 'info' | 'warning' | 'error' = 'info'
  ) => {
    Sentry.captureMessage(message, level);
  },

  setUser: (user: { id?: string; email?: string; username?: string }) => {
    Sentry.setUser(user);
  },

  clearUser: () => {
    Sentry.setUser(null);
  },

  addBreadcrumb: (breadcrumb: {
    message?: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
  }) => {
    Sentry.addBreadcrumb(breadcrumb);
  },
};
