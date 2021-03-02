import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { FaunaService } from '../../../fauna/infrastructure/service/FaunaService'
import { prompt } from 'enquirer'
import { DeleteCollection } from '../../../fauna/application/command/collection/DeleteCollection'

export class DeleteCollectionAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const response: any = await prompt({
      type: 'confirm',
      initial: false,
      name: 'confirmed',
      message: `Sure you want to delete collection ${chalk.yellowBright(
        name.value
      )}?`,
    })

    if (!response.confirmed) {
      process.exit(0)
    }

    const spinner = ora().start('Delete collection')
    const client = new FaunaService().getClient()

    return new DeleteCollection()
      .execute(client, name.value)
      .then(() => {
        spinner.succeed(chalk.green('Collection deleted'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.red('Collection could not be deleted'))
        console.error(error)
      })
  }
}
