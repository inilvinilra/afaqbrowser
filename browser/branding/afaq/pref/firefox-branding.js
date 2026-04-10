/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This file contains branding-specific prefs.

pref("startup.homepage_override_url", "");
pref("startup.homepage_welcome_url", "");
pref("startup.homepage_welcome_url.additional", "");
pref("browser.startup.homepage", "chrome://browser/content/afaq-home/index.html");
pref("browser.newtabpage.enabled", true);
pref("browser.newtab.url", "chrome://browser/content/afaq-home/index.html");
pref("browser.startup.homepage.abouthome_cache.enabled", false);
pref("extensions.activeThemeID", "firefox-compact-dark@mozilla.org");
pref("ui.systemUsesDarkTheme", 1);
pref("extensions.installDistroAddons", true);
pref("extensions.startupScanScopes", 31);
pref("extensions.unifiedExtensions.button.always_visible", true);
pref("app.support.baseURL", "https://nullbrowser.app/support/");
// The time interval between checks for a new version (in seconds)
pref("app.update.interval", 86400); // 24 hours
// Give the user x seconds to react before showing the big UI. default=24 hours
pref("app.update.promptWaitTime", 86400);
// URL user can browse to manually if for some reason all update installation
// attempts fail.
pref("app.update.url.manual", "https://nullbrowser.app/download");
// A default value for the "More information about this update" link
// supplied in the "An update is available" page of the update wizard.
pref("app.update.url.details", "https://nullbrowser.app/releases");

// The number of days a binary is permitted to be old
// without checking for an update.  This assumes that
// app.update.checkInstallTime is true.
pref("app.update.checkInstallTime.days", 2);

// Give the user x seconds to reboot before showing a badge on the hamburger
// button. default=immediately
pref("app.update.badgeWaitTime", 0);

// Number of usages of the web console.
// If this is less than 5, then pasting code into the web console is disabled
pref("devtools.selfxss.count", 5);

