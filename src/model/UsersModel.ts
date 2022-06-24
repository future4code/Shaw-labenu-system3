export class Users {
    constructor(
        protected name: string,
        protected email: string,
        protected birthDate: string,
        // protected classId: number
    ) { }

    public getName(){
        return this.name
    }
    public getEmail(){
        return this.email
    }
    public getBirthDate(){
        return this.birthDate
    }
    // public getClassId(){
    //     return this.classId
    // }
}

