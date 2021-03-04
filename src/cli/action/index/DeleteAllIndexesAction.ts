import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetIndexNames } from '../../../fauna/application/query/index/GetIndexNames'
import { DeleteIndexes } from '../../../fauna/application/command/index/DeleteIndexes'
import { prompt } from 'enquirer'

export class DeleteAllIndexesAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const force = options && options.find((option) => option.name === 'force')
    const subAction =
      options && options.find((option) => option.name === 'subAction')

    if (force === undefined || !force.value) {
      const response: any = await prompt({
        type: 'confirm',
        initial: false,
        name: 'confirmed',
        message: `Are you sure you want to delete all indexes?`,
      })

      if (!response.confirmed) {
        process.exit(0)
      }
    }

    const spinner = ora().start('Delete all indexes')

    await new GetIndexNames()
      .execute()
      .then(async (indexNames) => {
        if (indexNames.length === 0) {
          spinner.info(chalk.cyanBright('\nNo indexes to delete'))
        } else {
          spinner.info(chalk.cyanBright('\nIndexes deleted:'))
        }

        const deleteIndexes = new DeleteIndexes()
        for (const indexName of indexNames) {
          await deleteIndexes
            .execute([indexName])
            .then(() => {
              spinner.info(chalk.yellowBright(`- ${indexName}`))
            })
            .catch((error: any) => {
              spinner.fail(
                chalk.redBright(`Index '${indexName}' could not be deleted`)
              )
              spinner.fail(chalk.redBright(error.message))
            })
        }

        spinner.succeed(chalk.green('Action delete:indexes:all completed'))

        if (!subAction) {
          process.exit(0)
        }
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Indexes could not be deleted`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
