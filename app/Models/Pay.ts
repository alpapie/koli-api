import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Koli from './Koli'

export default class Pay extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pays_name: string


  @hasMany(() => Koli,
  { foreignKey:'pays_id'}) // 👈 One-to-many relationship
  public kolis: HasMany<typeof Koli>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
