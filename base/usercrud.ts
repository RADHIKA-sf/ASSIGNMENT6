import {CRUD} from "./crudinterface.js"; 
import { User,roletype} from "./user.js";
import { findIndex} from "./function.js";

export class UserCRUD implements CRUD <User> 
{
    users: User[];
    col: string[];
    tableContainer: HTMLDivElement;
    tableElement : HTMLTableElement;
    URL : string;
    AddBtn : HTMLButtonElement;
    addContainer : HTMLDivElement;

    constructor()
    {
       this.users = [];
       this.col = [];
       this.tableContainer = document.querySelector('.table')!;
       this.URL = `http://localhost:3000`;
       this.tableElement = document.createElement("table");
       this.AddBtn = document.createElement("button");
       this.AddBtn.classList.add("create-btn");
       this.AddBtn.addEventListener('click',() => this.addUser());
       this.addContainer = document.querySelector('.AddContainer');
       this.initialize();
    }

     async initialize()
    {       
        const response = await fetch(this.URL + '/users');
        const data = await response.json();
        for (let key in data[0]) {
            if(this.col.indexOf(key) < 0 && (key !== "id"))
            {
                this.col.push(key); 
            }
        }

        data.forEach((object:any) => 
            {
                this.users.push(new User(object.id,object.FirstName, object.MiddleName, object.LastName, object.Email, object.Phone, object.Role, object.Address));
            }
        )
    }

    load()
    {
        this.tableElement =  document.createElement("table");
        let tr = this.tableElement.insertRow(-1);

        for(let i=0; i< this.col.length;i++)
        {   
            let th = tr.insertCell(i);

            th.innerHTML = this.col[i];

        }
        this.AddBtn.innerHTML = "Add User";
        this.addContainer.append(this.AddBtn);
        this.users.forEach((user) => this.loadTableContent(user))

    }
    loadTableContent(user: User)
    {
       let tr = document.createElement("tr");
       let editBtn = document.createElement("button");
       editBtn.innerHTML = "Edit";
       editBtn.addEventListener('click',() => this.update(user));
       editBtn.setAttribute('class','edit');
       let deleteBtn = document.createElement("button");
       deleteBtn = document.createElement("button");
       deleteBtn.innerHTML = "Delete";
       deleteBtn.addEventListener('click',()=>this.delete(user));
       deleteBtn.classList.add("dlt");

        tr.innerHTML = `<td id = "fname">${user.FirstName}</td>
                        <td id = "mname">${user.MiddleName}</td>
                        <td id = "lmane">${user.LastName}</td>
                        <td id = "email">${user.Email}</td>
                        <td id = "phone">${user.Phone}</td>
                        <td id = "Role">${user.Role}</td>
                        <td id = "address">${user.Address}</td>
                        `;
        tr.append(editBtn);
        tr.append(deleteBtn);
        this.tableElement.append(tr);
        this.tableContainer.innerHTML = "";
        this.tableContainer.append(this.tableElement);

    }

    addUser()
    {
        let tr = this.tableElement.insertRow(-1);
        let user: User;
        for(let cols in this.col)
        {
           let td = tr.insertCell(-1);
            td.contentEditable = "true";
            td.setAttribute('id',`${this.col[cols]}`);

            if(this.col[cols] == "Role")
            {
                let select = document.createElement("select") as HTMLSelectElement;   
                select.classList.add("select");
                select.setAttribute('id','select');
                for (const i in roletype) {
                   const option = document.createElement("option");
                   option.value = i;
                   option.textContent = i;

                    if (td.textContent === i) 
                    {
                        option.selected = true;
                    }
                    else option.selected = false;
                    select.appendChild(option);
                 }    
                td.replaceWith(select);                
            }
        }

        let submit = document.createElement("button");
        submit.classList.add('submit');
        submit.innerHTML = "Submit";
        tr.append(submit);

        submit.addEventListener("click",()=> {

            for(let i =0;i<this.col.length;i++)
            {
                let cell = tr.children[i] as HTMLTableCellElement;
                cell.contentEditable = "false";
            }   
            let selectedrole;
            for(let i = 0; i<= 2;i++)
            {
                let s = tr.children[5].children[i] as HTMLOptionElement;
                if(s.selected)
                    {
                         selectedrole = s.textContent!;
                    }
            } 

            user = {
                "id": 0,
                "FirstName": tr.cells.namedItem('FirstName').textContent,
                "MiddleName": tr.cells.namedItem('MiddleName').textContent,
                "LastName": tr.cells.namedItem('LastName').textContent,
                "Email": tr.cells.namedItem('Email').textContent,
                "Phone": tr.cells.namedItem('Phone').textContent,
                "Role": selectedrole,
                "Address": tr.cells.namedItem('Address').textContent
            } 

            this.create(user);
        });

    }

