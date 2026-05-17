"use strict";

add_task(async function test_afaq_sync_mobile_promos_are_hidden() {
  await openPreferencesViaOpenPreferencesAPI("paneSync", {
    leaveOpen: true,
  });

  let document = gBrowser.contentDocument;
  let signedOutPromo = document.querySelector("#noFxaAccount .fxaMobilePromo");
  let connectAnotherDevice = document.getElementById("connect-another-device");

  ok(
    signedOutPromo.hasAttribute("hidden"),
    "Signed-out mobile download promo is hidden in Afaq"
  );
  ok(
    connectAnotherDevice.hasAttribute("hidden"),
    "Connect another device action is hidden in Afaq"
  );

  BrowserTestUtils.removeTab(gBrowser.selectedTab);
});
