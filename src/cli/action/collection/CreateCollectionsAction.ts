import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateCollections } from '../../../fauna/application/command/collection/CreateCollections'

export class CreateCollectionsAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create collection')

    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const collectionNames = name.value.split(',')

    for (const collectionName of collectionNames) {
      await new CreateCollections()
        .execute([collectionName])
        .then(() => {
          spinner.succeed(chalk.green(`Collection '${collectionName}' created`))
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

    spinner.succeed(chalk.green('Action collections:create completed'))
  }
}
