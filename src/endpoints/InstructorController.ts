import { Request, Response } from "express";
import { InstructorDB } from "../data/InstructorDB";
import { InstructorModel } from "../model/Instructor";

export class InstructorController {

    // Criar instrutor.
    async postCreateInstructor(req: Request, res: Response) {

        try {
            const { name, email, birthDate, skills } = req.body

            if (!name || !email || !birthDate || !skills) {
                res.statusCode = 422
                throw new Error("All fields are mandatory.")
            }

            if (typeof name !== "string") {
                res.statusCode = 422
                throw new Error("The 'name' field must be of type string.")
            }
            if (typeof email !== "string") {
                res.statusCode = 422
                throw new Error("The 'email' field must be of type string.")
            }
            if (typeof birthDate !== "string") {
                res.statusCode = 422
                throw new Error("The 'birth date' field must be of type string.")
            }
            if (birthDate.length !== 10) {
                res.statusCode = 422
                throw new Error("Check if the date format is correct (DD/MM/AAAA) or if its values are valid.")
            }
            if (Array.isArray(skills) === false) {
                res.statusCode = 422
                throw new Error("The 'skills' field must be a string array type.")
            }
            if (Array.isArray(skills) === true) {
                const verification = skills.find((skill: any) => { typeof skill !== "string" })
                if (verification !== undefined) {
                    throw new Error("The 'skills' field must be a string array type.")
                }
            }

            if (skills.length === 0) {
                res.statusCode = 422
                throw new Error("The 'skills' field must contain at least one skill.")
            }
            if (skills.length !== 0) {
                const verification = skills.filter((element: string) => {
                    return (
                        element.toUpperCase() === "JS" ||
                        element.toUpperCase() === "CSS" ||
                        element.toUpperCase() === "REACT" ||
                        element.toUpperCase() === "TYPESCRIPT" ||
                        element.toUpperCase() === "OOP"
                    )
                })

                if (verification.length === 0) {
                    res.statusCode = 422
                    throw new Error("The 'skills' field must contain at least one of the following skills: JS, CSS, React, Typescript, OOP.")
                }
            }

            const instructor = new InstructorModel(name, email, birthDate, skills)

            const insertInstructor = new InstructorDB
            const [code, message] = await insertInstructor.insertInstructor(instructor)

            res.status(code).send(message)

        } catch (error: any) {
            res.send(error.slqMessage || error.message)
        }
    }

    // Pegar todos os instrutores.
    async getAllInstructor(req: Request, res: Response) {

        try {
            const selectInstructor = new InstructorDB()
            const result = await selectInstructor.selectAllInstructor()

            res.status(200).send(result)

        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    // Alocar instrutor de turma.
    async putChangeInstructorClass(req: Request, res: Response) {
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
