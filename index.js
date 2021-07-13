const core = require('@actions/core')
const github = require('@actions/github')
const { parser } = require('@conventional-commits/parser')
const visit = require('unist-util-visit')
const fs = require('fs')
const git = require('isomorphic-git')

async function main () {
  try {
    const result = await git.readCommit({ fs, dir: '.', oid: github.context.sha })
    const ast = parser(result.commit.message)
    let summary
    visit(ast, 'summary', (node) => {
      summary = node
    })
    visit(summary, (node) => {
      switch (node.type) {
        case 'type':
          core.setOutput('type', node.value)
          break
        case 'scope':
          core.setOutput('scope', node.value)
          break
        case 'breaking-change':
          core.setOutput('breaking_change', true)
          break
        case 'text':
          core.setOutput('text', node.value)
          break
        default:
          break
      }
    })
    core.setOutput('commit_parsed', true)
  } catch (err) {
    core.setOutput('commit_parsed', false)
    core.info(`parse failed: ${err.message}`)
  }
}

module.exports = { main }
