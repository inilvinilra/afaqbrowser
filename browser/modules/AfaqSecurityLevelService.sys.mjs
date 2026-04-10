/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const WEBRTC_MODE_PREFS = {
  protected: {
    "media.peerconnection.enabled": true,
    "media.peerconnection.ice.default_address_only": true,
    "media.peerconnection.ice.no_host": true,
    "media.peerconnection.ice.obfuscate_host_addresses": true,
    "media.peerconnection.ice.proxy_only_if_behind_proxy": true,
  },
  disabled: {
    "media.peerconnection.enabled": false,
    "media.peerconnection.ice.default_address_only": true,
    "media.peerconnection.ice.no_host": true,
    "media.peerconnection.ice.obfuscate_host_addresses": true,
    "media.peerconnection.ice.proxy_only_if_behind_proxy": true,
  },
};

const LEVEL_DEFAULTS = {
  standard: {
    webRtcMode: "protected",
  },
  hardened: {
    webRtcMode: "disabled",
  },
  maximum: {
    webRtcMode: "disabled",
  },
};

const COMPATIBILITY_MANAGED_PREFS = [
  "browser.contentblocking.category",
  "network.cookie.cookieBehavior",
  "network.cookie.cookieBehavior.pbmode",
  "network.trr.mode",
  "privacy.query_stripping.enabled",
  "privacy.query_stripping.enabled.pbmode",
];

const COMPATIBILITY_MODE_PREFS = {
  troubleshoot: {
    "browser.contentblocking.category": "custom",
    "network.cookie.cookieBehavior": 4,
    "network.cookie.cookieBehavior.pbmode": 5,
    "network.trr.mode": 0,
    "privacy.query_stripping.enabled": false,
    "privacy.query_stripping.enabled.pbmode": false,
  },
};

