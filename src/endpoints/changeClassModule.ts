import { Request, Response } from "express";
import { ClassDataBase } from "../data/ClassDataBase";

export const changeClassModule = async (req: Request, res: Response): Promise<void> => {
    let errorCode = 500
    try {

        let { module } = req.body
        if (module > 6 || module < 0) {
            errorCode = 422
            throw new Error("Module value has to be between 0 and 6!");
        }

        const id = Number(req.params.id)
        if (!id || !module) {
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