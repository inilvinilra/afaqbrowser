"use strict";

add_setup(async function () {
  let exceptionPrincipal =
    Services.scriptSecurityManager.createContentPrincipalFromOrigin(
      "https://store.example"
    );
  registerCleanupFunction(() => {
    for (let pref of [
      "privacy.history.custom",
      "browser.privatebrowsing.autostart",
      "afaq.cleanup.mode",
      "afaq.cleanup.exit.cookiesAndStorage",
      "afaq.cleanup.exit.cache",
    ]) {
      Services.prefs.clearUserPref(pref);
    }
    Services.perms.removeFromPrincipal(exceptionPrincipal, "afaq-cleanup");
  });
});

add_task(async function test_afaq_cleanup_controls() {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["privacy.history.custom", true],
      ["browser.privatebrowsing.autostart", false],
      ["afaq.cleanup.mode", "keep"],
      ["afaq.cleanup.exit.cookiesAndStorage", false],
      ["afaq.cleanup.exit.cache", false],
    ],
  });

  await openPreferencesViaOpenPreferencesAPI("panePrivacy", {
    leaveOpen: true,
  });

  let document = gBrowser.contentDocument;
  let alwaysClear = document.getElementById("alwaysClear");
  let deleteOnClose = document.getElementById("deleteOnClose");
  let settingsButton = document.getElementById("clearDataSettings");
  let cleanupSummary = document.getElementById("afaqCleanupSummary");
  let exceptionsSummary = document.getElementById("afaqCleanupExceptionsSummary");

  ok(!alwaysClear.checked, "Afaq exit cleanup is disabled by default");
  ok(!deleteOnClose.checked, "Site data exit cleanup microcontrol is disabled");
  ok(settingsButton.disabled, "Cleanup category settings are disabled");
  await BrowserTestUtils.waitForCondition(
    () =>
      cleanupSummary.textContent.includes("No data is cleared automatically"),
    "Cleanup summary should explain persistent browsing"
  );
  await BrowserTestUtils.waitForCondition(
    () => exceptionsSummary.textContent.includes("No site exceptions are set."),
    "Exceptions summary should start empty"
  );

  alwaysClear.click();

  is(
    Services.prefs.getStringPref("afaq.cleanup.mode"),
    "exit",
    "Afaq cleanup mode switches to exit"
  );
  ok(
    Services.prefs.getBoolPref("afaq.cleanup.exit.cookiesAndStorage"),
    "Cookies and storage cleanup is selected by default"
  );
  ok(
    Services.prefs.getBoolPref("afaq.cleanup.exit.cache"),
    "Cache cleanup is selected by default"
  );
  ok(alwaysClear.checked, "History cleanup control reflects exit mode");
  ok(deleteOnClose.checked, "Site data microcontrol reflects selected categories");
  ok(!settingsButton.disabled, "Cleanup category settings are enabled");
  await BrowserTestUtils.waitForCondition(
    () =>
      cleanupSummary.textContent.includes("cookies and site data, cached content"),
    "Cleanup summary should list the default exit categories"
  );

  let exceptionPrincipal =
    Services.scriptSecurityManager.createContentPrincipalFromOrigin(
      "https://store.example"
    );
  Services.perms.addFromPrincipal(
    exceptionPrincipal,
    "afaq-cleanup",
    Ci.nsIPermissionManager.ALLOW_ACTION
  );
  await document.defaultView.gPrivacyPane._updateAfaqCleanupSummary();
  await BrowserTestUtils.waitForCondition(
    () => exceptionsSummary.textContent.includes("1 site exception is set."),
    "Exceptions summary should reflect cleanup exception rules"
  );

  deleteOnClose.click();

  ok(
    !Services.prefs.getBoolPref("afaq.cleanup.exit.cookiesAndStorage"),
    "Cookies and storage cleanup can be disabled independently"
  );
  ok(
    !Services.prefs.getBoolPref("afaq.cleanup.exit.cache"),
    "Cache cleanup can be disabled independently"
  );
  is(
    Services.prefs.getStringPref("afaq.cleanup.mode"),
    "keep",
    "Afaq cleanup mode returns to keep when no exit categories remain"
  );
  ok(!alwaysClear.checked, "History cleanup control returns to unchecked");
  ok(!deleteOnClose.checked, "Site data microcontrol returns to unchecked");
  await BrowserTestUtils.waitForCondition(
    () =>
      cleanupSummary.textContent.includes("No data is cleared automatically"),
    "Cleanup summary should return to persistent browsing text"
  );

  BrowserTestUtils.removeTab(gBrowser.selectedTab);
});
