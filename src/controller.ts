import {Request,Response}from 'express';
import fs from 'fs/promises';
import {User} from '../base/user';
//import { request } from 'http';
export class Controller {
  
    public async getAll(req:Request, res:Response) {
        const users = await fs.readFile('./src/data.json',{encoding:'utf-8'});
        res.status(200).send(JSON.parse(users)); 
    }
  
     public async getIndexById(req:Request,res: Response) {
        const users = await fs.readFile('./src/data.json', 'utf-8');
        const data = JSON.parse(users)as User[];
        const id = Number(req.params.id);
        const index = data.findIndex((user)=> user.id === Number(id));
        if(!index){
            res.status(500).send('Index Not Found');
        }
        else{
            res.status(200).send(JSON.stringify(index));
        }
    }

     async createUser(req:Request, res:Response) {
         const users = await fs.readFile('./src/data.json', 'utf-8');
         const data = JSON.parse(users)as User[];
         const newUser = req.body as User;
         newUser.id = data[data.length-1].id +1;
       const id = Number(req.params.id);
       /*  
    await fs.writeFile('./src/data/users.json', JSON.stringify(newUser));
         res.status(201).send("User created successfully!");     */
         data.findIndex((user)=> user.id === id);

         data.push(newUser);
         res.status(201).send(JSON.stringify(newUser));
     }
 
      async updateUser(req: Request, res: Response) {
        const users = await fs.readFile('./src/data.json', 'utf-8');
        const data = JSON.parse(users) as User[];
        const id = Number(req.params.id);
        const index = data.findIndex((user)=> user.id === Number(id));
        const input = req.body as User;
        input.id = Number(req.params.id);
    
       if(index>=0){
            data[index].FirstName = input.FirstName || data[index].FirstName;
            data[index].MiddleName = input.MiddleName || data[index].MiddleName;
            data[index].LastName = input.LastName || data[index].LastName;
            data[index].Email = input.Email || data[index].Email;
            data[index].Phone = input.Phone || data[index].Phone;
            data[index].Address = input.Address || data[index].Address;
            data[index].Role = input.Role || data[index].Role; 
            fs.writeFile('./src/data.json',JSON.stringify(data));
            res.status(200).send("Updated Successfully");
        }
        else{
            res.status(400).send('id does not exist');     
        }
      }
      async deleteUser(req: Request, res: Response) {
        const users = await fs.readFile('./src/data.json','utf-8');
        const data = JSON.parse(users) as User[];
        const id = Number(req.params.id);
        const index = data.findIndex((user)=> user.id === id);
        users.slice(index,1);
        res.status(200).send(JSON.stringify(data));
    }

    findIndex(id:Number,data:User[]){
    return data.findIndex((user) => user.id === id);
    }
}
 export const controller = new Controller;