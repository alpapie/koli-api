import { DateTime } from 'luxon'
import { BaseModel, column ,  hasMany,  HasMany } from '@ioc:Adonis/Lucid/Orm'
import Koli from './Koli'

export default class Artist extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public image: string

  @column()
  public artist_nom: string

  @hasMany(() => Koli,
  { foreignKey:'artists_id'}) // 👈 One-to-many relationship
  public kolis: HasMany<typeof Koli>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
}
