# @itk-viewer/viewer

## 0.2.5

### Patch Changes

- c13abd2: Add view-2d-vtkjs. Fix computeRanges.
- 991d042: Performance improvements to canvas blitting and render loop
- 14817ae: Load image with bounded by clip bounds.
- Updated dependencies [c13abd2]
- Updated dependencies [14817ae]
  - @itk-viewer/io@0.1.5

## 0.2.4

### Patch Changes

- 7163009: Remote renderer changes rendered frame size based on client canvas size.
- 0219988: remote-viewport clips rendered image space.
- 8f26a13: Add WebRTC for remote-viewport and fix framerate based image scale picking.
- Updated dependencies [0219988]
- Updated dependencies [8f26a13]
  - @itk-viewer/io@0.1.4

## 0.2.3

### Patch Changes

- 6191b9a: Change remote image scale based on fpsWatcher. Includes image memory size check.
- Updated dependencies [6191b9a]
  - @itk-viewer/io@0.1.3

## 0.2.2

### Patch Changes

- e187ce4: Remote-Zarr service from remote-image package returns a Zarr store to create a ZarrMultiscaleSpatialImage for use by remote-viewport. Adds reset camera logic in viewport actor.

## 0.2.1

### Patch Changes

- b85a579: Route MultiscaleSpatialImages through Viewport actor to RemoteViewport actor.
- Updated dependencies [b85a579]
  - @itk-viewer/io@0.1.2

## 0.2.0

### Minor Changes

- bcf72aa: Add HTJ2K remote-viewport image transfer.

## 0.1.1

### Patch Changes

- Fix workspace monorepo dependances.
- Updated dependencies
  - @itk-viewer/io@0.1.1

## 0.1.0

### Minor Changes

- cf4d55c: Remote Hypha viewport

### Patch Changes

- Updated dependencies [cf4d55c]
  - @itk-viewer/io@0.1.0
