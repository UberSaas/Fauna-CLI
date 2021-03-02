import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetCollectionNames } from '../../../fauna/application/query/collection/GetCollectionNames'

export class ListCollectionsAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('List collections')

    return new GetCollectionNames()
      .execute()
      .then((collectionNames) => {
        if (collectionNames.length === 0) {
          spinner.succeed(chalk.green('No collections'))
        }

        collectionNames.forEach((collectionName) => {
          spinner.succeed(chalk.green(collectionName))
        })
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Collections could not be listed`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
