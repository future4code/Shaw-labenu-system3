export class Users {
    constructor(
        protected name: string,
        protected email: string,
        protected birthDate: string,
        protected classId: number
    ) { }

    public getUsersInfo() {
        return {
            name: this.name,
            email: this.email,
            birthDate: this.birthDate,
            classId: this.classId
        }
    }
}

