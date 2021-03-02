import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { prompt } from 'enquirer'
import * as faunadb from 'faunadb'
const q = faunadb.query
import { FaunaService } from '../../fauna/infrastructure/service/FaunaService'

export class TestAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const response: any = await prompt({
      type: 'confirm',
      initial: false,
      name: 'confirmed',
      message: `Want to perform ${chalk.yellowBright('Test action')}?`,
    })

    if (!response.confirmed) {
      process.exit(0)
    }

    const spinner = ora().start('Test action started')
    const client = new FaunaService().getClient()

    const stages: string[] = ['production', 'internal']

    return client
      .query(
        q.Map(
          stages,
          q.Lambda((name) => q.CreateDatabase({ name }))
        )
      )
      .then(() => {
        spinner.succeed(chalk.green('Action completed'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.red('Action failed'))
        console.error(error)
      })
  }
}
