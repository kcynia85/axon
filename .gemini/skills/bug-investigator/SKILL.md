---
name: bug-investigator
description: Use this skill when debugging runtime errors, failing tests, or unexpected behavior in code.
---

# Bug Investigator Skill

This skill investigates bugs and identifies the root cause.

## Goals

- find the root cause of errors
- analyze stack traces
- suggest minimal fixes

## Inputs

Possible inputs:

- stack traces
- error logs
- failing tests
- problematic code

## Workflow

1. Read the error message.
2. Analyze stack trace.
3. Identify the affected module.
4. Inspect related code.
5. Identify possible root causes.
6. Suggest fixes.

## Rules

- prioritize root cause analysis
- avoid guessing
- verify assumptions using code

## Output

Provide:

- root cause explanation
- affected files
- recommended fix