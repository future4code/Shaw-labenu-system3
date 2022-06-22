import { Request, Response } from "express";
import { ClassDataBase } from "../data/ClassDataBase";

export const getAllClasses = async (req: Request, res: Response): Promise<void> => {
    try {
        const Class = new ClassDataBase()
        const classes = await Class.getAll()

        res.send(classes)
    } catch (error: any) {
        res.status(500).end()
    }
}