pref("toolkit.telemetry.enabled", false);
pref("toolkit.telemetry.unified", false);
pref("toolkit.telemetry.archive.enabled", false);
pref("toolkit.telemetry.shutdownPingSender.enabled", false);
pref("toolkit.telemetry.shutdownPingSender.backgroundtask.enabled", false);
pref("toolkit.telemetry.firstShutdownPing.enabled", false);
pref("toolkit.telemetry.newProfilePing.enabled", false);
pref("toolkit.telemetry.updatePing.enabled", false);
pref("toolkit.telemetry.bhrPing.enabled", false);
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.healthreport.uploadEnabled", false);
pref("datareporting.usage.uploadEnabled", false);
pref("app.normandy.enabled", false);
pref("app.shield.optoutstudies.enabled", false);
pref("browser.discovery.enabled", false);
pref("browser.discovery.containers.enabled", false);
pref("browser.preferences.moreFromMozilla", false);
pref("browser.preferences.experimental", false);
pref("extensions.systemAddon.update.enabled", false);
pref("browser.urlbar.suggest.searches", false);
pref("browser.search.suggest.enabled", false);
pref("browser.search.suggest.enabled.private", false);
pref("browser.search.separatePrivateDefault.ui.enabled", true);
pref("browser.send_pings", false);
pref("browser.send_pings.require_same_host", true);
pref("intl.accept_languages", "en-US, en");
pref("layout.css.font-visibility", 1);
pref("layout.css.font-visibility.trackingprotection", 1);
pref("browser.search.serpEventTelemetry.enabled", false);
pref("browser.topsites.contile.enabled", false);
pref("browser.urlbar.speculativeConnect.enabled", false);
pref("browser.urlbar.merino.enabled", false);
pref("browser.urlbar.quicksuggest.enabled", false);
pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
pref("beacon.enabled", false);
pref("dom.battery.enabled", false);
pref("dom.event.contextmenu.enabled", false);
pref("dom.event.clipboardevents.enabled", false);
pref("dom.gamepad.enabled", false);
pref("dom.maxHardwareConcurrency", 2);
pref("dom.maxtouchpoints.testing.value", 0);
pref("dom.w3c_touch_events.enabled", 0);
pref("dom.security.https_only_mode", true);
pref("dom.security.https_only_mode_pbm", true);
pref("dom.security.https_only_mode_send_http_background_request", false);
pref("browser.contentblocking.category", "custom");
pref("network.cookie.cookieBehavior", 5);
pref("network.cookie.cookieBehavior.pbmode", 5);
pref("network.http.referer.XOriginPolicy", 2);
pref("network.http.referer.XOriginTrimmingPolicy", 2);
pref("network.http.referer.defaultPolicy.trackers", 0);
pref("network.http.referer.defaultPolicy.trackers.pbmode", 0);
pref("network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation", true);
pref("network.http.referer.disallowCrossSiteRelaxingDefault.pbmode.top_navigation", true);
pref("network.http.referer.sendFromRefresh", false);
pref("pdfjs.enableScripting", false);
pref("permissions.default.desktop-notification", 2);
pref("permissions.default.geo", 2);
pref("permissions.default.screen-wake-lock", 2);
pref("permissions.default.xr", 2);
pref("permissions.media.query.enabled", false);
pref("privacy.trackingprotection.enabled", true);
pref("privacy.trackingprotection.pbmode.enabled", true);
pref("privacy.trackingprotection.fingerprinting.enabled", true);
pref("privacy.trackingprotection.cryptomining.enabled", true);
pref("privacy.trackingprotection.emailtracking.enabled", true);
pref("privacy.trackingprotection.emailtracking.pbmode.enabled", true);
pref("privacy.fingerprintingProtection", true);
pref("privacy.fingerprintingProtection.pbmode", true);
pref("privacy.fingerprintingProtection.overrides", "+CanvasRandomization,+CanvasImageExtractionPrompt,+CanvasExtractionBeforeUserInputIsBlocked,+CanvasExtractionFromThirdPartiesIsBlocked");
pref("privacy.resistFingerprinting", true);
pref("privacy.resistFingerprinting.letterboxing", true);
pref("privacy.resistFingerprinting.letterboxing.dimensions", "1280x720, 1366x768, 1400x900, 1440x900, 1600x900, 1920x900");
pref("privacy.resistFingerprinting.pbmode", true);
pref("privacy.resistFingerprinting.randomization.canvas.use_siphash", true);
pref("privacy.resistFingerprinting.randomization.daily_reset.enabled", true);
pref("privacy.resistFingerprinting.randomization.daily_reset.private.enabled", true);
pref("privacy.globalprivacycontrol.functionality.enabled", true);
pref("privacy.globalprivacycontrol.enabled", true);
pref("privacy.globalprivacycontrol.pbmode.enabled", true);
pref("privacy.partition.always_partition_third_party_non_cookie_storage", true);
pref("privacy.partition.network_state", true);
pref("privacy.partition.network_state.ocsp_cache", true);
pref("privacy.partition.network_state.ocsp_cache.pbmode", true);
pref("privacy.partition.network_state.connection_with_proxy", true);
pref("privacy.partition.serviceWorkers", true);
pref("privacy.spoof_english", 2);
pref("privacy.query_stripping.enabled", true);
pref("privacy.query_stripping.enabled.pbmode", true);
pref("privacy.resistFingerprinting.block_mozAddonManager", true);
pref("network.predictor.enabled", false);
pref("network.predictor.enable-prefetch", false);
pref("network.prefetch-next", false);
pref("network.dns.disablePrefetch", true);
pref("network.http.speculative-parallel-limit", 0);
pref("doh-rollout.enabled", true);
pref("doh-rollout.disable-heuristics", true);
pref("doh-rollout.provider-list", "[{\"UIName\":\"Mullvad DNS\",\"uri\":\"https://dns.mullvad.net/dns-query\",\"canonicalName\":\"dns.mullvad.net\"}]");
pref("network.trr.mode", 2);
pref("network.trr.uri", "https://dns.mullvad.net/dns-query");
pref("network.trr.custom_uri", "https://dns.mullvad.net/dns-query");
pref("network.trr.default_provider_uri", "https://dns.mullvad.net/dns-query");
pref("browser.region.network.url", "");
pref("browser.region.update.enabled", false);
pref("network.captive-portal-service.enabled", false);
pref("network.connectivity-service.enabled", false);
pref("media.peerconnection.enabled", false);
pref("media.peerconnection.ice.default_address_only", true);
pref("media.peerconnection.ice.no_host", true);
pref("media.peerconnection.ice.obfuscate_host_addresses", true);
pref("media.peerconnection.ice.proxy_only_if_behind_proxy", true);
pref("browser.safebrowsing.blockedURIs.enabled", false);
pref("browser.safebrowsing.malware.enabled", false);
pref("browser.safebrowsing.phishing.enabled", false);
pref("browser.privatebrowsing.vpnpromourl", "");
pref("browser.newtabpage.activity-stream.showWeather", false);
pref("browser.newtabpage.activity-stream.showSponsored", false);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
pref("browser.newtabpage.activity-stream.unifiedAds.tiles.enabled", false);
pref("browser.newtabpage.activity-stream.unifiedAds.spocs.enabled", false);
pref("browser.newtabpage.activity-stream.discoverystream.enabled", false);
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
pref("browser.newtabpage.activity-stream.telemetry.privatePing.enabled", false);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);
pref("browser.newtabpage.activity-stream.asrouter.useRemoteL10n", false);
pref("browser.contentblocking.report.show_mobile_app", false);
pref("browser.contentblocking.report.mobile-ios.url", "");
pref("browser.contentblocking.report.mobile-android.url", "");
pref("browser.vpn_promo.enabled", false);
pref("browser.contentblocking.report.hide_vpn_banner", true);
pref("browser.contentblocking.report.vpn.url", "");
pref("browser.contentblocking.report.vpn-promo.url", "");
pref("browser.contentblocking.report.vpn-android.url", "");
pref("browser.contentblocking.report.vpn-ios.url", "");
pref("signon.firefoxRelay.feature", "disabled");
pref("identity.fxaccounts.pairing.enabled", false);
pref("identity.mobilepromo.android", "");
pref("identity.mobilepromo.ios", "");
pref("identity.fxaccounts.toolbar.pxiToolbarEnabled.monitorEnabled", false);
pref("identity.fxaccounts.toolbar.pxiToolbarEnabled.relayEnabled", false);
pref("identity.fxaccounts.toolbar.pxiToolbarEnabled.vpnEnabled", false);
pref("afaq.security.level", "hardened");
pref("afaq.security.webrtcMode", "disabled");
pref("afaq.security.compatibilityMode", "balanced");
pref("afaq.security.initialized", true);
pref("afaq.security.lastAppliedLevel", "hardened");
pref("afaq.cleanup.mode", "keep");
pref("afaq.cleanup.exit.browsingHistoryAndDownloads", false);
pref("afaq.cleanup.exit.cookiesAndStorage", false);
pref("afaq.cleanup.exit.cache", false);
pref("afaq.cleanup.exit.formdata", false);
pref("afaq.cleanup.exit.siteSettings", false);
pref("afaq.cleanup.audit.enabled", true);
pref("afaq.cleanup.audit.maxEntries", 50);
