import { performance } from 'perf_hooks';

export const PerformanceService = {
  // Measure component render time
  measureRender: (componentName: string, callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;

    if (duration > 100) {
      console.warn(
        `[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`
      );
    }

    return duration;
  },

  // Track async operation
  trackAsync: async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;

      console.log(
        `[Performance] ${operationName} completed in ${duration.toFixed(2)}ms`
      );
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      console.error(
        `[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`,
        error
      );
      throw error;
    }
  },

  // Measure memory usage (if available)
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const perfMemory = (performance as any).memory;
      if (perfMemory) {
        return {
          usedJSHeapSize: perfMemory.usedJSHeapSize,
          totalJSHeapSize: perfMemory.totalJSHeapSize,
          jsHeapSizeLimit: perfMemory.jsHeapSizeLimit,
        };
      }
    }
    return null;
  },

  // Log performance metrics
  logMetrics: (metrics: { [key: string]: number }) => {
    console.log('[Performance Metrics]', metrics);
  },
};
