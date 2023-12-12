# Reflect changelog

## 1.1.1 - 2023-12-12

* Fix a regression on v1.1.0 regarding the mix of ES Module and CommonJS. Thanks @adrian-branescu

## 1.1.0 - 2023-12-08

* Additional options: newer only, file clone, and recently modified sync - #24 by @onfire4g05
* Updated development dependencies
* Updated compatibility with newer NodeJS and Bun versions

## 1.0.5 - 2020-07-22

* Run Jest tests using it as a devDependency again, after new issues
* Updated devDependencies

## 1.0.4 - 2020-03-16

* Run Jest tests through npx, removing its devDependency
* Update Rollup (on devDependencies)

## 1.0.3 - 2020-02-28

* Update devDependencies, incuding security updates

## 1.0.2 - 2019-07-18

* Update devDependencies, incuding security updates from `lodash`

## 1.0.1 - 2019-05-02

* Paths on option `exclude` are now relative to `src`
* Fix tests: recover `.gitkeep` files after tests that exclude them
* Tests on Travis passing on Linux and Mac!
* Tests on Appveyor passing on Windows!

## 1.0.0 - 2019-05-01

* First release, already with 100% of coverage!
* Properly handle mtimes comparison (working on Linux, at least)