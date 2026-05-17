# Build Optimization

Afaq Browser is based on the Firefox source tree, so a full native build can be slow and large. Use an artifact build for interface work, branding, preferences UI, JavaScript, CSS, and packaging iteration.

## Fast UI Build

```bash
cp build/mozconfig.afaq-artifact .mozconfig
./mach bootstrap
./mach build
./mach run
```

The same flow is available through the local helper:

```bash
tools/afaq-dev configure
tools/afaq-dev build
tools/afaq-dev run
```

After the first successful build, use:

```bash
tools/afaq-dev faster
tools/afaq-dev run
```

This profile stores output in `obj-afaq-artifact` and disables local test packaging. That keeps iteration smaller for UI work.

## When Not To Use It

Do not use the artifact profile for C++, Rust, Gecko engine, SpiderMonkey, media, networking, or security-core changes. Use a normal full build for those areas.

Artifact builds also require a real Git or Mercurial checkout so Mozilla's artifact tool can map the source revision to a prebuilt package. If the source tree was unpacked from an archive and has no `.git` or `.hg` metadata, use the full development profile:

```bash
tools/afaq-dev configure-full
tools/afaq-dev build-full
```

This stores output in `obj-afaq-full`. It is slower and larger than artifact mode, but it works without artifact revision lookup.

## Cleanup

To remove generated build output:

```bash
./mach clobber
```

If multiple object directories exist, remove only the generated `obj-*` directories you no longer need. Do not remove source directories such as `third_party`, `dom`, `js`, `browser`, or `toolkit`.

## Size Notes

The largest source directories are expected to be `third_party`, `js`, `dom`, `mobile`, `toolkit`, and `browser`. They are part of the Firefox source tree and should not be treated as disposable build output.

The local `.mozbuild` directory stores toolchains, virtual environments, and cached support files. Removing it can recover space, but the next bootstrap or build will be slower because the tools must be recreated.

## Fast Privacy Audit

Run the static Afaq Browser privacy audit before packaging or release work:

```bash
tools/afaq-dev audit
```

This check verifies that the Afaq branding defaults and security levels keep telemetry, studies, sponsored surfaces, Pocket, Relay, quick suggestions, and remote recommendation features disabled.
