import express from 'express';
//import { request } from 'http';
import { controller } from './controller';
import { User } from '../base/user';

const route = express.Router();

route.get('/user', controller.getAll);
route.get('/user/:id', controller.getIndexById);
route.post('/add', controller.createUser);
route.put('/updateUser/:id', controller.updateUser);
route.delete('/deleteUser/:id', controller.deleteUser);
export default route;