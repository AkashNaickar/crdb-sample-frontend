# Security Policy

## Scope

This repository ships a static, client-only website (plain HTML/CSS/JS). There is
no server-side code, database, or authentication here, so the attack surface is
limited to what a static host serves.

## Reporting a vulnerability

Please report suspected vulnerabilities privately rather than in a public issue:

- Email: **akashnaickar@gmail.com**
- Or use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
  for this repository.

Include the affected file or URL, steps to reproduce, and the impact you expect.
You can expect an acknowledgement within a few days.

## Third-party assets and embedded keys

This project is a static rebuild that captures markup, scripts, fonts, and images
from a published third-party website. Some captured client-side scripts contain
public analytics/wrapper keys belonging to that third party (for example a
PostHog project key and a Dub publishable key). These are not credentials for
this project, they are not used by the deliverable, and they are not secrets in
the "rotate immediately" sense — public client keys are designed to be embedded
in browser code. They are called out here so nobody mistakes them for this
project's own credentials. If you are the owner of those keys and would like them
removed, open an issue and they will be stripped.

## Supported versions

This is a demo repository with no versioned releases. Fixes land on `main`.
