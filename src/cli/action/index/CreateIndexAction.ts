import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateIndex } from '../../../fauna/application/command/index/CreateIndex'

export class CreateIndexAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create index')

    console.log(inputs)

    const nameInput = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    const collectionNameInput = inputs.find((value: Input) => {
      return value.name === 'collectionName'
    })

    const uniqueInput = inputs.find((value: Input) => {
      return value.name === 'unique'
    })

    const termsInput = inputs.find((value: Input) => {
      return value.name === 'terms'
    })

    const valuesInput = inputs.find((value: Input) => {
      return value.name === 'values'
    })

    if (nameInput == null || typeof nameInput.value !== 'string') {
      throw new Error('Incorrect name')
    }

    if (
      collectionNameInput == null ||
      typeof collectionNameInput.value !== 'string'
    ) {
      throw new Error('Incorrect collectionName')
    }

    const indexName = nameInput.value
    const collectionName = collectionNameInput.value
    const unique =
      uniqueInput !== undefined && typeof uniqueInput.value === 'boolean'
        ? uniqueInput.value
        : undefined
    const terms =
      termsInput !== undefined && typeof termsInput.value === 'string'
        ? termsInput.value.split(',')
        : undefined
    const values =
      valuesInput !== undefined && typeof valuesInput.value === 'string'
        ? valuesInput.value.split(',')
        : undefined

    const subAction =
      options && options.find((option) => option.name === 'subAction')

    spinner.info(chalk.cyanBright('\nIndexes created:'))

    await new CreateIndex()
      .execute(indexName, collectionName, unique, terms, values)
      .then(() => {
        spinner.info(chalk.yellowBright(`- ${collectionName}`))
      })
      .catch((error: any) => {
        spinner.fail(
          chalk.redBright(`Index '${indexName}' could not be created`)
        )
        spinner.fail(chalk.redBright(error.message))
      })

    spinner.succeed(chalk.green('Action create:index completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
