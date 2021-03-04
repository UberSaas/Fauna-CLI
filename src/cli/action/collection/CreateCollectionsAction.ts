import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateCollections } from '../../../fauna/application/command/collection/CreateCollections'

export class CreateCollectionsAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create collection')

    const names = inputs.find((value: Input) => {
      return value.name === 'names'
    })

    if (names == null || typeof names.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const collectionNames = names.value.split(',')
    const subAction =
      options && options.find((option) => option.name === 'subAction')

    spinner.info(chalk.cyanBright('\nCollections created:'))

    for (const collectionName of collectionNames) {
      await new CreateCollections()
        .execute([collectionName])
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${collectionName}`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(
              `Collection '${collectionName}' could not be created`
            )
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action create:collections completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
