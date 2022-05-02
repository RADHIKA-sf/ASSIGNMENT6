enum roletype {
    SADMIN = 'SuperAdmin',
    ADMIN = 'Admin',
    SUBSCRIBER = 'Subscriber'
}

 class User{
  
    constructor(public id: number, public FirstName: string, public MiddleName: string, public LastName: string,
        public Email: string, public Phone: string, public Role: string, public Address: string) {
    
    }
    
}

export {User,roletype};