import { SchemaIndex } from './SchemaIndex'

export interface SchemaModel {
  name: string
  indexes?: Array<SchemaIndex>
  requiredFilter?: string
  searchFields?: Array<string>
  sortFields?: Array<string>
  multiSort?: boolean
}
