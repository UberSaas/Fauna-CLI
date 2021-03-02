import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { FaunaService } from '../../../fauna/infrastructure/service/FaunaService'
import { CreateCollection } from '../../../fauna/application/command/collection/CreateCollection'

export class CreateCollectionAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create collection')
    const client = new FaunaService().getClient()

    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    return new CreateCollection()
      .execute(client, name.value)
      .then(() => {
        spinner.succeed(chalk.green('Collection created'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.red('Collection could not be created'))
        console.error(error)
      })
  }
}
