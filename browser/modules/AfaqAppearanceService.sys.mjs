const DEFAULT_THEME_ID = "firefox-compact-dark@mozilla.org";
const DEFAULT_THEME_FALLBACK_ID = "default-theme@mozilla.org";

function hasUserValue(pref) {
  return Services.prefs.prefHasUserValue(pref);
}

export const AfaqAppearanceService = {
  PREF_INITIALIZED: "afaq.appearance.initialized",

  _initialized: false,

  onStartup() {
    if (this._initialized) {
      return;
    }

    this._initialized = true;
    this.applyDefaults();
  },

  applyDefaults() {
    let themeID = Services.prefs.getStringPref("extensions.activeThemeID", "");
    if (themeID == "" || themeID == DEFAULT_THEME_FALLBACK_ID) {
      Services.prefs.setStringPref("extensions.activeThemeID", DEFAULT_THEME_ID);
    }

    if (!hasUserValue("ui.systemUsesDarkTheme")) {
      Services.prefs.setIntPref("ui.systemUsesDarkTheme", 1);
    }

    if (!hasUserValue("browser.theme.toolbar-theme")) {
      Services.prefs.setIntPref("browser.theme.toolbar-theme", 0);
    }

    if (!hasUserValue("browser.theme.content-theme")) {
      Services.prefs.setIntPref("browser.theme.content-theme", 0);
    }

    Services.prefs.setBoolPref(this.PREF_INITIALIZED, true);
  },
};
