/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const { AfaqSecurityLevelService } = ChromeUtils.importESModule(
  "resource:///modules/AfaqSecurityLevelService.sys.mjs"
);

const AFAQ_SECURITY_PREFS = [
  "afaq.security.level",
  "afaq.security.webrtcMode",
  "afaq.security.compatibilityMode",
  "afaq.security.initialized",
  "afaq.security.lastAppliedLevel",
];

const MANAGED_PREFS = [
  "beacon.enabled",
  "browser.send_pings",
  "browser.send_pings.require_same_host",
  "browser.urlbar.speculativeConnect.enabled",
  "dom.maxHardwareConcurrency",
  "dom.maxtouchpoints.testing.value",
  "dom.w3c_touch_events.enabled",
  "intl.accept_languages",
  "layout.css.font-visibility",
  "layout.css.font-visibility.trackingprotection",
  "media.peerconnection.enabled",
  "media.peerconnection.ice.default_address_only",
  "media.peerconnection.ice.no_host",
  "network.cookie.cookieBehavior",
  "network.cookie.cookieBehavior.pbmode",
  "network.http.referer.defaultPolicy.trackers",
  "network.http.referer.defaultPolicy.trackers.pbmode",
  "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation",
  "network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation",
  "network.http.referer.sendFromRefresh",
  "network.http.referer.XOriginPolicy",
  "network.http.referer.XOriginTrimmingPolicy",
  "network.predictor.enabled",
  "permissions.default.screen-wake-lock",
  "permissions.default.xr",
  "permissions.media.query.enabled",
  "permissions.default.desktop-notification",
  "privacy.fingerprintingProtection.overrides",
  "privacy.fingerprintingProtection",
  "privacy.fingerprintingProtection.pbmode",
  "privacy.partition.always_partition_third_party_non_cookie_storage",
  "privacy.partition.network_state",
  "privacy.partition.network_state.ocsp_cache",
  "privacy.partition.network_state.ocsp_cache.pbmode",
  "privacy.query_stripping.enabled",
  "privacy.query_stripping.enabled.pbmode",
  "privacy.resistFingerprinting.block_mozAddonManager",
  "privacy.resistFingerprinting.letterboxing.dimensions",
  "privacy.resistFingerprinting.randomization.canvas.use_siphash",
  "privacy.resistFingerprinting.randomization.daily_reset.enabled",
  "privacy.resistFingerprinting.randomization.daily_reset.private.enabled",
  "privacy.spoof_english",
  "privacy.resistFingerprinting",
  "privacy.resistFingerprinting.letterboxing",
  "privacy.resistFingerprinting.pbmode",
  "privacy.trackingprotection.cryptomining.enabled",
  "privacy.trackingprotection.emailtracking.enabled",
  "privacy.trackingprotection.emailtracking.pbmode.enabled",
  "privacy.trackingprotection.enabled",
  "privacy.trackingprotection.fingerprinting.enabled",
  "privacy.trackingprotection.pbmode.enabled",
  "privacy.trackingprotection.socialtracking.enabled",
  "webgl.disabled",
];

function clearPrefs(prefNames) {
  for (let pref of prefNames) {
    if (Services.prefs.prefHasUserValue(pref)) {
      Services.prefs.clearUserPref(pref);
    }
  }
}

function resetSecurityState() {
  clearPrefs([...AFAQ_SECURITY_PREFS, ...MANAGED_PREFS]);
}

registerCleanupFunction(() => {
  resetSecurityState();
});

add_task(function test_hardened_is_default_level() {
  resetSecurityState();

  Services.prefs.setStringPref("afaq.security.level", "hardened");
  AfaqSecurityLevelService.onStartup();
  AfaqSecurityLevelService.applyCurrentLevel();

  Assert.equal(
    Services.prefs.getBoolPref("afaq.security.initialized", false),
    true
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.lastAppliedLevel", ""),
    "hardened"
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.resistFingerprinting.letterboxing", false),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("media.peerconnection.enabled", false),
    false
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.webrtcMode", ""),
    "disabled"
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.compatibilityMode", ""),
    "balanced"
  );
  Assert.equal(
    Services.prefs.getIntPref("network.cookie.cookieBehavior", 0),
    5
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.query_stripping.enabled", false),
    true
  );
  Assert.equal(
    Services.prefs.getIntPref("dom.maxHardwareConcurrency", 0),
    2
  );
  Assert.equal(
    Services.prefs.getIntPref("dom.maxtouchpoints.testing.value", -1),
    0
  );
  Assert.equal(
    Services.prefs.getIntPref("dom.w3c_touch_events.enabled", 1),
    0
  );
  Assert.equal(
    Services.prefs.getStringPref("intl.accept_languages", ""),
    "en-US, en"
  );
  Assert.equal(
    Services.prefs.getIntPref("layout.css.font-visibility", 0),
    1
  );
  Assert.equal(
    Services.prefs.getIntPref("layout.css.font-visibility.trackingprotection", 0),
    1
  );
  Assert.equal(
    Services.prefs.getIntPref("network.http.referer.defaultPolicy.trackers", 99),
    0
  );
  Assert.equal(
    Services.prefs.getIntPref(
      "network.http.referer.defaultPolicy.trackers.pbmode",
      99
    ),
    0
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("network.http.referer.sendFromRefresh", true),
    false
  );
  Assert.equal(
    Services.prefs.getStringPref(
      "privacy.fingerprintingProtection.overrides",
      ""
    ),
    "+CanvasRandomization,+CanvasImageExtractionPrompt,+CanvasExtractionBeforeUserInputIsBlocked,+CanvasExtractionFromThirdPartiesIsBlocked"
  );
  Assert.equal(
    Services.prefs.getStringPref(
      "privacy.resistFingerprinting.letterboxing.dimensions",
      ""
    ),
    "1280x720, 1366x768, 1400x900, 1440x900, 1600x900, 1920x900"
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "privacy.resistFingerprinting.randomization.canvas.use_siphash",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "privacy.resistFingerprinting.randomization.daily_reset.enabled",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "privacy.resistFingerprinting.randomization.daily_reset.private.enabled",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getIntPref("privacy.spoof_english", 0),
    2
  );
  Assert.equal(
    Services.prefs.getIntPref("permissions.default.screen-wake-lock", 0),
    2
  );
  Assert.equal(
    Services.prefs.getIntPref("permissions.default.xr", 0),
    2
  );
  Assert.equal(
    Services.prefs.getBoolPref("permissions.media.query.enabled", true),
    false
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "privacy.resistFingerprinting.block_mozAddonManager",
      false
    ),
    true
  );
});

