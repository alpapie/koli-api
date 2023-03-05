import type { HashContract } from '@ioc:Adonis/Core/Hash'
import type {
    UserProviderContract,
    ProviderUserContract
} from '@ioc:Adonis/Addons/Auth'

/**
 * Shape of the user object returned by the "MongoDbAuthProvider"
 * class. Feel free to change the properties as you want
 */
export type User = {
  id: string
  email: string
  password: string
  rememberMeToken: string | null
}

/**
 * The shape of configuration accepted by the MongoDbAuthProvider.
 * At a bare minimum, it needs a driver property
 */
export type MongoDbAuthProviderConfig = {
  driver: 'mongo'
}

/**
 * Provider user works as a bridge between your User provider and
 * the AdonisJS auth module.
 */
class ProviderUser implements ProviderUserContract<User> {
  constructor(public user: User | null, private hash: HashContract) {}

  public getId() {
    return this.user ? this.user.id : null
  }

  public getRememberMeToken() {
    return this.user ? this.user.rememberMeToken : null
  }

  public setRememberMeToken(token: string) {
    if (!this.user) {
      return
    }
    this.user.rememberMeToken = token
  }

  public async verifyPassword(plainPassword: string) {
    if (!this.user) {
      throw new Error('Cannot verify password for non-existing user')
    }

    return this.hash.verify(this.user.password, plainPassword)
  }
}

/**
 * The User provider implementation to lookup a user for different
 * operations
 */
export class MongoDbAuthProvider implements UserProviderContract<User> {
  constructor(
    public config: MongoDbAuthProviderConfig,
    private hash: HashContract
  ) {}

  public async getUserFor(user: User | null) {
    return new ProviderUser(user, this.hash)
  }

  public async updateRememberMeToken(user: ProviderUser) {
    await mongoDbClient.updateOne(
      { _id: user.getId() },
      { rememberMeToken: user.getRememberMeToken() }
    )
  }

  public async findById(id: string | number) {
    const user = await mongoDbClient.findById(id)
    return this.getUserFor(user || null)
  }

  public async findByUid(uidValue: string) {
    const user = await mongoDbClient.findOne().where('email').equals(uidValue)
    return this.getUserFor(user || null)
  }

  public async findByRememberMeToken(userId: string | number, token: string) {
    const user = await mongoDbClient
      .findOne()
      .where('_id').equals(userId)
      .where('rememberMeToken').equals(token)

    return this.getUserFor(user || null)
  }
}