const LEVEL_PREFS = {
  standard: {
    "beacon.enabled": false,
    "browser.contentblocking.category": "custom",
    "browser.send_pings": false,
    "browser.send_pings.require_same_host": true,
    "dom.maxHardwareConcurrency": 2,
    "browser.search.serpEventTelemetry.enabled": false,
    "browser.topsites.contile.enabled": false,
    "browser.urlbar.speculativeConnect.enabled": false,
    "browser.urlbar.merino.enabled": false,
    "browser.urlbar.quicksuggest.enabled": false,
    "browser.urlbar.suggest.quicksuggest.nonsponsored": false,
    "browser.urlbar.suggest.quicksuggest.sponsored": false,
    "dom.battery.enabled": false,
    "dom.event.contextmenu.enabled": false,
    "dom.security.https_only_mode": true,
    "dom.security.https_only_mode_pbm": true,
    "dom.gamepad.enabled": false,
    "dom.maxtouchpoints.testing.value": 0,
    "dom.w3c_touch_events.enabled": 0,
    "intl.accept_languages": "en-US, en",
    "layout.css.font-visibility": 1,
    "layout.css.font-visibility.trackingprotection": 1,
    "network.cookie.cookieBehavior": 5,
    "network.cookie.cookieBehavior.pbmode": 5,
    "network.dns.disablePrefetch": true,
    "network.http.referer.defaultPolicy.trackers": 0,
    "network.http.referer.defaultPolicy.trackers.pbmode": 0,
    "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation": true,
    "network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation":
      true,
    "network.http.referer.sendFromRefresh": false,
    "network.http.referer.XOriginPolicy": 2,
    "network.http.referer.XOriginTrimmingPolicy": 2,
    "network.http.speculative-parallel-limit": 0,
    "network.trr.mode": 2,
    "network.prefetch-next": false,
    "pdfjs.enableScripting": false,
    "permissions.default.screen-wake-lock": 2,
    "permissions.default.xr": 2,
    "permissions.media.query.enabled": false,
    "network.predictor.enabled": false,
    "network.predictor.enable-prefetch": false,
    "privacy.fingerprintingProtection": true,
    "privacy.fingerprintingProtection.pbmode": true,
    "privacy.fingerprintingProtection.overrides":
      "+CanvasRandomization,+CanvasImageExtractionPrompt,+CanvasExtractionBeforeUserInputIsBlocked,+CanvasExtractionFromThirdPartiesIsBlocked",
    "privacy.globalprivacycontrol.enabled": true,
    "privacy.globalprivacycontrol.functionality.enabled": true,
    "privacy.globalprivacycontrol.pbmode.enabled": true,
    "privacy.partition.always_partition_third_party_non_cookie_storage": true,
    "privacy.partition.network_state.connection_with_proxy": true,
    "privacy.partition.network_state": true,
    "privacy.partition.network_state.ocsp_cache": true,
    "privacy.partition.network_state.ocsp_cache.pbmode": true,
    "privacy.partition.serviceWorkers": true,
    "privacy.query_stripping.enabled": true,
    "privacy.query_stripping.enabled.pbmode": true,
    "privacy.resistFingerprinting.block_mozAddonManager": true,
    "privacy.resistFingerprinting.letterboxing.dimensions":
      "1280x720, 1366x768, 1400x900, 1440x900, 1600x900, 1920x900",
    "privacy.resistFingerprinting.randomization.canvas.use_siphash": true,
    "privacy.resistFingerprinting.randomization.daily_reset.enabled": true,
    "privacy.resistFingerprinting.randomization.daily_reset.private.enabled":
      true,
    "privacy.spoof_english": 2,
    "privacy.resistFingerprinting": true,
    "privacy.resistFingerprinting.letterboxing": false,
    "privacy.resistFingerprinting.pbmode": true,
    "privacy.trackingprotection.cryptomining.enabled": true,
    "privacy.trackingprotection.emailtracking.enabled": true,
    "privacy.trackingprotection.emailtracking.pbmode.enabled": true,
    "privacy.trackingprotection.enabled": true,
    "privacy.trackingprotection.fingerprinting.enabled": true,
    "privacy.trackingprotection.pbmode.enabled": true,
    "privacy.trackingprotection.socialtracking.enabled": true,
    "webgl.disabled": false,
  },
  hardened: {
    "beacon.enabled": false,
    "browser.contentblocking.category": "custom",
    "browser.region.network.url": "",
    "browser.region.update.enabled": false,
    "browser.send_pings": false,
    "browser.send_pings.require_same_host": true,
    "dom.maxHardwareConcurrency": 2,
    "browser.search.serpEventTelemetry.enabled": false,
    "browser.topsites.contile.enabled": false,
    "browser.urlbar.speculativeConnect.enabled": false,
    "browser.urlbar.merino.enabled": false,
    "browser.urlbar.quicksuggest.enabled": false,
    "browser.urlbar.suggest.quicksuggest.nonsponsored": false,
    "browser.urlbar.suggest.quicksuggest.sponsored": false,
    "dom.battery.enabled": false,
    "dom.event.clipboardevents.enabled": false,
    "dom.event.contextmenu.enabled": false,
    "dom.security.https_only_mode": true,
    "dom.security.https_only_mode_pbm": true,
    "dom.gamepad.enabled": false,
    "dom.maxtouchpoints.testing.value": 0,
    "dom.w3c_touch_events.enabled": 0,
    "intl.accept_languages": "en-US, en",
    "layout.css.font-visibility": 1,
    "layout.css.font-visibility.trackingprotection": 1,
    "network.cookie.cookieBehavior": 5,
    "network.cookie.cookieBehavior.pbmode": 5,
    "network.captive-portal-service.enabled": false,
    "network.connectivity-service.enabled": false,
    "network.dns.disablePrefetch": true,
    "network.http.referer.defaultPolicy.trackers": 0,
    "network.http.referer.defaultPolicy.trackers.pbmode": 0,
    "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation": true,
    "network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation":
      true,
    "network.http.referer.sendFromRefresh": false,
    "network.http.referer.XOriginPolicy": 2,
    "network.http.referer.XOriginTrimmingPolicy": 2,
    "network.http.speculative-parallel-limit": 0,
    "network.prefetch-next": false,
    "network.predictor.enabled": false,
    "network.predictor.enable-prefetch": false,
    "network.trr.mode": 2,
    "pdfjs.enableScripting": false,
    "permissions.default.desktop-notification": 2,
    "permissions.default.geo": 2,
    "permissions.default.screen-wake-lock": 2,
    "permissions.default.xr": 2,
    "permissions.media.query.enabled": false,
    "privacy.fingerprintingProtection": true,
    "privacy.fingerprintingProtection.pbmode": true,
    "privacy.fingerprintingProtection.overrides":
      "+CanvasRandomization,+CanvasImageExtractionPrompt,+CanvasExtractionBeforeUserInputIsBlocked,+CanvasExtractionFromThirdPartiesIsBlocked",
    "privacy.globalprivacycontrol.enabled": true,
    "privacy.globalprivacycontrol.functionality.enabled": true,
    "privacy.globalprivacycontrol.pbmode.enabled": true,
    "privacy.partition.always_partition_third_party_non_cookie_storage": true,
    "privacy.partition.network_state.connection_with_proxy": true,
    "privacy.partition.network_state": true,
    "privacy.partition.network_state.ocsp_cache": true,
    "privacy.partition.network_state.ocsp_cache.pbmode": true,
    "privacy.partition.serviceWorkers": true,
    "privacy.query_stripping.enabled": true,
    "privacy.query_stripping.enabled.pbmode": true,
    "privacy.resistFingerprinting.block_mozAddonManager": true,
    "privacy.resistFingerprinting.letterboxing.dimensions":
      "1280x720, 1366x768, 1400x900, 1440x900, 1600x900, 1920x900",
    "privacy.resistFingerprinting.randomization.canvas.use_siphash": true,
    "privacy.resistFingerprinting.randomization.daily_reset.enabled": true,
    "privacy.resistFingerprinting.randomization.daily_reset.private.enabled":
      true,
    "privacy.spoof_english": 2,
    "privacy.resistFingerprinting": true,
    "privacy.resistFingerprinting.letterboxing": true,
    "privacy.resistFingerprinting.pbmode": true,
    "privacy.trackingprotection.cryptomining.enabled": true,
    "privacy.trackingprotection.emailtracking.enabled": true,
    "privacy.trackingprotection.emailtracking.pbmode.enabled": true,
    "privacy.trackingprotection.enabled": true,
    "privacy.trackingprotection.fingerprinting.enabled": true,
    "privacy.trackingprotection.pbmode.enabled": true,
    "privacy.trackingprotection.socialtracking.enabled": true,
    "webgl.disabled": false,
  },
  maximum: {
    "beacon.enabled": false,
    "browser.contentblocking.category": "strict",
    "browser.region.network.url": "",
    "browser.region.update.enabled": false,
    "browser.send_pings": false,
    "browser.send_pings.require_same_host": true,
    "dom.maxHardwareConcurrency": 2,
    "browser.search.serpEventTelemetry.enabled": false,
    "browser.topsites.contile.enabled": false,
    "browser.urlbar.speculativeConnect.enabled": false,
    "browser.urlbar.merino.enabled": false,
    "browser.urlbar.quicksuggest.enabled": false,
    "browser.urlbar.suggest.quicksuggest.nonsponsored": false,
    "browser.urlbar.suggest.quicksuggest.sponsored": false,
    "dom.battery.enabled": false,
    "dom.event.clipboardevents.enabled": false,
    "dom.event.contextmenu.enabled": false,
    "dom.security.https_only_mode": true,
    "dom.security.https_only_mode_pbm": true,
    "dom.gamepad.enabled": false,
    "dom.maxtouchpoints.testing.value": 0,
    "dom.w3c_touch_events.enabled": 0,
    "intl.accept_languages": "en-US, en",
    "layout.css.font-visibility": 1,
    "layout.css.font-visibility.trackingprotection": 1,
    "network.cookie.cookieBehavior": 5,
    "network.cookie.cookieBehavior.pbmode": 5,
    "network.captive-portal-service.enabled": false,
    "network.connectivity-service.enabled": false,
    "network.dns.disablePrefetch": true,
    "network.http.referer.defaultPolicy.trackers": 0,
    "network.http.referer.defaultPolicy.trackers.pbmode": 0,
    "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation": true,
    "network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation":
      true,
    "network.http.referer.sendFromRefresh": false,
    "network.http.referer.XOriginPolicy": 2,
    "network.http.referer.XOriginTrimmingPolicy": 2,
    "network.http.speculative-parallel-limit": 0,
    "network.prefetch-next": false,
    "network.predictor.enabled": false,
    "network.predictor.enable-prefetch": false,
    "network.trr.mode": 3,
    "pdfjs.enableScripting": false,
    "permissions.default.desktop-notification": 2,
    "permissions.default.geo": 2,
    "permissions.default.screen-wake-lock": 2,
    "permissions.default.xr": 2,
    "permissions.media.query.enabled": false,
    "privacy.fingerprintingProtection": true,
    "privacy.fingerprintingProtection.pbmode": true,
    "privacy.fingerprintingProtection.overrides":
      "+CanvasRandomization,+CanvasImageExtractionPrompt,+CanvasExtractionBeforeUserInputIsBlocked,+CanvasExtractionFromThirdPartiesIsBlocked",
    "privacy.globalprivacycontrol.enabled": true,
    "privacy.globalprivacycontrol.functionality.enabled": true,
    "privacy.globalprivacycontrol.pbmode.enabled": true,
    "privacy.partition.always_partition_third_party_non_cookie_storage": true,
    "privacy.partition.network_state.connection_with_proxy": true,
    "privacy.partition.network_state": true,
    "privacy.partition.network_state.ocsp_cache": true,
    "privacy.partition.network_state.ocsp_cache.pbmode": true,
    "privacy.partition.serviceWorkers": true,
    "privacy.query_stripping.enabled": true,
    "privacy.query_stripping.enabled.pbmode": true,
    "privacy.resistFingerprinting.block_mozAddonManager": true,
    "privacy.resistFingerprinting.letterboxing.dimensions":
      "1280x720, 1366x768, 1400x900, 1440x900, 1600x900, 1920x900",
    "privacy.resistFingerprinting.randomization.canvas.use_siphash": true,
    "privacy.resistFingerprinting.randomization.daily_reset.enabled": true,
    "privacy.resistFingerprinting.randomization.daily_reset.private.enabled":
      true,
    "privacy.spoof_english": 2,
    "privacy.resistFingerprinting": true,
    "privacy.resistFingerprinting.letterboxing": true,
    "privacy.resistFingerprinting.pbmode": true,
    "privacy.trackingprotection.cryptomining.enabled": true,
    "privacy.trackingprotection.emailtracking.enabled": true,
    "privacy.trackingprotection.emailtracking.pbmode.enabled": true,
    "privacy.trackingprotection.enabled": true,
    "privacy.trackingprotection.fingerprinting.enabled": true,
    "privacy.trackingprotection.pbmode.enabled": true,
    "privacy.trackingprotection.socialtracking.enabled": true,
    "webgl.disabled": true,
  },
};

