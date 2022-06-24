import { Request, Response } from "express";
import { InstructorDB } from "../data/InstructorDB";
import { Instructor } from "../model/Instructor";

export class InstructorController{

    // Criar instrutor.
    async postCreateInstructor(req: Request, res: Response){

        try {
            const { name, email, birth_date } = req.body

            if(!name || !email || !birth_date){
                res.statusCode = 422
                throw new Error("All fields are mandatory.")
            }

            const instructor = new Instructor(name, email, birth_date)

            const insertInstructor = new InstructorDB
            insertInstructor.insertInstructor(instructor)

            res.status(201).send("Instructor created successfully.")

        } catch (error:any) {
            res.status(500).send({ message: error.message })
        }
    }

    // Pegar todos os instrutores.
    async getAllInstructor(req: Request, res: Response){

        try {
            const selectInstructor = new InstructorDB
            const result = await selectInstructor.selectAllInstructor()

            res.status(200).send(result)

        } catch (error:any) {
            res.status(500).send({ message: error.message })
        }    
    }

    // Alocar instrutor de turma.
    async putChangeInstructorClass(req: Request, res: Response){
        try {
            const { classId } = req.body
            const id = Number(req.params.id)

            const updateInstructor = new InstructorDB
            await updateInstructor.changeInstructorClass(id, classId)

            res.status(200).send("Instructor successfully allocated.")

        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }
}
