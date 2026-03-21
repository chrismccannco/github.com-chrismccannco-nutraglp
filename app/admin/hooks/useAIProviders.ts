"use client";

import { useState, useEffect } from "react";

export interface AIProviderOption {
  id: string;
  label: string;
  model: string;
}

export function useAIProviders() {
  const [providers, setProviders] = useState<AIProviderOption[]>([]);
  const [defaultProvider, setDefaultProvider] = useState<string>("anthropic");
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  useEffect(() => {
    fetch("/api/ai/providers")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.providers)) {
          setProviders(d.providers);
          setDefaultProvider(d.defaultProvider || "anthropic");
          setSelectedProvider(d.defaultProvider || "anthropic");
        }
      })
      .catch(() => {});
  }, []);

  const selectedOption = providers.find((p) => p.id === selectedProvider);

  return {
    providers,
    defaultProvider,
    selectedProvider,
    setSelectedProvider,
    selectedModel: selectedOption?.model,
    // Only pass overrides when the user has chosen something other than default
    providerOverride: selectedProvider !== defaultProvider ? selectedProvider : undefined,
    modelOverride: undefined as string | undefined,
  };
}
