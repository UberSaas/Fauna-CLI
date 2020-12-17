#!/usr/bin/env node
import * as commander from 'commander'
import { CommanderStatic } from 'commander'
import { CommandLoader } from '../command'
import * as pkg from '../../../package.json'

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: '.env' })
}

const bootstrap = (): void => {
  const program: CommanderStatic = commander
  program.version(pkg.version).usage('<command> [options]')
  CommandLoader.load(program)
  commander.parse(process.argv)

  if (!program.args.length) {
    program.outputHelp()
  }
}

bootstrap()
