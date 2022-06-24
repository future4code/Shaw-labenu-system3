export class Instructor{
    constructor(
        private name: string, 
        private email: string, 
        private birth_date: string
    ){ }

    public getName(){
        return this.name
    }

    public getEmail(){
        return this.email
    }

    public getBirth_Date(){
        return this.birth_date
    }
}