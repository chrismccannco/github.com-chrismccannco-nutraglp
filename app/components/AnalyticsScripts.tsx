import { getSetting } from "@/lib/cms";

/**
 * Server component that injects GA4 and/or Plausible scripts
 * based on CMS site_settings values.
 * Renders nothing if no tracking IDs are configured.
 */
export default async function AnalyticsScripts() {
  let gaId: string | null = null;
  let plausibleDomain: string | null = null;

  try {
    gaId = await getSetting("ga_measurement_id");
    plausibleDomain = await getSetting("plausible_domain");
  } catch {
    // DB unavailable — skip analytics
    return null;
  }

  const gaIdTrimmed = gaId?.trim() || "";
  const plausibleTrimmed = plausibleDomain?.trim() || "";

  if (!gaIdTrimmed && !plausibleTrimmed) return null;

  return (
    <>
      {gaIdTrimmed && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaIdTrimmed}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaIdTrimmed}');`,
            }}
          />
        </>
      )}
      {plausibleTrimmed && (
        <script
          defer
          data-domain={plausibleTrimmed}
          src="https://plausible.io/js/script.js"
        />
      )}
    </>
  );
}
