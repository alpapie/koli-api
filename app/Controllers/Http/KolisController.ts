import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import Koli from 'App/Models/Koli'
import Pay from 'App/Models/Pay'
import Artist from 'App/Models/Artist'

export default class KolisController {

    public async index() {
        let kolis= await Koli.query()
        .preload('artist')
        .preload('pays').orderBy('id', 'desc').limit(12)
        return kolis
    }

    public async store({ request, response }: HttpContextContract) {
        let {titre,artist_nom,pays_name}=request.body()
        if (request.input("koli_secret_key") != "sanba_gueladiegui") {
            return response.json({ error: "vous avez acces a cette page", succes: false })
        }
        // return response.json({data:request.body()}) 
        let file =  request.file("koli",
            {
                size: '1000mb',
                extnames: ["mp3", "wav", "aac", "wma", "ogg", "flac", "alac", "aiff", "m4a", "opus"],
            }
        )
        if (!file) {
            return response.json({ error: "aucun fichier audio trouver", succes: false ,daata:request})
        }
        if (!file.isValid) {
            return response.json({ error: file.errors, succes: false })
        }

        file.clientName=new Date().getTime() +file.clientName
        await file.move(Application.publicPath('uploads/kolis'))
        let audio= "/uploads/kolis/"+file.clientName
        let image="/uploads/default.jpg"

        if(request.file("image")){
           let img = request.file("image",
            {
                size: '1000mb',
                extnames: ["png", "jpeg", "jpg"],
            })
            if (!img) {
                return response.json({ error: "vous avez acces a cette page", succes: false })
            }
            if (!img.isValid) {
                return response.json({ error: img.errors, succes: false })
            }
            img.clientName= new Date().getTime() +img.clientName
            await img.move(Application.publicPath('uploads/images'))
            image="/uploads/images/"+img.clientName
        }
        let pays = await Pay.create({pays_name})
        let artist = await Artist.create({artist_nom,image})
        let pays_id=pays.id
        let artists_id=artist.id
        let koli= await Koli.create({audio,titre,artists_id,pays_id})
        return response.json({ koli, success: true })
    }
    public async show({ request }: HttpContextContract) {
        let koli=await Koli.query().preload('artist').where('id',request.param('id')).first()
        return koli

    }
    public async search({ request }: HttpContextContract) {
        let input=request.input("artist") || 'a'
        let Kolis= await Koli.query().preload('artist',
        (query) => query.where('artist_nom','LIKE','%'+input+'%')
        ).limit(24).orderBy('id', 'desc')
        let newKolis :object[]=[]
        for (let koli of Kolis) {
            if (koli.artist!=null){
                newKolis.push(koli)
            }
        }
        return newKolis

    }
    public async searchbyartistkoli({request}:HttpContextContract) {
        let input=request.param('titre') || 'a'
        let koli=Koli.query().preload('artist').where('titre','LIKE','%'+input+'%').limit(24).orderBy('id', 'desc')
        return koli
    }

    public async getwithpagin({request}:HttpContextContract){
        const limit=12
        let page=request.param('page')
        let kolis= await Koli.query()
        .preload('artist')
        .preload('pays')
        .orderBy('id', 'desc').paginate(page,limit)
        return kolis
    }
}
