export class Users {

    protected classId: number

    constructor(
        protected name: string,
        protected email: string,
        protected birthDate: string        
    ) { 
        this.classId = 0
    }

    public getName(){
        return this.name
    }
    public getEmail(){
        return this.email
    }
    public getBirthDate(){
        return this.birthDate
    }
    public getClassId(){
        return this.classId
    }
}

