import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import exampleSchema from '../../../../example/schema'
import { CreateIndex } from '../../../fauna/application/command/index/CreateIndex'
import { DatabaseSchema } from '../../../fauna/domain/schema/model/DatabaseSchema'
import { CreateModelAction } from './CreateModelAction'

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

    spinner.info(chalk.cyanBright('\nModels created:'))

    for (const model of schema.models) {
      const modelInputs: Input[] = [
        {
          name: 'name',
          value: model.name,
        },
      ]

      if (model.requiredFilter !== undefined) {
        modelInputs.push({
          name: 'requiredFilter',
          value: model.requiredFilter,
        })
      }

      if (model.searchFields !== undefined) {
        modelInputs.push({
          name: 'searchFields',
          value: model.searchFields.join(','),
        })
      }

      if (model.sortFields !== undefined) {
        modelInputs.push({
          name: 'sortFields',
          value: model.sortFields.join(','),
        })
      }

      if (model.uniqueFields !== undefined) {
        modelInputs.push({
          name: 'uniqueFields',
          value: model.uniqueFields.join(','),
        })
      }

      if (model.multiSort !== undefined) {
        modelInputs.push({
          name: 'multiSort',
          value: model.multiSort,
        })
      }

      await new CreateModelAction().handle(modelInputs, options)

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
    }

    spinner.succeed(chalk.green('Action create:collections completed'))

    process.exit(0)
  }
}
