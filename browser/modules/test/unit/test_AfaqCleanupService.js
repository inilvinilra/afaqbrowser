/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

do_get_profile();

const { AfaqCleanupService } = ChromeUtils.importESModule(
  "resource:///modules/AfaqCleanupService.sys.mjs"
);
const { Sanitizer } = ChromeUtils.importESModule(
  "resource:///modules/Sanitizer.sys.mjs"
);

const AFAQ_PREFS = [
  "afaq.cleanup.mode",
  "afaq.cleanup.exit.browsingHistoryAndDownloads",
  "afaq.cleanup.exit.cookiesAndStorage",
  "afaq.cleanup.exit.cache",
  "afaq.cleanup.exit.formdata",
  "afaq.cleanup.exit.siteSettings",
  "afaq.cleanup.audit.enabled",
  "afaq.cleanup.audit.maxEntries",
];

const FIREFOX_PREFS = [
  "privacy.sanitize.sanitizeOnShutdown",
  "privacy.clearOnShutdown_v2.browsingHistoryAndDownloads",
  "privacy.clearOnShutdown_v2.cookiesAndStorage",
  "privacy.clearOnShutdown_v2.cache",
  "privacy.clearOnShutdown_v2.formdata",
  "privacy.clearOnShutdown_v2.siteSettings",
  "privacy.clearOnShutdown.history",
  "privacy.clearOnShutdown.downloads",
  "privacy.clearOnShutdown.cookies",
  "privacy.clearOnShutdown.offlineApps",
  "privacy.clearOnShutdown.sessions",
  "privacy.clearOnShutdown.cache",
  "privacy.clearOnShutdown.formdata",
  "privacy.clearOnShutdown.siteSettings",
  Sanitizer.PREF_PENDING_SANITIZATIONS,
];

async function resetCleanupState() {
  for (let pref of [...AFAQ_PREFS, ...FIREFOX_PREFS]) {
    if (Services.prefs.prefHasUserValue(pref)) {
      Services.prefs.clearUserPref(pref);
    }
  }
  AfaqCleanupService.clearExceptionRulesForTests();
  await AfaqCleanupService.clearAuditForTests();
}

registerCleanupFunction(async () => {
  await resetCleanupState();
});

add_task(async function test_exit_pref_sync() {
  await resetCleanupState();
  AfaqCleanupService.onStartup();

  Assert.equal(
    Services.prefs.getBoolPref("privacy.sanitize.sanitizeOnShutdown", false),
    false
  );

  Services.prefs.setStringPref("afaq.cleanup.mode", "exit");
  Services.prefs.setBoolPref("afaq.cleanup.exit.cookiesAndStorage", true);
  Services.prefs.setBoolPref("afaq.cleanup.exit.cache", true);

  Assert.equal(
    Services.prefs.getBoolPref("privacy.sanitize.sanitizeOnShutdown", false),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "privacy.clearOnShutdown_v2.cookiesAndStorage",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.clearOnShutdown_v2.cache", false),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.clearOnShutdown.cookies", false),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.clearOnShutdown.sessions", false),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.clearOnShutdown.cache", false),
    true
  );

  Services.prefs.setStringPref("afaq.cleanup.mode", "keep");

  Assert.equal(
    Services.prefs.getBoolPref("privacy.sanitize.sanitizeOnShutdown", false),
    false
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "privacy.clearOnShutdown_v2.cookiesAndStorage",
      false
    ),
    false
  );
  Assert.equal(
    Services.prefs.getBoolPref("privacy.clearOnShutdown.cache", false),
    false
  );
});

