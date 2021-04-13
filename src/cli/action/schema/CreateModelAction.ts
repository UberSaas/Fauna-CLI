import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateCollections } from '../../../fauna/application/command/collection/CreateCollections'
import { CreateSearchIndexesAction } from '../index/CreateSearchIndexesAction'
import { CreateSortIndexesAction } from '../index/CreateSortIndexesAction'

export class CreateModelAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create model')

    const subAction =
      options && options.find((option) => option.name === 'subAction')

    // Make sure subActions aren't exited
    options = options === undefined ? [] : options
    options.push({ name: 'subAction', value: true })

    const nameInput = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    const requiredFilterInput = inputs.find((value: Input) => {
      return value.name === 'requiredFilter'
    })

    const searchFieldsInput = inputs.find((value: Input) => {
      return value.name === 'searchFields'
    })

    const sortFieldsInput = inputs.find((value: Input) => {
      return value.name === 'sortFields'
    })

    const uniqueFieldsInput = inputs.find((value: Input) => {
      return value.name === 'uniqueFields'
    })

    const multiSortInput = inputs.find((value: Input) => {
      return value.name === 'multiSort'
    })

    if (nameInput == null || typeof nameInput.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const modelName: string = nameInput.value
    const requiredFilter =
      requiredFilterInput !== undefined &&
      typeof requiredFilterInput.value === 'string'
        ? requiredFilterInput.value
        : undefined
    const searchFields =
      searchFieldsInput !== undefined &&
      typeof searchFieldsInput.value === 'string'
        ? searchFieldsInput.value.split(',')
        : undefined
    const sortFields =
      sortFieldsInput !== undefined && typeof sortFieldsInput.value === 'string'
        ? sortFieldsInput.value.split(',')
        : undefined
    const uniqueFields =
      uniqueFieldsInput !== undefined &&
      typeof uniqueFieldsInput.value === 'string'
        ? uniqueFieldsInput.value.split(',')
        : undefined
    const multiSort: undefined | boolean =
      multiSortInput !== undefined && typeof multiSortInput.value === 'boolean'
        ? multiSortInput.value
        : undefined

    spinner.info(chalk.cyanBright('\nModel created:'))

    /**
     * Create collection
     */
    await new CreateCollections()
      .execute([modelName])
      .then(() => {
        spinner.info(chalk.yellowBright(`- ${modelName}`))
      })
      .catch((error: any) => {
        spinner.fail(
          chalk.redBright(`Collection '${modelName}' could not be created`)
        )
        spinner.fail(chalk.redBright(error.message))
      })

    /**
     * Create search indexes
     */
    if (searchFields !== undefined) {
      const searchInputs: Input[] = [
        {
          name: 'collectionName',
          value: modelName,
        },
        {
          name: 'searchFields',
          value: searchFields.join(','),
        },
      ]

      if (requiredFilter !== undefined) {
        searchInputs.push({
          name: 'requiredFilter',
          value: requiredFilter,
        })
      }

      if (uniqueFields !== undefined) {
        searchInputs.push({
          name: 'uniqueFields',
          value: uniqueFields.join(','),
        })
      }

      await new CreateSearchIndexesAction().handle(searchInputs, options)
    }

    /**
     * Create sort indexes
     */
    if (sortFields !== undefined) {
      const sortInputs: Input[] = [
        {
          name: 'collectionName',
          value: modelName,
        },
        {
          name: 'sortFields',
          value: sortFields.join(','),
        },
      ]

      if (multiSort !== undefined) {
        sortInputs.push({
          name: 'multiSort',
          value: multiSort,
        })
      }

      await new CreateSortIndexesAction().handle(sortInputs, options)
    }

    spinner.succeed(chalk.green('Action create:model completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
