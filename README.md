# 500 LED Simulator

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-500led/blob/master/LICENSE.txt) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

This package provides a Christmas tree simulator for Matt Parker's 500 LED tree project.
The simulator is implemented as a Flarum extension with two main features:

- A homepage where custom files can be dragged and dropped
- A `[tree]<url>[/tree]` bbcode that can be shared inside of posts

## Technology

- [Flarum](https://flarum.org/): community framework
- [Mithril](https://mithril.js.org/): javascript framework
- [Three.js](https://threejs.org/): 3D rendering

## Installation

Use online at <https://500led.winkelmann.dev/>

This extension is not published on Packagist.

To run it locally, you can install Flarum, then clone the extension in your `packages` folder as described in the [developer documentation](https://docs.flarum.org/extend/start#extension-packaging).

The extension provides a template for the FoF Upload extension.
Ideal settings for FoF Upload: MIME type `^text\/(plain|csv)$` and **User-provided file extensions**: `csv`

The homepage is intended to be switched to "Tree" under "Admin > Basics"

On the demo website, the [Custom Paths](https://kilowhat.net/flarum/extensions/custom-paths) extension is used to alter some URLs.

## Links

- [Simulator source code](https://github.com/clarkwinkelmann/flarum-500led)
- [Matt's repository](https://github.com/standupmaths/xmastree2021)
- [Harvard's repository](https://github.com/GSD6338/XmasTree)
