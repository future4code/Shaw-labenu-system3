import { Request, Response } from "express";
import { ClassDataBase } from "../data/ClassDataBase";
import { ClassModel } from "../model/ClassModel";

export class ClasseControler {

    // Buscar todas as turmas
    async getAllClasses(req: Request, res: Response): Promise<void> {
        let errorCode: number = 500
        try {
            const allClasses: ClassDataBase = new ClassDataBase()

            const classes: ClassModel[] = await allClasses.getAll()
            if (!classes.length) {
                errorCode = 404
                throw new Error("Sorry, we couldn't find any class!");
            }

            res.status(200).send(classes)
        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }

    // Trocar classe pelo id 
    async changeClassModule(req: Request, res: Response): Promise<void> {
        let errorCode: number = 500
        try {

            let { module } = req.body
            let id: number = Number(req.params.id)

            if (typeof module != "number") {
                errorCode = 422
                throw new Error("Typeof 'module' value has to be number!");
            }
            if (module > 6 || module < 0) {
                errorCode = 422
                throw new Error("Module value has to be between 0 and 6!");
            }
            if ((!id && id != 0) || (!module && module != 0)) {
                errorCode = 404
                throw new Error("Please check your id and module fields! Both of them are required.");
            }

            const changeModule: ClassDataBase = new ClassDataBase()
            const [code, message] = await changeModule.changeClassModule(module, id)

            res.status(code).send(message)

        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }

    // Criar nova turma
    async createNewClass(req: Request, res: Response): Promise<void> {
        let errorCode: number = 500
        try {

            let { name, module } = req.body

            if (!module) {
                module = 0
            }
            if (typeof name !== "string" || typeof module !== "number") {
                errorCode = 422
                throw new Error("Typeof 'module' value has to be number and typeof 'name' value has to be string.");
            }
            if (!name) {
                errorCode = 404
                throw new Error("Name is required!");
            }
            if (module > 6 || module <= -1) {
                errorCode = 422
                throw new Error("There are only 6 modules(0-6)! Select a valid one.");
            }

            const newClass: ClassModel = new ClassModel(name, module)
            const classDB: ClassDataBase = new ClassDataBase()

            const [code, message] = await classDB.createClass(newClass)

            res.status(code).send(message)

        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }

    // Buscar turmas ativas
    async getActiveClasses(req: Request, res: Response): Promise<void> {
        let errorCode: number = 500
        try {

            const activeClasses: ClassDataBase = new ClassDataBase()
            const classes: ClassModel[] = await activeClasses.getActiveClasses()

            if (!classes.length) {
                errorCode = 404
                throw new Error("Sorry, we couldn't find any active class!");
            }

            res.status(200).send(classes)
        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }
}