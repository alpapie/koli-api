import Koli from 'App/Models/Koli';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PaysController {
    public async search({ request }: HttpContextContract){
        let kolis= await Koli.query().preload('pays',
        (query) => query.where('pays_name','LIKE','%'+request.input('pays')+'%')
        ).preload('artist').limit(24)
        let newKolis :object[]=[]
        for (let koli of kolis) {
            if (koli.pays!=null){
                newKolis.push(koli)
            }
        }
        return newKolis
    }
}
