/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const EXIT_CATEGORY_PREFS = {
  browsingHistoryAndDownloads:
    "afaq.cleanup.exit.browsingHistoryAndDownloads",
  cookiesAndStorage: "afaq.cleanup.exit.cookiesAndStorage",
  cache: "afaq.cleanup.exit.cache",
  formdata: "afaq.cleanup.exit.formdata",
  siteSettings: "afaq.cleanup.exit.siteSettings",
};

const SHUTDOWN_V2_PREFS = {
  browsingHistoryAndDownloads:
    "privacy.clearOnShutdown_v2.browsingHistoryAndDownloads",
  cookiesAndStorage: "privacy.clearOnShutdown_v2.cookiesAndStorage",
  cache: "privacy.clearOnShutdown_v2.cache",
  formdata: "privacy.clearOnShutdown_v2.formdata",
  siteSettings: "privacy.clearOnShutdown_v2.siteSettings",
};

const SHUTDOWN_LEGACY_PREFS = {
  browsingHistoryAndDownloads: [
    "privacy.clearOnShutdown.history",
    "privacy.clearOnShutdown.downloads",
  ],
  cookiesAndStorage: [
    "privacy.clearOnShutdown.cookies",
    "privacy.clearOnShutdown.offlineApps",
    "privacy.clearOnShutdown.sessions",
  ],
  cache: ["privacy.clearOnShutdown.cache"],
  formdata: ["privacy.clearOnShutdown.formdata"],
  siteSettings: ["privacy.clearOnShutdown.siteSettings"],
};

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  JSONFile: "resource://gre/modules/JSONFile.sys.mjs",
});

function normalizeAuditData(data) {
  if (!data || typeof data != "object" || Array.isArray(data)) {
    return { entries: [] };
  }

  let entries = Array.isArray(data.entries) ? data.entries : [];
  return {
    entries: entries
      .filter(entry => entry && typeof entry == "object")
      .map(entry => ({
        timestamp:
          typeof entry.timestamp == "string"
            ? entry.timestamp
            : new Date(0).toISOString(),
        trigger: typeof entry.trigger == "string" ? entry.trigger : "manual",
        status: typeof entry.status == "string" ? entry.status : "success",
        itemsToClear: Array.isArray(entry.itemsToClear)
          ? [...new Set(entry.itemsToClear.filter(item => typeof item == "string"))]
          : [],
        ...(typeof entry.error == "string" ? { error: entry.error } : {}),
      })),
  };
}

function getExitItemsFromPrefs() {
  let items = [];
  for (let [item, pref] of Object.entries(EXIT_CATEGORY_PREFS)) {
    if (Services.prefs.getBoolPref(pref, false)) {
      items.push(item);
    }
  }
  return items;
}

function getMaxAuditEntries() {
  return Math.max(
    1,
    Services.prefs.getIntPref("afaq.cleanup.audit.maxEntries", 50)
  );
}

