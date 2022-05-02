import {User} from '../base/user';

export function findIndex(id:Number,data:User[]){
    return data.findIndex((user) => user.id === id);
    }