function getValidLevel(level) {
  return Object.hasOwn(LEVEL_PREFS, level) ? level : "hardened";
}

function getValidWebRTCMode(mode) {
  return Object.hasOwn(WEBRTC_MODE_PREFS, mode) ? mode : "protected";
}

function getValidCompatibilityMode(mode) {
  return Object.hasOwn(COMPATIBILITY_MODE_PREFS, mode) ? mode : "balanced";
}

function setPref(pref, value) {
  if (typeof value == "boolean") {
    Services.prefs.setBoolPref(pref, value);
    return;
  }

  if (typeof value == "number") {
    Services.prefs.setIntPref(pref, value);
    return;
  }

  Services.prefs.setStringPref(pref, String(value));
}

export const AfaqSecurityLevelService = {
  PREF_BRANCH: "afaq.security.",
  PREF_LEVEL: "afaq.security.level",
  PREF_WEBRTC_MODE: "afaq.security.webrtcMode",
  PREF_COMPATIBILITY_MODE: "afaq.security.compatibilityMode",
  PREF_INITIALIZED: "afaq.security.initialized",
  PREF_LAST_APPLIED_LEVEL: "afaq.security.lastAppliedLevel",

  _initialized: false,

  onStartup() {
    if (this._initialized) {
      return;
    }

    this._initialized = true;
    Services.prefs.addObserver(this.PREF_LEVEL, this, true);
    Services.prefs.addObserver(this.PREF_WEBRTC_MODE, this, true);
    Services.prefs.addObserver(this.PREF_COMPATIBILITY_MODE, this, true);

    if (
      !Services.prefs.getBoolPref(this.PREF_INITIALIZED, false) ||
      this.getCurrentLevel() !=
        Services.prefs.getStringPref(this.PREF_LAST_APPLIED_LEVEL, "")
    ) {
      this.applyCurrentLevel();
      return;
    }

    this.reconcileManagedModes();
  },

  observe(subject, topic, data) {
    if (topic != "nsPref:changed") {
      return;
    }

    if (data == this.PREF_LEVEL) {
      this.applyCurrentLevel();
      return;
    }

    if (data == this.PREF_WEBRTC_MODE) {
      this.applyWebRTCMode();
      return;
    }

    if (data == this.PREF_COMPATIBILITY_MODE) {
      this.applyCompatibilityMode();
    }
  },

  QueryInterface: ChromeUtils.generateQI([
    "nsIObserver",
    "nsISupportsWeakReference",
  ]),

  getCurrentLevel() {
    return getValidLevel(
      Services.prefs.getStringPref(this.PREF_LEVEL, "hardened")
    );
  },

  getPrefsForLevel(level = this.getCurrentLevel()) {
    return { ...LEVEL_PREFS[getValidLevel(level)] };
  },

  getDefaultWebRTCModeForLevel(level = this.getCurrentLevel()) {
    return LEVEL_DEFAULTS[getValidLevel(level)].webRtcMode;
  },

  getCurrentWebRTCMode() {
    return getValidWebRTCMode(
      Services.prefs.getStringPref(
        this.PREF_WEBRTC_MODE,
        this.getDefaultWebRTCModeForLevel()
      )
    );
  },

  getPrefsForWebRTCMode(mode = this.getCurrentWebRTCMode()) {
    return { ...WEBRTC_MODE_PREFS[getValidWebRTCMode(mode)] };
  },

  getCurrentCompatibilityMode() {
    return getValidCompatibilityMode(
      Services.prefs.getStringPref(this.PREF_COMPATIBILITY_MODE, "balanced")
    );
  },

  getPrefsForCompatibilityMode(
    mode = this.getCurrentCompatibilityMode(),
    level = this.getCurrentLevel()
  ) {
    let validMode = getValidCompatibilityMode(mode);
    if (validMode == "balanced") {
      let levelPrefs = this.getPrefsForLevel(level);
      return Object.fromEntries(
        COMPATIBILITY_MANAGED_PREFS.map(pref => [pref, levelPrefs[pref]])
      );
    }
    return { ...COMPATIBILITY_MODE_PREFS[validMode] };
  },

  applyWebRTCMode(mode = this.getCurrentWebRTCMode()) {
    let validMode = getValidWebRTCMode(mode);
    for (let [pref, value] of Object.entries(this.getPrefsForWebRTCMode(validMode))) {
      setPref(pref, value);
    }
    if (Services.prefs.getStringPref(this.PREF_WEBRTC_MODE, "") != validMode) {
      Services.prefs.setStringPref(this.PREF_WEBRTC_MODE, validMode);
    }
  },

  applyCompatibilityMode(
    mode = this.getCurrentCompatibilityMode(),
    level = this.getCurrentLevel()
  ) {
    let validMode = getValidCompatibilityMode(mode);
    for (let [pref, value] of Object.entries(
      this.getPrefsForCompatibilityMode(validMode, level)
    )) {
      setPref(pref, value);
    }
    if (
      Services.prefs.getStringPref(this.PREF_COMPATIBILITY_MODE, "") !=
      validMode
    ) {
      Services.prefs.setStringPref(this.PREF_COMPATIBILITY_MODE, validMode);
    }
  },

  reconcileManagedModes(level = this.getCurrentLevel()) {
    this.applyWebRTCMode(this.getCurrentWebRTCMode());
    this.applyCompatibilityMode(this.getCurrentCompatibilityMode(), level);
  },

  applyCurrentLevel() {
    let level = this.getCurrentLevel();
    for (let [pref, value] of Object.entries(this.getPrefsForLevel(level))) {
      setPref(pref, value);
    }
    this.applyWebRTCMode(this.getDefaultWebRTCModeForLevel(level));
    this.applyCompatibilityMode(this.getCurrentCompatibilityMode(), level);
    Services.prefs.setBoolPref(this.PREF_INITIALIZED, true);
    Services.prefs.setStringPref(this.PREF_LAST_APPLIED_LEVEL, level);
  },
};