export const AfaqCleanupService = {
  PREF_BRANCH: "afaq.cleanup.",
  PREF_MODE: "afaq.cleanup.mode",
  PREF_SANITIZE_ON_SHUTDOWN: "privacy.sanitize.sanitizeOnShutdown",
  PREF_SHUTDOWN_BRANCH_LEGACY: "privacy.clearOnShutdown.",
  PREF_SHUTDOWN_BRANCH_V2: "privacy.clearOnShutdown_v2.",
  PERMISSION_TYPE: "afaq-cleanup",
  RULE_PRESERVE: "preserve",
  RULE_ALWAYS_CLEAR: "always-clear",

  _initialized: false,
  _auditStore: null,
  _auditStorePromise: null,
  _syncingPrefs: false,

  onStartup() {
    if (this._initialized) {
      return;
    }

    this._initialized = true;
    Services.prefs.addObserver(this.PREF_BRANCH, this, true);
    Services.prefs.addObserver(this.PREF_SANITIZE_ON_SHUTDOWN, this, true);
    Services.prefs.addObserver(this.PREF_SHUTDOWN_BRANCH_LEGACY, this, true);
    Services.prefs.addObserver(this.PREF_SHUTDOWN_BRANCH_V2, this, true);
    this._syncAfaqPrefsFromShutdownPrefs();
    this._syncShutdownPrefsFromAfaq();
    this._ensureAuditStore().catch(console.error);
  },

  observe(subject, topic, data) {
    if (topic != "nsPref:changed" || this._syncingPrefs) {
      return;
    }

    if (data.startsWith(this.PREF_BRANCH)) {
      this._syncShutdownPrefsFromAfaq();
      return;
    }

    if (
      data == this.PREF_SANITIZE_ON_SHUTDOWN ||
      data.startsWith(this.PREF_SHUTDOWN_BRANCH_LEGACY) ||
      data.startsWith(this.PREF_SHUTDOWN_BRANCH_V2)
    ) {
      this._syncAfaqPrefsFromShutdownPrefs();
    }
  },

  QueryInterface: ChromeUtils.generateQI([
    "nsIObserver",
    "nsISupportsWeakReference",
  ]),

  getAuditPath() {
    return PathUtils.join(PathUtils.profileDir, "afaq-cleanup-audit.json");
  },

  getItemsForTrigger(trigger) {
    if (trigger != "exit") {
      return [];
    }

    if (Services.prefs.getStringPref(this.PREF_MODE, "keep") != "exit") {
      return [];
    }

    return getExitItemsFromPrefs();
  },

  async recordSanitization({
    trigger = "manual",
    itemsToClear = [],
    status = "success",
    error = null,
  } = {}) {
    if (!Services.prefs.getBoolPref("afaq.cleanup.audit.enabled", true)) {
      return;
    }

    let normalizedItems = [
      ...new Set(itemsToClear.filter(item => typeof item == "string")),
    ].sort();
    if (!normalizedItems.length) {
      return;
    }

    let store = await this._ensureAuditStore();
    store.data.entries.unshift({
      timestamp: new Date().toISOString(),
      trigger,
      status,
      itemsToClear: normalizedItems,
      ...(error ? { error: String(error) } : {}),
    });
    store.data.entries.length = Math.min(
      store.data.entries.length,
      getMaxAuditEntries()
    );
    store.saveSoon();
  },

  async getAuditEntries() {
    let store = await this._ensureAuditStore();
    return store.data.entries.map(entry => ({
      ...entry,
      itemsToClear: [...entry.itemsToClear],
    }));
  },

  async clearAuditForTests() {
    let path = this.getAuditPath();
    if (this._auditStore) {
      this._auditStore.data = { entries: [] };
      await this._auditStore._save();
    }
    try {
      await IOUtils.remove(path);
    } catch (error) {
      if (!(DOMException.isInstance(error) && error.name == "NotFoundError")) {
        throw error;
      }
    }
  },

  async flushAuditStoreForTests() {
    let store = await this._ensureAuditStore();
    await store._save();
  },

  getExceptionRules() {
    let rules = [];
    Services.perms.getAllWithTypePrefix(this.PERMISSION_TYPE).forEach(perm => {
      if (perm.type != this.PERMISSION_TYPE || !isSupportedPrincipal(perm.principal)) {
        return;
      }

      let rule = this._capabilityToRule(perm.capability);
      if (!rule) {
        return;
      }

      rules.push({
        origin: perm.principal.origin,
        host: perm.principal.host,
        rule,
      });
    });

    rules.sort((left, right) => left.host.localeCompare(right.host));
    return rules;
  },

  setExceptionRule(principal, rule) {
    let capability = this._ruleToCapability(rule);
    if (!capability) {
      throw new Error(`Unsupported Afaq cleanup rule: ${rule}`);
    }

    Services.perms.addFromPrincipal(principal, this.PERMISSION_TYPE, capability);
  },

  removeExceptionRule(principal) {
    Services.perms.removeFromPrincipal(principal, this.PERMISSION_TYPE);
  },

  clearExceptionRulesForTests() {
    for (let rule of this.getExceptionRules()) {
      let principal =
        Services.scriptSecurityManager.createContentPrincipalFromOrigin(
          rule.origin
        );
      this.removeExceptionRule(principal);
    }
  },

  getExceptionRuleForPrincipal(principal) {
    if (!isSupportedPrincipal(principal)) {
      return null;
    }

    let matchedRule = null;

    for (let rule of this.getExceptionRules()) {
      let rulePrincipal =
        Services.scriptSecurityManager.createContentPrincipalFromOrigin(
          rule.origin
        );
      if (
        !rulePrincipal.host ||
        !principal.host ||
        !Services.eTLD.hasRootDomain(principal.host, rulePrincipal.host)
      ) {
        continue;
      }
      if (rule.rule == this.RULE_ALWAYS_CLEAR) {
        return rule.rule;
      }
      matchedRule = matchedRule || rule.rule;
    }

    return matchedRule;
  },

  splitPrincipalsByExceptionRules(principals) {
    let selected = [];
    let preserved = [];
    let forced = [];

    for (let principal of principals) {
      let rule = this.getExceptionRuleForPrincipal(principal);
      if (rule == this.RULE_PRESERVE) {
        preserved.push(principal);
        continue;
      }
      if (rule == this.RULE_ALWAYS_CLEAR) {
        forced.push(principal);
      }
      selected.push(principal);
    }

    return { selected, preserved, forced };
  },

  _setBoolPref(pref, value) {
    if (Services.prefs.getBoolPref(pref, false) == value) {
      return;
    }
    Services.prefs.setBoolPref(pref, value);
  },

  _setStringPref(pref, value) {
    if (Services.prefs.getStringPref(pref, "") == value) {
      return;
    }
    Services.prefs.setStringPref(pref, value);
  },

  _syncShutdownPrefsFromAfaq() {
    this._runPrefSync(() => {
      let itemsToClear = this.getItemsForTrigger("exit");
      let shouldSanitize = itemsToClear.length > 0;

      this._setBoolPref(this.PREF_SANITIZE_ON_SHUTDOWN, shouldSanitize);

      for (let [item, pref] of Object.entries(SHUTDOWN_V2_PREFS)) {
        this._setBoolPref(pref, shouldSanitize && itemsToClear.includes(item));
      }

      for (let [item, prefs] of Object.entries(SHUTDOWN_LEGACY_PREFS)) {
        let enabled = shouldSanitize && itemsToClear.includes(item);
        for (let pref of prefs) {
          this._setBoolPref(pref, enabled);
        }
      }
    });
  },

  _syncAfaqPrefsFromShutdownPrefs() {
    this._runPrefSync(() => {
      let itemsToClear = this._getExitItemsFromShutdownPrefs();

      this._setStringPref(
        this.PREF_MODE,
        itemsToClear.length ? "exit" : "keep"
      );

      for (let [item, pref] of Object.entries(EXIT_CATEGORY_PREFS)) {
        this._setBoolPref(pref, itemsToClear.includes(item));
      }
    });
  },

  _getExitItemsFromShutdownPrefs() {
    if (!Services.prefs.getBoolPref(this.PREF_SANITIZE_ON_SHUTDOWN, false)) {
      return [];
    }

    let items = new Set();
    for (let [item, pref] of Object.entries(SHUTDOWN_V2_PREFS)) {
      if (Services.prefs.getBoolPref(pref, false)) {
        items.add(item);
      }
    }

    for (let [item, prefs] of Object.entries(SHUTDOWN_LEGACY_PREFS)) {
      if (prefs.some(pref => Services.prefs.getBoolPref(pref, false))) {
        items.add(item);
      }
    }

    return [...items];
  },

  _runPrefSync(callback) {
    this._syncingPrefs = true;
    try {
      callback();
    } finally {
      this._syncingPrefs = false;
    }
  },

  _ruleToCapability(rule) {
    switch (rule) {
      case this.RULE_PRESERVE:
        return Ci.nsIPermissionManager.ALLOW_ACTION;
      case this.RULE_ALWAYS_CLEAR:
        return Ci.nsIPermissionManager.DENY_ACTION;
      default:
        return null;
    }
  },

  _capabilityToRule(capability) {
    switch (capability) {
      case Ci.nsIPermissionManager.ALLOW_ACTION:
        return this.RULE_PRESERVE;
      case Ci.nsIPermissionManager.DENY_ACTION:
        return this.RULE_ALWAYS_CLEAR;
      default:
        return null;
    }
  },

  async _ensureAuditStore() {
    if (this._auditStore) {
      return this._auditStore;
    }

    if (this._auditStorePromise) {
      return this._auditStorePromise;
    }

    let path = this.getAuditPath();
    let store = new lazy.JSONFile({
      path,
      saveDelayMs: 0,
      dataPostProcessor: normalizeAuditData,
      beforeSave() {
        return IOUtils.makeDirectory(PathUtils.parent(path), {
          ignoreExisting: true,
        });
      },
    });

    this._auditStorePromise = (async () => {
      await store.load();
      this._auditStore = store;
      return store;
    })();

    try {
      return await this._auditStorePromise;
    } finally {
      if (!this._auditStore) {
        this._auditStorePromise = null;
      }
    }
  },
};

function isSupportedPrincipal(principal) {
  return principal.schemeIs("http") || principal.schemeIs("https");
}
