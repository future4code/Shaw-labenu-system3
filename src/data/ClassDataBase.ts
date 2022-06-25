import { ClassModel } from "../model/ClassModel";
import { BaseDataBase } from "./BaseDataBase";

export class ClassDataBase extends BaseDataBase {

    // Pega todas as turmas
    public async getAll(): Promise<ClassModel[]> {
        try {

            const result: ClassModel[] = await BaseDataBase.connection("class").select("*")

            if (!result.length) {
                throw new Error("Class not found.")
            }

            return result
        } catch (error: any) {
            return error.message
        }
    }

    // Criar turma 
    public async createClass(newClass: ClassModel): Promise<any> {
        let errorCode: number = 400
        try {

            const classDB: ClassModel[] = await BaseDataBase.connection("class")
                .select("name")
                .where({ name: newClass.getName() })

            if (classDB.length > 0) {
                errorCode = 409
                throw new Error("There is already a Class registered with this name.")
            }

            await BaseDataBase.connection("class").insert({
                name: newClass.getName(),
                module: newClass.getModule()
            })

            return [201, "Class succefully registered."]
        } catch (error: any) {
            return [errorCode, error.message]
        }
    }

    // Busca turmas ativas
    public async getActiveClasses(): Promise<ClassModel[]> {
        try {

            const result: ClassModel[] = await BaseDataBase.connection("class")
                .select("*")
                .where("module", ">", "0")

            if (!result.length) {
                throw new Error("There are no active classes.")
            }

            return result
        } catch (error: any) {
            return error.message
        }
    }

    // Atualiza modulo da turma
    public async changeClassModule(module: number, id: number): Promise<any> {
        let errorCode: number = 500
        try {

            const classIds: Array<{ id: number }> = await BaseDataBase.connection("class").select("id")
            const validIds: number[] = []
            classIds.map((ids) => validIds.push(ids.id))

            if (validIds.includes(id)) {
                await BaseDataBase.connection("class")
                    .update({
                        module: module
                    }).where({ id: id })
            } else {
                errorCode = 404
                throw new Error("ClassId not found.");
            }

            return [200, "Class's module succefully updated."]
        } catch (error: any) {
            return [errorCode, error.message]
        }
    }
}