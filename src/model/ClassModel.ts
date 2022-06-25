export class ClassModel {
    constructor(
        private name: string,
        private module: number,
        private id?: number
    ) { }

    public getName() {
        return this.name
    }
    public getModule() {
        return this.module
    }
    public getId() {
        return this.id
    }
}