export class Instructor{
    constructor(
        private name: string, 
        private email: string, 
        private birthDate: string,
        private skills: string[]
    ){ }

    public getName(){
        return this.name
    }

    public getEmail(){
        return this.email
    }

    public getBirth_Date(){
        return this.birthDate
    }

    public getSkills(){
        return this.skills
    }
}