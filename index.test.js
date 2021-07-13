const core = require('@actions/core')
const git = require('isomorphic-git')

const githubSha = process.env.GITHUB_SHA
let output

describe('conventional-commits-parser-action', () => {
  beforeEach(() => {
    output = {}
    core.setOutput = (name, value) => {
      output[name] = value
    }
  })

  test('commit message with no scope', async () => {
    git.readCommit = () => {
      return { commit: { message: 'fix: a really weird bug' } }
    }
    const action = require('.')
    const expected = {
      commit_parsed: true,
      type: 'fix',
      text: 'a really weird bug'
    }
    await action.main()
    expect(output).toEqual(expected)
  })

  test('commit message with scope', async () => {
    git.readCommit = () => {
      return { commit: { message: 'feat(parser): add support for scopes' } }
    }
    const action = require('.')
    const expected = {
      commit_parsed: true,
      type: 'feat',
      scope: 'parser',
      text: 'add support for scopes'
    }
    await action.main()
    expect(output).toEqual(expected)
  })

  test('commit message with breaking change marker', async () => {
    git.readCommit = () => {
      return { commit: { message: 'feat!: add support for scopes' } }
    }
    const action = require('.')
    const expected = {
      commit_parsed: true,
      type: 'feat',
      breaking_change: true,
      text: 'add support for scopes'
    }
    await action.main()
    expect(output).toEqual(expected)
  })

  test('commit_parsed should be false when ":" token is missing', async () => {
    git.readCommit = () => {
      return { commit: { message: 'feat add support for scopes' } }
    }
    const action = require('.')
    const expected = {
      commit_parsed: false
    }
    await action.main()
    expect(output).toEqual(expected)
  })
})

process.env.GITHUB_SHA = githubSha
