import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { prompt } from 'enquirer'
import { DeleteCollections } from '../../../fauna/application/command/collection/DeleteCollections'

export class DeleteCollectionsAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const names = inputs.find((value: Input) => {
      return value.name === 'names'
    })

    if (names == null || typeof names.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const force = options && options.find((option) => option.name === 'force')
    const subAction =
      options && options.find((option) => option.name === 'subAction')

    if (force === undefined || !force.value) {
      const response: any = await prompt({
        type: 'confirm',
        initial: false,
        name: 'confirmed',
        message: `Are you sure you want to delete collection(s) ${chalk.yellowBright(
          names.value
        )}?`,
      })

      if (!response.confirmed) {
        process.exit(0)
      }
    }

    const spinner = ora().start('Delete collections')
    const collectionNames = names.value.split(',')

    spinner.info(chalk.cyanBright('\nCollections deleted:'))

    for (const collectionName of collectionNames) {
      await new DeleteCollections()
        .execute([collectionName])
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${collectionName}`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(
              `Collection '${collectionName}' could not be deleted`
            )
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action delete:collections completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
