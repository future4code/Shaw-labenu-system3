import { BaseDataBase } from "./BaseDataBase";

export class ClassDataBase extends BaseDataBase {

    public async getAll() {
        try {
            const result = await BaseDataBase.connection("class").select("*")
            return result
            console.log(result)
        } catch (error) {
            throw new Error(" error!")
        }
    }
}