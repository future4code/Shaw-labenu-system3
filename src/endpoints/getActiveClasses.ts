import { Request, Response } from "express";
import { ClassDataBase } from "../data/ClassDataBase";

export const getActiveClasses = async (req: Request, res: Response): Promise<void> => {
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