    async  create(user:User)
    {
        const addURL = this.URL + '/add';
        const response = await fetch(addURL, 
            {
             method: 'POST',
             body: JSON.stringify(user),
             headers: { 'Content-Type': 'application/json'}
            }); 
            const response1 = await fetch(this.URL + '/users');
            const data1 = await response1.json();
            const newUser = data1[data1.length-1];

            this.users.push(newUser);
            this.load();

    }

     read(): User[] {
        return this.users;
    }

    async update(user:User)
    {
        let index = findIndex(user.id,this.users);
        let tr = this.tableElement.children[index+1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length-2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length-1] as HTMLButtonElement;
        let cell = tr.cells.namedItem("Role");

        if(editbtn.innerHTML === "Edit")
        {
            tr.contentEditable = "true";
            editbtn.innerHTML = "Save";
            dltbtn.innerHTML = "Cancel";
            editbtn.contentEditable = "false";
            dltbtn.contentEditable = "false";
            let select = document.createElement("select") as HTMLSelectElement;   
            select.classList.add("select");
            select.setAttribute('id','select');
            for (const i in roletype) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;

                if (cell.textContent === i) 
                {
                    option.selected = true;
                }
                else option.selected = false;
                select.appendChild(option);
            }    
            cell.replaceWith(select);
        }
        else{
           this.save(user);
        }
    }

    async save(user:User)
    {
        let index = findIndex(user.id,this.users);
        let tr = this.tableElement.children[index+1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length-2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length-1] as HTMLButtonElement; 
        let fnameCell = tr.cells.namedItem("fname");
        let mnameCell = tr.cells.namedItem("mname");
        let lnameCell = tr.cells.namedItem("lname");
        let emailCell = tr.cells.namedItem("email");
        let phoneCell = tr.cells.namedItem("phone");
        let addressCell = tr.cells.namedItem("address");
        let selectCell = tr.cells.namedItem("select");

        tr.contentEditable = "false";
        editbtn.innerHTML = "Edit";
        dltbtn.innerHTML = "Delete";
        const updateURL = this.URL + '/update/' + `${user.id}`;

        user.FirstName = fnameCell.textContent !;
        user.MiddleName = mnameCell.textContent !;
        user.LastName = lnameCell.textContent !;
        user.Email = emailCell.textContent !;
        user.Phone = phoneCell.textContent !;         
        user.Address = addressCell.textContent !;
        for(let i = 0; i<= 2;i++)
        {
           let s = tr.children[5].children[i] as HTMLOptionElement;

            if(s.selected)
                {
                    user.Role = s.textContent!;
                }
        } 
        let td = document.createElement("td");
        td.setAttribute('id','role-cell');
        tr.children[5].replaceWith(td);
        let roleCell = tr.cells.namedItem('role-cell');
        roleCell.innerHTML = user.Role;

        const mybody = {
                "id": user.id,
                "fname": user.FirstName,
                "mname": user.MiddleName,
                "lname": user.LastName,
                "email": user.Email,
                "phone": user.Phone,
                "Role": user.Role,
                "address": user.Address
        };


        const response = await fetch(updateURL, {
            method: 'PUT',
            body: JSON.stringify(mybody), // string or object
            headers: {
                  'Content-Type': 'application/json'
                }
            });
    }

   async delete(user: User){

      const index = findIndex(user.id,this.users);
      let tr = this.tableElement.children[index+1] as HTMLTableRowElement;
      let dltbtn = tr.children[tr.children.length-1] as HTMLButtonElement;
      if(dltbtn.innerHTML === "Delete")
        {
              const deleteURL = this.URL + '/delete/'+ `${user.id}`;
              const response = await fetch(deleteURL, 
                {
                 method: 'DELETE',
                headers: { 'Content-Type': 'application/json'}
                }); 

              tr.remove();
              this.users.splice(index,1);
              this.load(); 
        }
        else
        {
            this.cancel(user);
        }  

    }

    cancel(user:User)
    {
        let index = findIndex(user.id,this.users);
        let tr = this.tableElement.children[index+1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length-2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length-1] as HTMLButtonElement;

        tr.contentEditable = "false";
        dltbtn.innerHTML = "Delete";
        editbtn.innerHTML = "Edit";
        this.load();
    }

    refresh()
    {
        this.users = [];
        this.initialize();
        this.load(); 
    }

}