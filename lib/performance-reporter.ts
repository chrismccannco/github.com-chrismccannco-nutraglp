/**
 * Lightweight Core Web Vitals reporter.
 * Call reportWebVitals() in your layout to start collecting metrics.
 * Uses web-vitals library via CDN or the built-in PerformanceObserver API.
 */

interface MetricPayload {
  url: string;
  path: string;
  deviceType: string;
  connectionType: string;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
  domLoad: number | null;
  pageLoad: number | null;
  transferSize: number | null;
  domElements: number | null;
}

const metrics: Partial<MetricPayload> = {};
let sent = false;

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getConnectionType(): string {
  if (typeof navigator === "undefined") return "";
  const nav = navigator as unknown as { connection?: { effectiveType?: string } };
  return nav.connection?.effectiveType || "";
}

function sendBeacon() {
  if (sent) return;
  if (!metrics.path) return;
  // Only send if we have at least one CWV metric
  if (metrics.lcp == null && metrics.cls == null && metrics.fcp == null) return;

  sent = true;

  const payload: MetricPayload = {
    url: metrics.url || window.location.href,
    path: metrics.path || window.location.pathname,
    deviceType: metrics.deviceType || getDeviceType(),
    connectionType: metrics.connectionType || getConnectionType(),
    lcp: metrics.lcp ?? null,
    fid: metrics.fid ?? null,
    cls: metrics.cls ?? null,
    fcp: metrics.fcp ?? null,
    ttfb: metrics.ttfb ?? null,
    inp: metrics.inp ?? null,
    domLoad: metrics.domLoad ?? null,
    pageLoad: metrics.pageLoad ?? null,
    transferSize: metrics.transferSize ?? null,
    domElements: metrics.domElements ?? null,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/performance/beacon", body);
  } else {
    fetch("/api/performance/beacon", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }
}

function observeMetric(type: string, callback: (entry: PerformanceEntry) => void) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry);
      }
    });
    observer.observe({ type, buffered: true });
  } catch {
    // Observer not supported for this type
  }
}

export function reportWebVitals() {
  if (typeof window === "undefined") return;

  metrics.url = window.location.href;
  metrics.path = window.location.pathname;
  metrics.deviceType = getDeviceType();
  metrics.connectionType = getConnectionType();

  // LCP
  observeMetric("largest-contentful-paint", (entry) => {
    metrics.lcp = Math.round(entry.startTime);
  });

  // FID
  observeMetric("first-input", (entry) => {
    const fidEntry = entry as PerformanceEventTiming;
    metrics.fid = Math.round(fidEntry.processingStart - fidEntry.startTime);
  });

  // CLS
  let clsValue = 0;
  observeMetric("layout-shift", (entry) => {
    const lsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
    if (!lsEntry.hadRecentInput) {
      clsValue += lsEntry.value || 0;
      metrics.cls = Math.round(clsValue * 10000) / 10000;
    }
  });

  // FCP
  observeMetric("paint", (entry) => {
    if (entry.name === "first-contentful-paint") {
      metrics.fcp = Math.round(entry.startTime);
    }
  });

  // Navigation timing (TTFB, DOM load, page load)
  observeMetric("navigation", (entry) => {
    const navEntry = entry as PerformanceNavigationTiming;
    metrics.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);
    metrics.domLoad = Math.round(navEntry.domContentLoadedEventEnd - navEntry.startTime);
    metrics.pageLoad = Math.round(navEntry.loadEventEnd - navEntry.startTime);
    metrics.transferSize = navEntry.transferSize || null;
  });

  // INP (Interaction to Next Paint)
  observeMetric("event", (entry) => {
    const eventEntry = entry as PerformanceEventTiming;
    const duration = eventEntry.duration;
    if (!metrics.inp || duration > metrics.inp) {
      metrics.inp = Math.round(duration);
    }
  });

  // DOM elements count
  setTimeout(() => {
    metrics.domElements = document.querySelectorAll("*").length;
  }, 3000);

  // Send on page hide or before unload
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      sendBeacon();
    }
  });

  window.addEventListener("pagehide", sendBeacon);

  // Fallback: send after 30 seconds
  setTimeout(sendBeacon, 30000);
}
