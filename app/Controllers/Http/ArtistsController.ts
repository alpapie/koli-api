import Artist from 'App/Models/Artist';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ArtistsController {
    async index() {
        let artists = await Artist.query().select('artist_nom', 'image').limit(18).orderBy('id', 'desc').groupBy('artist_nom')
        // let newartists = [artists[0]]

        // for (let index = 1; index < artists.length; index++) {
        //     for (let newartist of newartists) {
        //         if (newartist.artist_nom === artists[index].artist_nom) {
        //             console.log('NOT')
        //         } else {
        //             await newartists.push(artists[index])
        //         }
        //     }
        // }
        return artists
    }

    async search({ request }: HttpContextContract) {
        let artists = await Artist.query().where('artist_nom', 'LIKE', '%' + request.input('artist') + '%').limit(24).orderBy('id', 'desc')
        return artists

    }
}
