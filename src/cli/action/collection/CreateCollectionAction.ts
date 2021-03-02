import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateCollection } from '../../../fauna/application/command/collection/CreateCollection'

export class CreateCollectionAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create collection')

    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    return new CreateCollection()
      .execute(name.value)
      .then(() => {
        spinner.succeed(chalk.green('Collection created'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright('Collection could not be created'))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
