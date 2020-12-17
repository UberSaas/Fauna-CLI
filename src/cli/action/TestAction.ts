import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'

export class TestAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Test action started')

    return new Promise((resolve) => {
      setTimeout(resolve, 5000)
    })
      .then(() => {
        spinner.succeed(chalk.green('Action completed'))
      })
      .catch((error) => {
        spinner.fail(chalk.red('Action failed'))
        console.error(error)
      })
  }
}
