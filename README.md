# Afaq Browser

Afaq Browser is a privacy-focused desktop browser built on the Firefox source tree. It is designed for users who want strong anti-tracking defaults, practical fingerprinting resistance, controlled site-data cleanup, and a clean daily browsing experience without claiming Tor-style anonymity.

The project goal is to compete with serious privacy browsers such as Mullvad Browser and Tor Browser in the areas that matter most for everyday use: predictable defaults, a shared browser fingerprint, auditable hardening, minimal telemetry, and clear compatibility tradeoffs.

## Status

This repository is an active browser fork. The current source tree includes custom branding, a hardened start page, privacy-oriented search defaults, security-level controls, site-cleanup rules, and bundled privacy tooling.

The project is not yet a finished release channel. Before public distribution, the browser should complete the roadmap in [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md), especially release signing, update infrastructure, reproducible builds, privacy regression testing, and legal review of branding.

## Product Principles

- Privacy should be the default, not a hidden expert mode.
- Fingerprinting protection should prefer consistency over endless custom toggles.
- Security controls should explain their compatibility cost.
- Remote services should be disabled unless they provide clear user value.
- The browser should never imply VPN, Tor, or network anonymity when it does not provide them.
- Every privacy claim should be testable from the source tree or release artifacts.

## Current Capabilities

- Custom Afaq Browser branding under `browser/branding/afaq`.
- Hardened local start page at `chrome://browser/content/afaq-home/index.html`.
- Startpage and PrivAU search configuration with DuckDuckGo available from the start page.
- Default dark appearance through `AfaqAppearanceService`.
- Security levels through `AfaqSecurityLevelService`:
  - `standard` for broad compatibility with the privacy baseline enabled.
  - `hardened` as the recommended daily profile.
  - `maximum` for stronger restrictions with higher breakage risk.
- WebRTC policy control:
  - `protected` keeps WebRTC available while reducing local address exposure.
  - `disabled` removes the WebRTC surface for users who do not need calls or conferencing.
- Compatibility profile control:
  - `balanced` preserves the selected security level.
  - `troubleshoot` relaxes the most common breakage points without turning off the full privacy model.
- Exit-cleanup controls through `AfaqCleanupService`.
- Per-site cleanup exceptions for preserving or forcing site-data deletion.
- Local cleanup audit log stored in the browser profile.
- uBlock Origin bundled as a built-in browser extension.
- Telemetry, sponsored content, Mozilla experiments, and promotional surfaces disabled by default.
- DNS-over-HTTPS defaults configured for Mullvad DNS.
- Fingerprinting, query stripping, partitioning, prefetch, speculative connection, WebRTC, WebGL, PDF scripting, clipboard event, and permission defaults managed by browser-level security profiles.

## Privacy Model

Afaq Browser reduces tracking by combining several layers:

- Reduced network prefetching and speculative connections.
- Restricted third-party storage behavior.
- Global Privacy Control enabled.
- Query stripping enabled.
- Fingerprinting protection and Resist Fingerprinting enabled.
- Letterboxing available in hardened profiles.
- WebRTC disabled by default in hardened and maximum profiles.
- WebGL disabled in maximum mode.
- Remote safety checks disabled by default to avoid reputation-service lookups.
- Default search experience designed around privacy-focused engines.

This model improves browser privacy, but it does not hide your IP address, replace a VPN, route traffic through Tor, defeat all correlation attacks, or guarantee anonymity.

## Competitive Direction

Mullvad Browser is a useful benchmark because it brings Tor Browser privacy concepts to non-Tor browsing. Afaq Browser should aim for the same seriousness while adding a more transparent security-control layer, stronger local diagnostics, better cleanup auditing, and a documented release pipeline.

Target differentiators:

- Clear security levels with visible diagnostics.
- Auditable preference bundles for each privacy level.
- Local-only cleanup audit history.
- Built-in site-data exception rules.
- Privacy-preserving search choices without sponsored surfaces.
- Release artifacts that can be reproduced and independently verified.
- A test suite that checks privacy-sensitive defaults before every release.

## Repository Map

