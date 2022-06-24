import { Users } from "./UsersModel";

export class StudentModel extends Users{
    constructor(
        protected name: string,
        protected email: string,
        protected birthDate: string,
        // protected classId: number,
        private hobby: string[]
        
    ) {
        super(name, email, birthDate)
     }

    public getHobby() {
        return this.hobby
    }
}