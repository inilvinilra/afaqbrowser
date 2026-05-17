"use strict";

add_setup(function () {
  registerCleanupFunction(() => {
    Services.prefs.clearUserPref("privacy.history.custom");
  });
});

add_task(async function test_afaq_cleanup_exceptions_button_exists() {
  await SpecialPowers.pushPrefEnv({
    set: [["privacy.history.custom", true]],
  });

  await openPreferencesViaOpenPreferencesAPI("panePrivacy", {
    leaveOpen: true,
  });

  let document = gBrowser.contentDocument;
  let button = document.getElementById("clearDataExceptions");

  ok(button, "Afaq cleanup exceptions button should exist");
  is(
    button.getAttribute("data-l10n-id"),
    "history-clear-exceptions",
    "Afaq cleanup exceptions button should use product strings"
  );

  BrowserTestUtils.removeTab(gBrowser.selectedTab);
  await SpecialPowers.popPrefEnv();
});