| Area | Path |
| --- | --- |
| Branding | `browser/branding/afaq` |
| Start page | `browser/base/content/afaq-home` |
| Appearance service | `browser/modules/AfaqAppearanceService.sys.mjs` |
| Security levels | `browser/modules/AfaqSecurityLevelService.sys.mjs` |
| Cleanup service | `browser/modules/AfaqCleanupService.sys.mjs` |
| Startup integration | `browser/components/BrowserGlue.sys.mjs` |
| Privacy preferences UI | `browser/components/preferences/privacy.js` |
| Search configuration | `services/settings/dumps/main/search-config-v2.json` |
| Built-in uBlock Origin | `browser/extensions/ublockorigin` |
| Privacy baseline | `docs/PRIVACY_BASELINE.md` |
| Roadmap | `docs/DEVELOPMENT_ROADMAP.md` |

## Build

Firefox-based source trees require a full platform toolchain. Use Mozilla's bootstrap flow first, then build the browser target.

```bash
./mach bootstrap
./mach build
./mach run
```

For interface and branding work, use the artifact profile in [Build Optimization](docs/BUILD_OPTIMIZATION.md).

```bash
tools/afaq-dev configure
tools/afaq-dev build
tools/afaq-dev run
```

For a faster development loop after the first build:

```bash
tools/afaq-dev faster
tools/afaq-dev run
```

If this source tree was unpacked without Git or Mercurial metadata, artifact mode cannot resolve Mozilla build artifacts. Use the full development profile instead:

```bash
tools/afaq-dev configure-full
tools/afaq-dev build-full
```

## Test

Run the focused Afaq Browser tests after privacy, cleanup, startup, or preferences changes.

```bash
./mach xpcshell-test browser/modules/test/unit/test_AfaqSecurityLevelService.js
./mach xpcshell-test browser/modules/test/unit/test_AfaqCleanupService.js
./mach test browser/components/preferences/tests/browser_afaqSecurityLevels.js
./mach test browser/components/preferences/tests/browser_afaqCleanupPreferences.js
```

Recommended broader checks before a release candidate:

```bash
tools/afaq-dev audit
./mach lint browser/modules browser/components/preferences
./mach test browser/modules/test/unit
./mach test browser/components/preferences/tests
```

## Development Workflow

1. Keep upstream Firefox changes isolated from Afaq Browser product changes.
2. Treat privacy defaults as product-critical behavior.
3. Add or update tests for every security-level, cleanup, search, or startup change.
4. Keep user-facing text clear, factual, and free of anonymity claims.
5. Record compatibility tradeoffs in the roadmap or release notes.
6. Avoid new remote dependencies unless they are documented and user-controlled.
7. Review every bundled extension and remote endpoint before release.

## Release Requirements

A public release should not be considered ready until these items are complete:

- Product naming is consistent across desktop files, installers, package metadata, preferences, and UI.
- Update endpoints are owned, signed, and documented.
- Release builds are reproducible or accompanied by a clear verification process.
- Privacy-sensitive preferences have automated regression tests.
- Bundled extensions have source, version, license, and update policy documented.
- Installer and application metadata no longer contain upstream placeholder text.
- Security reporting instructions are specific to Afaq Browser.

## Security

Report security issues privately before public disclosure. Until a dedicated process is published, use the maintainers' preferred private channel and include:

- Affected platform and build.
- Exact browser version or commit identifier.
- Reproduction steps.
- Expected and actual behavior.
- Logs, crash IDs, or proof-of-concept files when safe to share.

## References

- [Mullvad Browser FAQ by the Tor Project](https://support.torproject.org/mullvad-browser/faqs/what-is-mullvad-browser/)
- [Tor Browser Manual: privacy and fingerprinting overview](https://tb-manual.torproject.org/en-US/about/)
- [Firefox Source Documentation](https://firefox-source-docs.mozilla.org/)

## License

This source tree inherits Mozilla Firefox licensing structure. Most Mozilla-originated code is covered by the Mozilla Public License 2.0. Third-party components retain their own licenses in the relevant source directories.
