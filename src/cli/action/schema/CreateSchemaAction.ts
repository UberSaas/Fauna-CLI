import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateCollections } from '../../../fauna/application/command/collection/CreateCollections'
import exampleSchema from '../../../../example/schema'
import { CreateIndex } from '../../../fauna/application/command/index/CreateIndex'
import { DatabaseSchema } from '../../../fauna/domain/schema/model/DatabaseSchema'
import { CreateSortIndexesAction } from '../index/CreateSortIndexesAction'
import { CreateSearchIndexesAction } from '../index/CreateSearchIndexesAction'

export class CreateSchemaAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create schema')

    // Make sure subActions aren't exited
    options = options === undefined ? [] : options
    options.push({ name: 'subAction', value: true })

    const schema: DatabaseSchema = exampleSchema

    const fileName = inputs.find((value: Input) => {
      return value.name === 'fileName'
    })

    if (fileName == null || typeof fileName.value !== 'string') {
      throw new Error('Incorrect fileName')
    }

    const subAction =
      options && options.find((option) => option.name === 'subAction')

    spinner.info(chalk.cyanBright('\nModels created:'))

    for (const model of schema.models) {
      spinner.info(chalk.cyanBright('\nModel:'))

      /**
       * Create collection
       */
      await new CreateCollections()
        .execute([model.name])
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${model.name}`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Collection '${model.name}' could not be created`)
          )
          spinner.fail(chalk.redBright(error.message))
        })

      /**
       * Create custom indexes
       */
      if (model.indexes !== undefined) {
        spinner.info(chalk.cyanBright('\nIndexes created:'))

        for (const index of model.indexes) {
          await new CreateIndex()
            .execute(
              index.name,
              model.name,
              index.unique,
              index.terms,
              index.values
            )
            .then(() => {
              spinner.info(chalk.yellowBright(`- ${index.name}`))
            })
            .catch((error: any) => {
              spinner.fail(
                chalk.redBright(`Index '${index.name}' could not be created`)
              )
              spinner.fail(chalk.redBright(error.message))
            })
        }
      }

      /**
       * Create search indexes
       */
      if (model.searchFields !== undefined) {
        const searchInputs: Input[] = [
          {
            name: 'collectionName',
            value: model.name,
          },
          {
            name: 'searchFields',
            value: model.searchFields.join(','),
          },
        ]

        if (model.requiredFilter !== undefined) {
          searchInputs.push({
            name: 'requiredFilter',
            value: model.requiredFilter,
          })
        }

        await new CreateSearchIndexesAction().handle(searchInputs, options)
      }

      /**
       * Create sort indexes
       */
      if (model.sortFields !== undefined) {
        const sortInputs: Input[] = [
          {
            name: 'collectionName',
            value: model.name,
          },
          {
            name: 'sortFields',
            value: model.sortFields.join(','),
          },
        ]

        if (model.multiSort !== undefined) {
          sortInputs.push({
            name: 'multiSort',
            value: model.multiSort,
          })
        }

        await new CreateSortIndexesAction().handle(sortInputs, options)
      }
    }

    spinner.succeed(chalk.green('Action create:collections completed'))

    process.exit(0)
  }
}
