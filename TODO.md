# TODO: Fix "Download Blocked by Browser Security" Error

## Steps
- [x] Fix `logoImg` loading to prevent canvas tainting (use data URL)
- [x] Fix `bgImg` fallback loading to prevent canvas tainting (use data URL + crossOrigin)
- [x] Rewrite `downloadCanvasImage()` to use `toBlob()` + `URL.createObjectURL()` instead of `toDataURL()`
- [x] Add robust fallback download if the canvas is still tainted
- [x] Restore background image preview (bgImg loads directly with crossOrigin='anonymous')
- [x] Test download functionality
