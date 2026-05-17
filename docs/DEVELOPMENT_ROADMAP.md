# Development Roadmap

This roadmap defines the path from the current Firefox-based privacy fork to a polished, competitive privacy browser release. It focuses on practical anti-tracking, fingerprinting resistance, auditable defaults, clean packaging, and a professional release process.

## Product Target

Afaq Browser should become a privacy-first desktop browser for users who want strong defaults without maintaining a personal hardening script. The browser should be understandable, testable, and safe to use as a daily driver.

The competitive benchmark is the class of browsers represented by Mullvad Browser and Tor Browser, while the product direction remains distinct:

- No Tor anonymity claim unless Tor routing is actually implemented.
- No VPN claim unless a real VPN product is integrated.
- Strong local privacy controls and diagnostics.
- A stable shared configuration that reduces uniqueness.
- Better transparency around what each protection does.

## Quality Bar

A feature is release-ready only when it meets these conditions:

- The behavior is controlled by a documented preference or product policy.
- The user-facing text explains the tradeoff without exaggeration.
- Automated tests cover the default state and at least one changed state.
- The feature does not silently add a new remote service.
- The implementation survives a fresh profile and an upgraded profile.
- The release notes can describe the behavior in one clear paragraph.

## Phase 1: Foundation Cleanup

Goal: remove inherited project noise and make the fork coherent.

Deliverables:

- Replace upstream README and contribution text with product-specific documentation.
- Standardize product naming across `Afaq Browser`, package IDs, installer strings, Flatpak metadata, desktop files, and preference text.
- Keep `Afaq Browser` as the public brand unless a formal rename is approved.
- Audit all visible `Firefox`, `Mozilla`, and `Afaq Browser` strings.
- Remove or rewrite upstream-only GitHub workflow messaging.
- Add a maintainer-facing build and release checklist.
- Document all custom browser modules and the preferences they own.

Acceptance checks:

- A fresh checkout has no misleading upstream README.
- The product name is consistent in the application menu, installer, about dialog, package metadata, and settings UI.
- Search, homepage, and new-tab behavior match the documented product identity.

## Phase 2: Privacy Baseline

Goal: make the default profile defensible and testable.

Deliverables:

- Define a single default privacy profile for first launch.
- Audit every preference in `AfaqSecurityLevelService`.
- Remove preferences that are obsolete, renamed, ignored, or ineffective in the current Firefox base.
- Add tests for all privacy-sensitive defaults.
- Add tests for transitions between `standard`, `hardened`, and `maximum`.
- Add a diagnostics view that reports the active privacy posture from live prefs.
- Add a policy document for remote services and endpoints.

Acceptance checks:

- A clean profile starts in the documented default level.
- Switching levels changes only the intended preference set.
- Diagnostics match the actual live browser state.
- No remote service is enabled without documentation.

## Phase 3: Fingerprinting Strategy

Goal: reduce uniqueness without encouraging dangerous user customization.

Deliverables:

- Define the shared fingerprint target for each supported platform.
- Keep high-risk fingerprinting controls inside security levels instead of exposing too many independent toggles.
- Validate letterboxing, font visibility, language spoofing, canvas behavior, WebGL, touch events, hardware concurrency, media devices, and WebRTC exposure.
- Add regression tests for known fingerprint surfaces where practical.
- Document why excessive customization can increase uniqueness.
- Add a compatibility matrix for common site categories.

Acceptance checks:

- The default profile avoids unnecessary uniqueness.
- Users can understand why some controls are grouped.
- The browser does not present fingerprinting protection as perfect anonymity.

## Phase 4: Cleanup, Storage, and Sessions

Goal: make local data control stronger than ordinary private-browsing toggles.

Deliverables:

- Fix and verify cleanup exception matching for root domains and subdomains.
- Add tests for preserve and always-clear precedence.
- Add profile-level cleanup diagnostics.
- Expose the local cleanup audit in settings.
- Document what is and is not stored in the audit log.
- Verify interactions with cookies, cache, service workers, EME, local storage, permissions, and session restore.
- Add a one-click temporary session mode if it can be implemented without breaking the shared fingerprint strategy.

Acceptance checks:

- Site exceptions behave correctly for root domains and subdomains.
- Cleanup does not preserve data that the UI says will be cleared.
- The audit log is local-only and contains no sensitive URL history beyond the documented scope.

## Phase 5: Search and New Tab

Goal: make the default browsing entry point polished, private, and maintainable.

Deliverables:

- Finalize default search engine strategy.
- Remove any search telemetry or partner-code behavior that conflicts with the product model.
- Improve the start page with keyboard-first behavior, responsive polish, and accessibility verification.
- Add tests for search URL generation.
- Add settings integration for supported search engines.
- Document why each bundled engine is included.

