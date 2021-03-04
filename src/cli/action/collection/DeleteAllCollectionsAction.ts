import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetCollectionNames } from '../../../fauna/application/query/collection/GetCollectionNames'
import { DeleteCollections } from '../../../fauna/application/command/collection/DeleteCollections'
import { prompt } from 'enquirer'

export class DeleteAllCollectionsAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const force = options && options.find((option) => option.name === 'force')

    if (force === undefined || !force.value) {
      const response: any = await prompt({
        type: 'confirm',
        initial: false,
        name: 'confirmed',
        message: `Are you sure you want to delete all collections?`,
      })

      if (!response.confirmed) {
        process.exit(0)
      }
    }

    const spinner = ora().start('Delete all collections')

    await new GetCollectionNames()
      .execute()
      .then(async (collectionNames) => {
        if (collectionNames.length === 0) {
          spinner.succeed(chalk.green('No collections'))
        }

        const deleteCollections = new DeleteCollections()
        for (const collectionName of collectionNames) {
          await deleteCollections
            .execute([collectionName])
            .then(() => {
              spinner.succeed(
                chalk.green(`Collection '${collectionName}' deleted`)
              )
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

        spinner.succeed(chalk.green('Action collections:delete:all completed'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Collections could not be deleted`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
