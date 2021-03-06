import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateIndex } from '../../../fauna/application/command/index/CreateIndex'

export class CreateSortIndexesAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create sort indexes')

    const collectionNameInput = inputs.find((value: Input) => {
      return value.name === 'collectionName'
    })

    const sortFieldsInput = inputs.find((value: Input) => {
      return value.name === 'sortFields'
    })

    const multiSortInput = inputs.find((value: Input) => {
      return value.name === 'multiSort'
    })

    if (
      collectionNameInput == null ||
      typeof collectionNameInput.value !== 'string'
    ) {
      throw new Error('Incorrect collectionName')
    }

    if (sortFieldsInput == null || typeof sortFieldsInput.value !== 'string') {
      throw new Error('Incorrect sortFields')
    }

    const collectionName = collectionNameInput.value
    const sortFields = sortFieldsInput.value.split(',')
    const multiSort =
      multiSortInput !== undefined &&
      (multiSortInput.value === true || multiSortInput.value === 'true')

    const subAction =
      options && options.find((option) => option.name === 'subAction')

    spinner.info(chalk.cyanBright('\nSort indexes created:'))

    // Add single sort indexes
    for (const sortField of sortFields) {
      const indexName =
        collectionName +
        'SortBy' +
        sortField.charAt(0).toUpperCase() +
        sortField.slice(1)

      /**
       * Ascending sort index
       */
      await new CreateIndex()
        .execute(indexName + 'Asc', collectionName, undefined, undefined, [
          sortField,
        ])
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${indexName}Asc`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Index '${indexName}Asc' could not be created`)
          )
          spinner.fail(chalk.redBright(error.message))
        })

      /**
       * Add combinations with other sort fields for ascending sort index
       */
      if (multiSort) {
        for (const secondSortField of sortFields) {
          if (secondSortField !== sortField) {
            const _ascIndexName =
              indexName +
              'AscAnd' +
              secondSortField.charAt(0).toUpperCase() +
              secondSortField.slice(1) +
              'Asc'

            /**
             * Add ascending sort index for second sortField
             */
            await new CreateIndex()
              .execute(
                _ascIndexName,
                collectionName,
                undefined,
                undefined,
                [sortField, secondSortField],
                [false, false]
              )
              .then(() => {
                spinner.info(chalk.yellowBright(`- ${_ascIndexName}`))
              })
              .catch((error: any) => {
                spinner.fail(
                  chalk.redBright(
                    `Index '${_ascIndexName}' could not be created`
                  )
                )
                spinner.fail(chalk.redBright(error.message))
              })

            /**
             * Add descending sort index for second sortField
             */
            const _descIndexName =
              indexName +
              'AscAnd' +
              secondSortField.charAt(0).toUpperCase() +
              secondSortField.slice(1) +
              'Desc'

            await new CreateIndex()
              .execute(
                _descIndexName,
                collectionName,
                undefined,
                undefined,
                [sortField, secondSortField],
                [false, true]
              )
              .then(() => {
                spinner.info(chalk.yellowBright(`- ${_descIndexName}`))
              })
              .catch((error: any) => {
                spinner.fail(
                  chalk.redBright(
                    `Index '${_descIndexName}' could not be created`
                  )
                )
                spinner.fail(chalk.redBright(error.message))
              })
          }
        }
      }

      /**
       * Descending sort index
       */
      await new CreateIndex()
        .execute(
          indexName + 'Desc',
          collectionName,
          undefined,
          undefined,
          [sortField],
          [true]
        )
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${indexName}Desc`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Index '${indexName}Desc' could not be created`)
          )
          spinner.fail(chalk.redBright(error.message))
        })

      /**
       * Add combinations with other sort fields for descending sort index
       */
      if (multiSort) {
        for (const secondSortField of sortFields) {
          if (secondSortField !== sortField) {
            const _ascIndexName =
              indexName +
              'DescAnd' +
              secondSortField.charAt(0).toUpperCase() +
              secondSortField.slice(1) +
              'Asc'

            /**
             * Add ascending sort index for second sortField
             */
            await new CreateIndex()
              .execute(
                _ascIndexName,
                collectionName,
                undefined,
                undefined,
                [sortField, secondSortField],
                [true, false]
              )
              .then(() => {
                spinner.info(chalk.yellowBright(`- ${_ascIndexName}`))
              })
              .catch((error: any) => {
                spinner.fail(
                  chalk.redBright(
                    `Index '${_ascIndexName}' could not be created`
                  )
                )
                spinner.fail(chalk.redBright(error.message))
              })

            /**
             * Add descending sort index for second sortField
             */
            const _descIndexName =
              indexName +
              'DescAnd' +
              secondSortField.charAt(0).toUpperCase() +
              secondSortField.slice(1) +
              'Desc'

            await new CreateIndex()
              .execute(
                _descIndexName,
                collectionName,
                undefined,
                undefined,
                [sortField, secondSortField],
                [true, true]
              )
              .then(() => {
                spinner.info(chalk.yellowBright(`- ${_descIndexName}`))
              })
              .catch((error: any) => {
                spinner.fail(
                  chalk.redBright(
                    `Index '${_descIndexName}' could not be created`
                  )
                )
                spinner.fail(chalk.redBright(error.message))
              })
          }
        }
      }
    }

    spinner.succeed(chalk.green('Action create:indexes:sort completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
