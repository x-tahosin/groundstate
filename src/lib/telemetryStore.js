/**
 * GroundState — Server-Side Telemetry Store
 * 
 * Records actual operational telemetry for DigitalOcean Serverless Inference.
 * Strictly measures real monotonic timings, real token usage, and real outcomes.
 * Never invents or hardcodes fake numbers.
 */

// In-memory ring buffer holding last 50 requests
const telemetryHistory = [];
const MAX_HISTORY = 50;

/**
 * Record a single inference event
 * @param {Object} entry
 */
export function recordInferenceTelemetry(entry) {
  telemetryHistory.unshift({
    id: `inf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...entry,
  });

  if (telemetryHistory.length > MAX_HISTORY) {
    telemetryHistory.pop();
  }
}

/**
 * Get aggregated telemetry metrics
 * @returns {Object}
 */
export function getTelemetrySummary() {
  const totalCalls = telemetryHistory.length;
  if (totalCalls === 0) {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatencyMs: 0,
      totalTokens: 0,
      recentHistory: [],
    };
  }

  let totalLatency = 0;
  let totalTokens = 0;
  let successCount = 0;
  let failureCount = 0;

  for (const item of telemetryHistory) {
    totalLatency += item.durationMs || 0;
    totalTokens += item.tokens?.total || 0;
    if (item.outcome === 'success') {
      successCount++;
    } else {
      failureCount++;
    }
  }

  return {
    totalRequests: totalCalls,
    successfulRequests: successCount,
    failedRequests: failureCount,
    averageLatencyMs: Math.round(totalLatency / totalCalls),
    totalTokens,
    recentHistory: telemetryHistory.slice(0, 10),
  };
}

/**
 * Reset telemetry history (primarily for automated testing)
 */
export function resetTelemetryStore() {
  telemetryHistory.length = 0;
}
