# conventional-commits-parser-action

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A GitHub Action to parse commit and set outputs based on conventional commits.

## Setup

```yaml
on:
  push:
    branches:
      - main
name: test
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: higebu/conventional-commits-parser-action@v1
        id: parser
      - run: |
          echo 'this step will be run if the commit type is `fix`'
        if: ${{ steps.paser.outputs.type == 'fix' }}

```

## Configuration

| output | description |
|:---:|---|
| `commit_parsed` | `true` if the commit was parsed, `false` otherwise |
| `type` | The commit type |
| `scope` | The commit scope |
| `breaking_change` | `true` if the commit is breaking change, `false` otherwise |
| `text` | The commit text |
