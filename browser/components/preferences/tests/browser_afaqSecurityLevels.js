"use strict";

add_setup(function () {
  registerCleanupFunction(() => {
    for (let pref of [
      "afaq.security.level",
      "afaq.security.lastAppliedLevel",
      "afaq.security.webrtcMode",
      "afaq.security.compatibilityMode",
      "network.trr.mode",
      "network.dns.disablePrefetch",
      "browser.urlbar.speculativeConnect.enabled",
      "dom.security.https_only_mode",
      "browser.safebrowsing.malware.enabled",
      "browser.safebrowsing.phishing.enabled",
      "browser.safebrowsing.downloads.enabled",
      "browser.safebrowsing.downloads.remote.block_potentially_unwanted",
      "browser.safebrowsing.downloads.remote.block_uncommon",
      "privacy.query_stripping.enabled",
      "privacy.resistFingerprinting.letterboxing",
      "media.peerconnection.enabled",
      "browser.contentblocking.category",
      "dom.event.clipboardevents.enabled",
      "pdfjs.enableScripting",
      "webgl.disabled",
    ]) {
      Services.prefs.clearUserPref(pref);
    }
  });
});

add_task(async function test_afaq_security_level_controls() {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["afaq.security.level", "hardened"],
      ["afaq.security.lastAppliedLevel", "hardened"],
      ["afaq.security.webrtcMode", "disabled"],
      ["afaq.security.compatibilityMode", "balanced"],
      ["network.trr.mode", 2],
      ["network.dns.disablePrefetch", true],
      ["browser.urlbar.speculativeConnect.enabled", false],
      ["dom.security.https_only_mode", true],
      ["browser.safebrowsing.malware.enabled", false],
      ["browser.safebrowsing.phishing.enabled", false],
      ["browser.safebrowsing.downloads.enabled", false],
      ["browser.safebrowsing.downloads.remote.block_potentially_unwanted", false],
      ["browser.safebrowsing.downloads.remote.block_uncommon", false],
      ["dom.maxHardwareConcurrency", 2],
      ["dom.maxtouchpoints.testing.value", 0],
      ["dom.w3c_touch_events.enabled", 0],
      ["intl.accept_languages", "en-US, en"],
      ["layout.css.font-visibility", 1],
      ["layout.css.font-visibility.trackingprotection", 1],
      ["network.http.referer.defaultPolicy.trackers", 0],
      ["network.http.referer.defaultPolicy.trackers.pbmode", 0],
      ["network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation", true],
      ["network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation", true],
      ["network.http.referer.sendFromRefresh", false],
      [
        "privacy.resistFingerprinting.letterboxing.dimensions",
        "1280x720, 1366x768, 1400x900, 1440x900, 1600x900, 1920x900",
      ],
      ["privacy.resistFingerprinting.randomization.canvas.use_siphash", true],
      [
        "privacy.fingerprintingProtection.overrides",
        "+CanvasRandomization,+CanvasImageExtractionPrompt,+CanvasExtractionBeforeUserInputIsBlocked,+CanvasExtractionFromThirdPartiesIsBlocked",
      ],
      ["privacy.spoof_english", 2],
    ],
  });

  await openPreferencesViaOpenPreferencesAPI("panePrivacy", {
    leaveOpen: true,
  });

  let document = gBrowser.contentDocument;
  let level = document.getElementById("afaqSecurityLevel");
  let summary = document.getElementById("afaqSecurityLevelDescription");
  let warning = document.getElementById("afaqSecurityLevelWarning");
  let dohMode = document.getElementById("afaqSecurityDohMode");
  let webRtcMode = document.getElementById("afaqSecurityWebRTCMode");
  let remoteSafety = document.getElementById("afaqSecurityRemoteSafety");
  let networkSummary = document.getElementById("afaqSecurityNetworkSummary");
  let diagnosticsSummary = document.getElementById(
    "afaqSecurityDiagnosticsSummary"
  );
  let diagnosticsWebRtcExpectation = document.getElementById(
    "afaqSecurityDiagnosticsWebRTCExpectation"
  );
  let compatibilityMode = document.getElementById(
    "afaqSecurityCompatibilityMode"
  );
  let restoreDefaults = document.getElementById("afaqSecurityRestoreDefaults");
  let compatibilitySummary = document.getElementById(
    "afaqSecurityCompatibilitySummary"
  );

  is(level.value, "hardened", "Hardened is the default Afaq security level");
  is(dohMode.value, "2", "Mullvad DNS with fallback is the default DoH mode");
  is(webRtcMode.value, "disabled", "Disabled WebRTC is the hardened default");
  is(compatibilityMode.value, "balanced", "Balanced compatibility is the hardened default");
  ok(!remoteSafety.checked, "Remote safety checks stay off by default");
  await BrowserTestUtils.waitForCondition(
    () => summary.textContent.includes("recommended default"),
    "The hardened summary should be visible"
  );
  await BrowserTestUtils.waitForCondition(
    () => networkSummary.textContent.includes("Mullvad DNS with fallback"),
    "The network summary should describe the DoH posture"
  );
  await BrowserTestUtils.waitForCondition(
    () => compatibilitySummary.textContent.includes("profile balanced"),
    "The compatibility summary should describe the hardened default"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsSummary.textContent.includes("WebRTC policy disabled"),
    "The diagnostics summary should describe the active WebRTC posture"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsSummary.textContent.includes("locale spoofing English"),
    "The diagnostics summary should describe locale spoofing"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsSummary.textContent.includes("font visibility base"),
    "The diagnostics summary should describe restricted font visibility"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsSummary.textContent.includes("canvas extraction prompted"),
    "The diagnostics summary should describe canvas extraction protection"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsSummary.textContent.includes("max hardware concurrency 2"),
    "The diagnostics summary should describe hardware normalization"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsSummary.textContent.includes("touch exposure off"),
    "The diagnostics summary should describe touch suppression"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsWebRtcExpectation.textContent.includes("may stay on checking"),
    "The diagnostics detail should explain disabled WebRTC leak-test behavior"
  );
  ok(warning.hidden, "Maximum warning is hidden for hardened mode");

  level.value = "maximum";
  level.dispatchEvent(new Event("command", { bubbles: true }));

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getStringPref("afaq.security.level", "") == "maximum",
    "Maximum should be written to the Afaq security level pref"
  );
  await BrowserTestUtils.waitForCondition(
    () =>
      Services.prefs.getStringPref("afaq.security.lastAppliedLevel", "") ==
      "maximum",
    "The security service should apply the maximum level"
  );
  await BrowserTestUtils.waitForCondition(
    () => !warning.hidden,
    "Maximum mode should show a visible warning"
  );
  ok(
    Services.prefs.getBoolPref("webgl.disabled", false),
    "Maximum should disable WebGL"
  );
  is(
    Services.prefs.getStringPref("afaq.security.webrtcMode", ""),
    "disabled",
    "Maximum should switch WebRTC mode to disabled"
  );
  ok(
    Services.prefs.getBoolPref("dom.security.https_only_mode", false),
    "Maximum should force HTTPS-only mode in normal windows"
  );

  level.value = "standard";
  level.dispatchEvent(new Event("command", { bubbles: true }));

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getStringPref("afaq.security.level", "") == "standard",
    "Standard should be written to the Afaq security level pref"
  );
  await BrowserTestUtils.waitForCondition(
    () =>
      Services.prefs.getStringPref("afaq.security.lastAppliedLevel", "") ==
      "standard",
    "The security service should apply the standard level"
  );
  await BrowserTestUtils.waitForCondition(
    () => warning.hidden,
    "Maximum warning should hide again"
  );
  ok(
    !Services.prefs.getBoolPref("webgl.disabled", true),
    "Standard should keep WebGL enabled"
  );
  is(
    Services.prefs.getStringPref("afaq.security.webrtcMode", ""),
    "protected",
    "Standard should restore protected WebRTC"
  );
  ok(
    Services.prefs.getBoolPref("dom.security.https_only_mode", false),
    "Standard should keep HTTPS-only enabled in normal windows"
  );

  dohMode.value = "0";
  dohMode.dispatchEvent(new Event("command", { bubbles: true }));

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getIntPref("network.trr.mode", 99) == 0,
    "The custom DoH menu should write the selected mode"
  );

  Services.prefs.setBoolPref("webgl.disabled", true);
  Services.prefs.setStringPref("afaq.security.webrtcMode", "disabled");
  restoreDefaults.click();

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getIntPref("network.trr.mode", 99) == 2,
    "Restoring defaults should reapply the level DoH mode"
  );
  ok(
    !Services.prefs.getBoolPref("webgl.disabled", true),
    "Restoring defaults should re-enable WebGL for hardened mode"
  );
  ok(
    !Services.prefs.getBoolPref("media.peerconnection.enabled", true),
    "Restoring defaults should disable WebRTC for hardened mode"
  );
  is(
    Services.prefs.getStringPref("afaq.security.webrtcMode", ""),
    "disabled",
    "Restoring defaults should restore disabled WebRTC mode"
  );
  ok(
    Services.prefs.getBoolPref("dom.security.https_only_mode", false),
    "Restoring defaults should keep HTTPS-only enabled for hardened mode"
  );

  webRtcMode.value = "disabled";
  webRtcMode.dispatchEvent(new Event("command", { bubbles: true }));

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getStringPref("afaq.security.webrtcMode", "") == "disabled",
    "The WebRTC menu should update the Afaq WebRTC mode pref"
  );
  ok(
    !Services.prefs.getBoolPref("media.peerconnection.enabled", true),
    "Disabling WebRTC from the menu should disable the underlying WebRTC pref"
  );
  await BrowserTestUtils.waitForCondition(
    () => diagnosticsWebRtcExpectation.textContent.includes("may stay on checking"),
    "Disabled WebRTC should keep the diagnostics expectation in sync"
  );

  Services.prefs.setIntPref("network.trr.mode", 2);
  Services.prefs.setIntPref("network.cookie.cookieBehavior", 5);
  Services.prefs.setBoolPref("privacy.query_stripping.enabled", true);
  compatibilityMode.value = "troubleshoot";
  compatibilityMode.dispatchEvent(new Event("command", { bubbles: true }));

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getIntPref("network.trr.mode", 99) == 0,
    "Troubleshoot profile should disable secure DNS"
  );
  is(
    Services.prefs.getStringPref("afaq.security.compatibilityMode", ""),
    "troubleshoot",
    "Compatibility profile should update the stored compatibility mode"
  );
  ok(
    Services.prefs.getIntPref("network.cookie.cookieBehavior", 0) == 4,
    "Troubleshoot profile should relax cross-site cookie handling"
  );
  ok(
    !Services.prefs.getBoolPref("privacy.query_stripping.enabled", true),
    "Troubleshoot profile should disable query stripping"
  );
  ok(
    Services.prefs.getBoolPref("dom.security.https_only_mode", false),
    "Troubleshoot profile should keep HTTPS-only enabled"
  );

  remoteSafety.click();

  await BrowserTestUtils.waitForCondition(
    () => Services.prefs.getBoolPref("browser.safebrowsing.phishing.enabled"),
    "Remote safety checks should enable phishing protection"
  );
  ok(
    Services.prefs.getBoolPref("browser.safebrowsing.malware.enabled"),
    "Remote safety checks should enable malware protection"
  );

  BrowserTestUtils.removeTab(gBrowser.selectedTab);
  await SpecialPowers.popPrefEnv();
});
