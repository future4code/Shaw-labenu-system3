import { Request, Response } from "express";
import { ClassDataBase } from "../data/ClassDataBase";
import { ClassModel } from "../model/ClassModel";

export class ClasseControler {

    // Buscar todas as turmas
    async getAllClasses(req: Request, res: Response): Promise<void> {
        let errorCode = 500
        try {
            const allClasses = new ClassDataBase()

            const classes = await allClasses.getAll()
            if (!classes.length) {
                errorCode = 404
                throw new Error("Sorry, we couldn't find any class!");
            }

            res.send(classes)
        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }
    // Trocar classe pelo id 
    async changeClassModule(req: Request, res: Response): Promise<void> {
        let errorCode = 500
        try {

            let { module } = req.body
            let id = Number(req.params.id)
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

            const changeModule = new ClassDataBase()
            await changeModule.changeClassModule(module, id)

            res.status(200).end()

        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }
    // Criar nova turma
    async createNewClass(req: Request, res: Response): Promise<void> {
        let errorCode = 500
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
            if (module > 6) {
                errorCode = 422
                throw new Error("There are only 6 modules! Select a valid one.");
            }

            const newClass = new ClassModel(name, module)
            const classDB = new ClassDataBase()

            await classDB.createClass(newClass)

            res.status(201).end()

        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }
    // Buscar turmas ativas
    async getActiveClasses(req: Request, res: Response): Promise<void> {
        let errorCode = 500
        try {

            const activeClasses = new ClassDataBase()
            const classes = await activeClasses.getActiveClasses()

            if (!classes.length) {
                errorCode = 404
                throw new Error("Sorry, we couldn't find any active class!");
            }

            res.send(classes)

        } catch (error: any) {
            res.status(errorCode).send(error.message || "Internal error!")
        }
    }
}