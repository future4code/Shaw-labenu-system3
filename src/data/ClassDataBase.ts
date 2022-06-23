import { ClassModel } from "../model/ClassModel";
import { BaseDataBase } from "./BaseDataBase";

export class ClassDataBase extends BaseDataBase {

    public async getAll(): Promise<ClassModel[]> {
        try {

            const result = await BaseDataBase.connection("class").select("*")

            return result

        } catch (error) {
            throw new Error("Unnexpected error!")
        }
    }

    public async createClass(newClass: ClassModel): Promise<void> {
        try {

            await BaseDataBase.connection("class").insert({
                name: newClass.getName(),
                module: newClass.getModule()
            })

        } catch (error) {
            throw new Error("Unnexpected error!")
        }
    }

    public async getActiveClasses(): Promise<ClassModel[]> {
        try {

            const result = await BaseDataBase.connection("class")
                .select("*")
                .where("module", ">", "0")

            return result

        } catch (error) {
            throw new Error("Unnexpected error!")
        }
    }

    public async changeClassModule(module: number, id: number): Promise<void> {
        try {

            await BaseDataBase.connection("class")
                .update({
                    module: module
                }).where("id", id)

        } catch (error) {
            throw new Error("Unnexpected error!")
        }
    }
}