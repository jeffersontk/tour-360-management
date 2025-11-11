export async function detectVR() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const brands = (navigator as any).userAgentData?.brands?.map((b: any) => b.brand).join(" ") || "";

  const isLikelyQuest = /OculusBrowser|Quest/i.test(ua);
  const isLikelyPico  = /PicoBrowser|PicoVR/i.test(ua);
  const isLikelyWolvic = /Wolvic/i.test(ua);           // browser XR da Igalia/Mozilla
  const isLikelySteamVR = /SteamVR/i.test(ua);         // setups PCVR
  const isLikelyWindowsMR = /Windows Mixed Reality/i.test(ua);
  const isLikelySamsungVR = /SamsungBrowser.*(Gear VR|Oculus)/i.test(ua);

  const hasXR = typeof (navigator as any).xr !== "undefined";
  let immersiveVrSupported = false;
  let immersiveArSupported = false;

  try {
    if (hasXR) {
      const xr = (navigator as any).xr;
      immersiveVrSupported = await xr.isSessionSupported("immersive-vr");
      immersiveArSupported = await xr.isSessionSupported?.("immersive-ar");
    }
  } catch {}

  return {
    hasXR,
    immersiveVrSupported,
    immersiveArSupported,
    hints: {
      isLikelyQuest,
      isLikelyPico,
      isLikelyWolvic,
      isLikelySteamVR,
      isLikelyWindowsMR,
      isLikelySamsungVR,
      brands
    }
  };
}
