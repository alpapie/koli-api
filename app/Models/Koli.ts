import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Artist from './Artist'
import Pay from './Pay'

export default class Koli extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public titre: string

  @column()
  public pays_id: number

  @column()
  public artists_id: number
  
  @column()
  public audio: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @hasOne(() => Artist)
  // public artist_id: HasOne<typeof Artist>
  
  @belongsTo(() => Pay,{
    foreignKey:'pays_id'
  }) // 👈 a Post belongs to a Pay
  public pays: BelongsTo<typeof Pay>
  
  @belongsTo(() => Artist,
  {
    foreignKey:'artists_id'
  }) // 👈 a Post belongs to a Artist
  public artist: BelongsTo<typeof Artist>

  // @hasOne(() => Pay)
  // public pays_id: HasOne<typeof Pay>
}