Acceptance checks:

- Search submissions use the documented endpoint and query parameter.
- The start page works without network calls before user action.
- The page has no external script, font, analytics, or tracking dependency.

## Phase 6: Extension and Content Blocking Policy

Goal: make bundled extension behavior auditable.

Deliverables:

- Document the bundled uBlock Origin version, source, license, update policy, and default filter lists.
- Decide whether extension updates are browser-managed, user-managed, or pinned per release.
- Verify extension signing and installation behavior in release builds.
- Add a policy for future bundled extensions.
- Avoid bundling extensions that create a rare fingerprint unless the product impact is clear.

Acceptance checks:

- Users and auditors can identify exactly what extension code shipped.
- Filter list updates are documented.
- The extension cannot silently weaken browser privacy defaults.

## Phase 7: Network Privacy

Goal: make network behavior explicit and user-controlled.

Deliverables:

- Document DNS-over-HTTPS behavior and fallback modes.
- Verify Mullvad DNS endpoint behavior in all supported platforms.
- Add a clear UI for DoH off, fallback, and strict modes.
- Decide whether proxy or VPN detection should influence defaults.
- Avoid claims that DNS-over-HTTPS hides browsing from all network observers.
- Add tests for TRR preference transitions.

Acceptance checks:

- The selected DoH mode maps to the expected Firefox networking preferences.
- Network diagnostics explain the active mode.
- Users can disable or change secure DNS without hidden state conflicts.

## Phase 8: Packaging and Distribution

Goal: ship professional builds that users can verify.

Deliverables:

- Linux packages with correct desktop identity.
- Windows installer with correct registry keys, icons, certificate metadata, and update channel.
- macOS bundle with correct bundle ID, icon set, notarization plan, and signing plan.
- Release signing for every platform.
- Update server design and signing process.
- Reproducible build documentation or independent verification instructions.
- Checksums and detached signatures for release artifacts.

Acceptance checks:

- Installed applications never identify as Firefox unless required by upstream internals.
- Updates are signed and cannot be replaced by unsigned artifacts.
- Release artifacts can be verified by users.

## Phase 9: CI and Release Engineering

Goal: prevent privacy regressions before they ship.

Deliverables:

- Add CI jobs for formatting, linting, xpcshell tests, browser preference tests, and packaging smoke tests.
- Add a privacy-default snapshot test for fresh profiles.
- Add a release checklist that blocks on failing privacy tests.
- Add artifact retention for build logs.
- Track upstream Firefox merge points.
- Add a process for updating bundled extensions and search configuration.

Acceptance checks:

- A pull request cannot change privacy defaults without test updates.
- Release builds are traceable to source state and build logs.
- Upstream merges are reviewed for privacy-sensitive preference changes.

## Phase 10: Advanced Differentiators

Goal: move beyond a hardening fork into a refined privacy product.

Candidate features:

- Local privacy diagnostics dashboard.
- Site breakage assistant that suggests temporary, scoped relaxations.
- Temporary identity containers with automatic cleanup.
- Per-site compatibility overrides that expire.
- Local-only release notes for changed privacy behavior.
- Privacy regression report generated during release builds.
- Optional external VPN/proxy awareness without bundling or requiring a provider.
- Fingerprint stability test harness for internal QA.

Acceptance checks:

- Advanced features do not increase default fingerprint uniqueness.
- Every override is visible, reversible, and scoped.
- The browser remains understandable to non-expert users.

## Immediate Engineering Priorities

1. Complete build-backed verification for cleanup exception root-domain matching.
2. Finalize the public product name.
3. Audit all custom security preferences against the current Firefox base.
4. Add a privacy-default snapshot test.
5. Document bundled uBlock Origin versioning and update behavior.
6. Replace upstream package metadata that still references Firefox or Mozilla-only workflows.
7. Build a release checklist for Linux first, then Windows and macOS.

## Non-Goals

- Claiming anonymity without Tor routing.
- Claiming VPN protection without a VPN.
- Adding many independent hardening toggles that make users more unique.
- Shipping remote services without documentation.
- Hiding compatibility costs from users.
- Depending on closed-source privacy components.

## Release Candidate Definition

A release candidate is ready when:

- The browser builds cleanly from a fresh environment.
- The focused Afaq Browser test suite passes.
- A fresh profile matches the documented default privacy state.
- Branding is consistent across supported platforms.
- Update and signing behavior is documented.
- Release artifacts are checksummed and signed.
- The README, roadmap, security notes, and release notes match the actual product behavior.
