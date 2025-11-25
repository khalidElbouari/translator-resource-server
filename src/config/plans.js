export const PLAN_CONFIG = {
  free: {
    name: "Free",
    quota: {
      translate: 30,
      summarize: 5,
      rewrite: 5,
      "form-assist": 0
    },
    features: {
      translate: { enabled: true },
      summarize: { enabled: true },
      rewrite: { enabled: true },
      "form-assist": { enabled: false },
      "full-page": { enabled: false },
      "pdf-translation": { enabled: false },
      history: { enabled: false }
    }
  },
  premium: {
    name: "Premium",
    quota: {
      translate: null,
      summarize: null,
      rewrite: null,
      "form-assist": null
    },
    features: {
      translate: { enabled: true },
      summarize: { enabled: true },
      rewrite: { enabled: true },
      "form-assist": { enabled: true },
      "full-page": { enabled: true },
      "pdf-translation": { enabled: true },
      history: { enabled: true }
    }
  },
  enterprise: {
    name: "Enterprise",
    quota: {
      translate: null,
      summarize: null,
      rewrite: null,
      "form-assist": null
    },
    features: {
      translate: { enabled: true },
      summarize: { enabled: true },
      rewrite: { enabled: true },
      "form-assist": { enabled: true },
      "full-page": { enabled: true },
      "pdf-translation": { enabled: true },
      history: { enabled: true }
    }
  }
};

export const DEFAULT_PLAN_KEY = "free";