add_task(function test_maximum_level_applies_stricter_bundle() {
  resetSecurityState();

  Services.prefs.setStringPref("afaq.security.level", "maximum");
  AfaqSecurityLevelService.onStartup();
  AfaqSecurityLevelService.applyCurrentLevel();

  Assert.equal(
    Services.prefs.getStringPref("afaq.security.lastAppliedLevel", ""),
    "maximum"
  );
  Assert.equal(
    Services.prefs.getBoolPref("media.peerconnection.enabled", true),
    false
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.webrtcMode", ""),
    "disabled"
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.compatibilityMode", ""),
    "balanced"
  );
  Assert.equal(
    Services.prefs.getBoolPref("webgl.disabled", false),
    true
  );
  Assert.equal(
    Services.prefs.getIntPref("permissions.default.desktop-notification", 0),
    2
  );
});

add_task(function test_standard_level_relaxes_maximum_only_controls() {
  resetSecurityState();

  Services.prefs.setStringPref("afaq.security.level", "maximum");
  AfaqSecurityLevelService.onStartup();
  AfaqSecurityLevelService.applyCurrentLevel();

  Services.prefs.setStringPref("afaq.security.level", "standard");

  Assert.equal(
    Services.prefs.getStringPref("afaq.security.lastAppliedLevel", ""),
    "standard"
  );
  Assert.equal(
    Services.prefs.getBoolPref("media.peerconnection.enabled", false),
    true
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.webrtcMode", ""),
    "protected"
  );
  Assert.equal(
    Services.prefs.getStringPref("afaq.security.compatibilityMode", ""),
    "balanced"
  );
  Assert.equal(
    Services.prefs.getBoolPref("webgl.disabled", true),
    false
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.resistFingerprinting.letterboxing", true),
    false
  );
});

add_task(function test_webrtc_mode_override_applies_without_level_change() {
  resetSecurityState();

  Services.prefs.setStringPref("afaq.security.level", "hardened");
  Services.prefs.setStringPref("afaq.security.webrtcMode", "disabled");
  AfaqSecurityLevelService.onStartup();
  AfaqSecurityLevelService.applyWebRTCMode();

  Assert.equal(
    Services.prefs.getBoolPref("media.peerconnection.enabled", true),
    false
  );

  Services.prefs.setStringPref("afaq.security.webrtcMode", "protected");
  AfaqSecurityLevelService.applyWebRTCMode();

  Assert.equal(
    Services.prefs.getBoolPref("media.peerconnection.enabled", false),
    true
  );
});

add_task(function test_compatibility_mode_override_applies_without_level_change() {
  resetSecurityState();

  Services.prefs.setStringPref("afaq.security.level", "hardened");
  Services.prefs.setStringPref("afaq.security.compatibilityMode", "troubleshoot");
  AfaqSecurityLevelService.onStartup();
  AfaqSecurityLevelService.applyCompatibilityMode();

  Assert.equal(
    Services.prefs.getIntPref("network.trr.mode", 99),
    0
  );
  Assert.equal(
    Services.prefs.getIntPref("network.cookie.cookieBehavior", 99),
    4
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.query_stripping.enabled", true),
    false
  );

  Services.prefs.setStringPref("afaq.security.compatibilityMode", "balanced");
  AfaqSecurityLevelService.applyCompatibilityMode();

  Assert.equal(
    Services.prefs.getIntPref("network.trr.mode", 99),
    2
  );
  Assert.equal(
    Services.prefs.getIntPref("network.cookie.cookieBehavior", 99),
    5
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.query_stripping.enabled", false),
    true
  );
});

add_task(function test_startup_reconciles_webrtc_and_compatibility_modes() {
  resetSecurityState();

  Services.prefs.setStringPref("afaq.security.level", "hardened");
  Services.prefs.setStringPref("afaq.security.lastAppliedLevel", "hardened");
  Services.prefs.setStringPref("afaq.security.webrtcMode", "disabled");
  Services.prefs.setStringPref("afaq.security.compatibilityMode", "troubleshoot");
  Services.prefs.setBoolPref("afaq.security.initialized", true);
  Services.prefs.setBoolPref("media.peerconnection.enabled", true);
  Services.prefs.setIntPref("network.trr.mode", 2);
  Services.prefs.setIntPref("network.cookie.cookieBehavior", 5);
  Services.prefs.setBoolPref("privacy.query_stripping.enabled", true);

  AfaqSecurityLevelService.onStartup();

  Assert.equal(
    Services.prefs.getBoolPref("media.peerconnection.enabled", true),
    false
  );
  Assert.equal(
    Services.prefs.getIntPref("network.trr.mode", 99),
    0
  );
  Assert.equal(
    Services.prefs.getIntPref("network.cookie.cookieBehavior", 99),
    4
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.query_stripping.enabled", true),
    false
  );
});
