import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateIndex } from '../../../fauna/application/command/index/CreateIndex'

export class CreateSearchIndexesAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create search indexes')

    const collectionNameInput = inputs.find((value: Input) => {
      return value.name === 'collectionName'
    })

    const searchFieldsInput = inputs.find((value: Input) => {
      return value.name === 'searchFields'
    })

    const requiredFilterInput = inputs.find((value: Input) => {
      return value.name === 'requiredFilter'
    })

    if (
      collectionNameInput == null ||
      typeof collectionNameInput.value !== 'string'
    ) {
      throw new Error('Incorrect collectionName')
    }

    if (
      searchFieldsInput == null ||
      typeof searchFieldsInput.value !== 'string'
    ) {
      throw new Error('Incorrect searchFields')
    }

    const collectionName = collectionNameInput.value
    const searchFields = searchFieldsInput.value.split(',')
    const requiredFilter =
      requiredFilterInput !== undefined &&
      typeof requiredFilterInput.value === 'string'
        ? requiredFilterInput.value
        : undefined

    const subAction =
      options && options.find((option) => option.name === 'subAction')

    spinner.info(chalk.cyanBright('\nSearch indexes created:'))

    for (const searchField of searchFields) {
      let indexName = collectionName + 'SearchBy'
      const terms = []

      if (requiredFilter !== undefined) {
        indexName +=
          requiredFilter.charAt(0).toUpperCase() +
          requiredFilter.slice(1) +
          'And'
        terms.push(requiredFilter)
      }

      indexName += searchField.charAt(0).toUpperCase() + searchField.slice(1)
      terms.push(searchField)

      await new CreateIndex()
        .execute(indexName, collectionName, false, terms)
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${indexName}`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Index '${indexName}' could not be created`)
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action create:indexes:search completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