add_task(async function test_cleanup_audit_entries() {
  await resetCleanupState();
  AfaqCleanupService.onStartup();

  Services.prefs.setBoolPref("afaq.cleanup.audit.enabled", true);
  Services.prefs.setIntPref("afaq.cleanup.audit.maxEntries", 2);

  await Sanitizer.sanitize(["cache"], { trigger: "manual" });
  await AfaqCleanupService.flushAuditStoreForTests();

  let entries = await AfaqCleanupService.getAuditEntries();
  Assert.equal(entries.length, 1);
  Assert.equal(entries[0].trigger, "manual");
  Assert.equal(entries[0].status, "success");
  Assert.deepEqual(entries[0].itemsToClear, ["cache"]);

  Services.prefs.setStringPref("afaq.cleanup.mode", "exit");
  Services.prefs.setBoolPref("afaq.cleanup.exit.cookiesAndStorage", true);
  await Sanitizer.onStartup();
  await Sanitizer.runSanitizeOnShutdown();
  await AfaqCleanupService.flushAuditStoreForTests();

  entries = await AfaqCleanupService.getAuditEntries();
  Assert.equal(entries.length, 2);
  Assert.equal(entries[0].trigger, "exit");
  Assert.equal(entries[0].status, "success");
  Assert.deepEqual(entries[0].itemsToClear, ["cookiesAndStorage"]);
  Assert.equal(entries[1].trigger, "manual");

  await Sanitizer.sanitize(["siteSettings"], { trigger: "manual" });
  await AfaqCleanupService.flushAuditStoreForTests();

  entries = await AfaqCleanupService.getAuditEntries();
  Assert.equal(entries.length, 2);
  Assert.equal(entries[0].trigger, "manual");
  Assert.deepEqual(entries[0].itemsToClear, ["siteSettings"]);
  Assert.equal(entries[1].trigger, "exit");
});

add_task(async function test_reverse_sync_from_shutdown_prefs() {
  await resetCleanupState();
  AfaqCleanupService.onStartup();

  Services.prefs.setBoolPref("privacy.sanitize.sanitizeOnShutdown", true);
  Services.prefs.setBoolPref(
    "privacy.clearOnShutdown_v2.browsingHistoryAndDownloads",
    true
  );
  Services.prefs.setBoolPref("privacy.clearOnShutdown_v2.siteSettings", true);

  Assert.equal(
    Services.prefs.getStringPref("afaq.cleanup.mode", "keep"),
    "exit"
  );
  Assert.equal(
    Services.prefs.getBoolPref(
      "afaq.cleanup.exit.browsingHistoryAndDownloads",
      false
    ),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("afaq.cleanup.exit.siteSettings", false),
    true
  );
  Assert.equal(
    Services.prefs.getBoolPref("afaq.cleanup.exit.cookiesAndStorage", false),
    false
  );

  Services.prefs.setBoolPref("privacy.sanitize.sanitizeOnShutdown", false);

  Assert.equal(
    Services.prefs.getStringPref("afaq.cleanup.mode", "keep"),
    "keep"
  );
});

add_task(async function test_exception_rule_precedence() {
  await resetCleanupState();
  AfaqCleanupService.onStartup();

  let rootPrincipal =
    Services.scriptSecurityManager.createContentPrincipalFromOrigin(
      "https://example.com"
    );
  let subdomainPrincipal =
    Services.scriptSecurityManager.createContentPrincipalFromOrigin(
      "https://shop.example.com"
    );

  AfaqCleanupService.setExceptionRule(
    rootPrincipal,
    AfaqCleanupService.RULE_PRESERVE
  );
  AfaqCleanupService.setExceptionRule(
    subdomainPrincipal,
    AfaqCleanupService.RULE_ALWAYS_CLEAR
  );

  let matched = AfaqCleanupService.getExceptionRuleForPrincipal(
    Services.scriptSecurityManager.createContentPrincipalFromOrigin(
      "https://cdn.shop.example.com"
    )
  );

  Assert.equal(
    matched,
    AfaqCleanupService.RULE_ALWAYS_CLEAR,
    "Subdomain always-clear must override root preserve"
  );

  let split = AfaqCleanupService.splitPrincipalsByExceptionRules([
    rootPrincipal,
    subdomainPrincipal,
  ]);
  Assert.equal(split.preserved.length, 1);
  Assert.equal(split.forced.length, 1);
});
