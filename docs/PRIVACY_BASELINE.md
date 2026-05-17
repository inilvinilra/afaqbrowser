# Privacy Baseline

Afaq Browser uses a privacy baseline that is applied from both branding defaults and security levels. The goal is to keep optional data sharing, remote recommendation systems, promotional surfaces, and non-essential personalization disabled unless a future product decision explicitly reintroduces them with user control.

## Baseline Scope

The baseline covers:

- Telemetry and health reporting.
- Usage pings and background telemetry senders.
- Normandy, studies, experiments, and remote feature enrollment.
- Personalized extension recommendations.
- Private attribution.
- Pocket and Relay integration.
- Sponsored or partner new-tab surfaces.
- Quick Suggest data collection.
- Search, trending, recent, and weather suggestions.
- Merino-backed URL bar suggestions.
- New-tab private pings and remote story feeds.

## Enforcement Points

Branding defaults live in `browser/branding/afaq/pref/firefox-branding.js`.

Security-level enforcement lives in `browser/modules/AfaqSecurityLevelService.sys.mjs`.

The static audit helper lives at `tools/afaq-privacy-audit` and can be run through:

```bash
tools/afaq-dev audit
```

## Product Rule

Any new remote service or promotional integration must define:

- The exact preference keys it uses.
- The user-visible control surface.
- The network endpoints it contacts.
- Whether it is enabled by default.
- The compatibility or product value that justifies it.
- A focused test or audit update that prevents accidental enablement.

## Non-Goals

This baseline does not provide network anonymity, IP masking, Tor routing, or VPN functionality. It reduces passive tracking, browser-originated remote calls, and fingerprinting surface area within a normal desktop browsing model.
