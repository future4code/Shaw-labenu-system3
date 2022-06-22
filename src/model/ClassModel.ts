export class ClassModel {
    constructor(
        protected id: number,
        protected name: string,
        protected module: number
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