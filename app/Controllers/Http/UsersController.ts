import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'

import Artist from 'App/Models/Artist';
import Koli from 'App/Models/Koli';
import Pay from 'App/Models/Pay';
import User from 'App/Models/User';

export default class UsersController {
    public async login({auth,request,response}:HttpContextContract){
        const { email, password } = request.only(['email', 'password'])
        if(email && password){
            try {
                const token = await auth.use('api').attempt(email, password, {
                    expiresIn: '5 days'
                    })
                return response.json({
                    user: auth.user,
                    token,
                    status: true,
                    })
            } catch (error) {
                return {status:false,message:"Email ou mot de passe incorrect",} 
            }
        }
        return {status:false,message:"Email ou mot de passe incorrect",}
    }
    public async store({request}:HttpContextContract){
        const userData = request.only(['name', 'email', 'password'])
        const user = await User.create(userData)
        await user.save()
        return user
    }
    async auth({ response, auth}:HttpContextContract){
        try {
            await auth.use('api').authenticate()
            return response.json({status:true})
        } catch (error) {
             return response.json({status:false})
        }
       
    }
    async logout({auth}:HttpContextContract){
        await auth.use('api').revoke()
        auth.logout()
        return {
            revoked: true
          }
    }

    async destroy({request}:HttpContextContract){
        let koli= await Koli.find(request.param('id'))
        if (koli){

            let artist= await Artist.find(koli?.artists_id)
            let pays= await Pay.find(koli?.pays_id)
            let imgpath=artist?.image || ""
            let audiopath=koli?.audio || ""
            imgpath=imgpath.split('/').splice(2).join('/')
            audiopath=audiopath.split('/').splice(2).join('/')
            if (await Drive.exists(imgpath) && await Drive.exists(audiopath)){
                
                await koli?.delete()
                await pays?.delete()
                await artist?.delete()

                await Drive.delete(audiopath)
                await Drive.delete(imgpath)

                return {success:true}
            }
            return {success:false}
        }
        return {success:false}

    } 
}
