import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'

export class TestAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    console.info(chalk.green('Test action started'))

    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
      .then(() => {
        console.info(chalk.green('Action completed'))
      })
      .catch((error) => {
        console.error('Action failed')
        console.error(error)
      })
  }
}
