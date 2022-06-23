import { Request, Response } from "express";
import { ClassModel } from "../model/ClassModel";
import { ClassDataBase } from "../data/ClassDataBase";

export const createNewClass = async (req: Request, res: Response): Promise<void> => {
    let errorCode = 500
    try {

        let { name, module } = req.body
        if (!name) {
            errorCode = 404
            throw new Error("Name is required!");
        }
        if (!module) {
            module = 0
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