"use client";

import { useEffect, useState } from "react";

export interface CmsBranding {
  name: string;
  logoLetter: string;
  accentColor: string;
}

const DEFAULTS: CmsBranding = {
  name: "ContentFoundry",
  logoLetter: "F",
  accentColor: "#0D1117",
};

let cachedBranding: CmsBranding | null = null;

export function useCmsBranding(): CmsBranding {
  const [branding, setBranding] = useState<CmsBranding>(cachedBranding || DEFAULTS);

  useEffect(() => {
    if (cachedBranding) return;

    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((data) => {
        const b: CmsBranding = {
          name: data.cms_name || DEFAULTS.name,
          logoLetter: data.cms_logo_letter || (data.cms_name ? data.cms_name[0].toUpperCase() : DEFAULTS.logoLetter),
          accentColor: data.cms_accent_color || DEFAULTS.accentColor,
        };
        cachedBranding = b;
        setBranding(b);
      })
      .catch(() => {
        // Use defaults on error
      });
  }, []);

  return branding;
}
