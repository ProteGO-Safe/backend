# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 4.4.3

### Added
- new cloud function for re-sending failed keys to the EFGS
- new cloud function for updating Poland COVID-19 statistics
- new cloud function for generating batch of PIN codes
- new function for sending push notifications for COVID-19 daily statistics

### Changed
- node version

## 4.4.2

### Added
- Configuration for firebase emulators

### Changed
- Refactor config class
- EFGS random keys use cryptographically strong random number generator
- EFGS random keys use strict report type: CONFIRMED_CLINICAL_DIAGNOSIS
- Different minimumRollingStart for EFGS random keys
- Single-use JWT token for uploading EN keys.

## 4.4.1

### Fixed
- problem with max memory size of the EFGS downloader web client

## 4.4.0

### Added

- new cloud function for downloading keys from the EFGS
- new cloud function for uploading keys to the EFGS
- new cloud function for uploading keys from the EFGS to the GENS

### Changed

- additional logs for cloud functions

## 4.3.1

### Changed

- additional validation for android safety-token

## 4.3.0

### Added
- new cloud function for generating subscription codes
- new cloud function for getting subscription codes
- new cloud function for creating subscriptions
- new cloud function for getting subscriptions
- new cloud function for updating subscriptions

## 4.1.0
 
Prepared first production Cloud Backend version
 
### Added
- new cloud function for generating pin codes
- new cloud scheduler for clearing expired pin codes 
- new cloud function for exchanging pin codes for access tokens
- new cloud function for uploading temporary exposure keys
- new cloud scheduler for parsing the government FAQ page
- new cloud scheduler for parsing the government advices page
- new cloud scheduler for parsing the government hospitals page
