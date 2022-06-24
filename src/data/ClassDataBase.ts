import { ClassModel } from "../model/ClassModel";
import { BaseDataBase } from "./BaseDataBase";

export class ClassDataBase extends BaseDataBase {
    public async getAll(): Promise<ClassModel[]> {
        try {

            const result = await BaseDataBase.connection("class").select("*")

            return result

        } catch (error) {
            throw new Error("Unexpected error!")
        }
    }
    public async createClass(newClass: ClassModel): Promise<void> {
        try {

            await BaseDataBase.connection("class").insert({
                name: newClass.getName(),
                module: newClass.getModule()
            })

        } catch (error) {
            throw new Error("Unexpected error!")
        }
    }
    public async getActiveClasses(): Promise<ClassModel[]> {
        try {

            const result = await BaseDataBase.connection("class")
                .select("*")
                .where("module", ">", "0")

            return result

        } catch (error) {
            throw new Error("Unexpected error!")
        }
    }
    public async changeClassModule(module: number, id: number): Promise<void> {
        try {

            const classIds: Array<{ id: number }> = await BaseDataBase.connection("class").select("id")
            const validIds: number[] = []
            classIds.map((ids) => validIds.push(ids.id))

            if (validIds.includes(id)) {
                await BaseDataBase.connection("class")
                    .update({
                        module: module
                    }).where("id", id)
            } else {
                throw new Error("ClassId is not a valid ID");
            }

        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}