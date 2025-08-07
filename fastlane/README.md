fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios setup_signing

```sh
[bundle exec] fastlane ios setup_signing
```

Setup certificates and provisioning profiles

### ios register_my_device

```sh
[bundle exec] fastlane ios register_my_device
```

Register device

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build iOS app for TestFlight/App Store beta distribution

### ios export_ipa

```sh
[bundle exec] fastlane ios export_ipa
```

Build with Tauri and export .ipa

### ios build_for_testflight

```sh
[bundle exec] fastlane ios build_for_testflight
```

Build and export for TestFlight distribution

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
