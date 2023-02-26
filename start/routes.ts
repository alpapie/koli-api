/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async () => {
//   return { hello: 'world' }
// })
Route.resource('koli','kolisController').except(['edit','update','create'])
Route.resource('artists','ArtistsController').except(['edit','update','create'])
Route.post('koli/search','kolisController.search')
Route.post('koli/pays/search','PaysController.search')
Route.get('koli/titre/:titre','kolisController.searchbyartistkoli')
Route.get('koli/pagination/page/:page','kolisController.getwithpagin')

//for admins
Route.resource('admin','UsersController')
Route.post('login','UsersController.login')
// Route.get('logout','UsersController.logout')
Route.get('auth','UsersController.auth')

