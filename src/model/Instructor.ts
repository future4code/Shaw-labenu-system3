import { Users } from "./UsersModel"

export class InstructorModel extends Users {
    constructor(
        name: string,
        email: string,
        birthDate: string,
        protected skills: string[]
    ) { super(name, email, birthDate) }

    public getSkills() {
        return this.skills
    }
}