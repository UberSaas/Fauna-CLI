import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { FaunaService } from '../../../fauna/infrastructure/service/FaunaService'
import { CreateDatabase } from '../../../fauna/application/command/database/CreateDatabase'

export class CreateDatabaseAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create database')
    const client = new FaunaService().getClient()

    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    return new CreateDatabase()
      .execute(client, name.value)
      .then(() => {
        spinner.succeed(chalk.green('Database created'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.red('Database could not be created'))
        console.error(error)
      })
  }
}
