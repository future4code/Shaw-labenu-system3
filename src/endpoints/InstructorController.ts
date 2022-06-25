import { Request, Response } from "express";
import { InstructorDB } from "../data/InstructorDB";
import { InstructorModel } from "../model/Instructor";
import moment from "moment";

export class InstructorController {

    // Criar instrutor.
    async postCreateInstructor(req: Request, res: Response) {
        let errorCode = 500
        try {
            const { name, email, birthDate, skills } = req.body

            const birthDateFormat = moment(birthDate, 'DD/MM/YYYY').format('YYYY/MM/DD');

            if (!name || !email || !birthDate || !skills) {
                errorCode = 422
                throw new Error("All fields are mandatory.")
            }
            if (typeof name !== "string") {
                errorCode = 422
                throw new Error("The 'name' field must be of type string.")
            }
            if (typeof email !== "string") {
                errorCode = 422
                throw new Error("The 'email' field must be of type string.")
            }
            if (typeof birthDate !== "string") {
                errorCode = 422
                throw new Error("The 'birth date' field must be of type string.")
            }
            if (birthDate.length !== 10) {
                errorCode = 422
                throw new Error("Check if the date format is correct (DD/MM/AAAA) or if its values are valid.")
            }
            if (Array.isArray(skills) === false) {
                errorCode = 422
                throw new Error("The 'skills' field must be a string array type.")
            }
            if (Array.isArray(skills) === true) {
                const verification: string[] = skills.find((skill: any) => { typeof skill !== "string" })
                if (verification !== undefined) {
                    throw new Error("The 'skills' field must be a string array type.")
                }
            }

            if (skills.length === 0) {
                errorCode = 422
                throw new Error("The 'skills' field must contain at least one skill.")
            }
            if (skills.length !== 0) {
                const verification: string[] = skills.filter((element: string) => {
                    return (
                        element.toUpperCase() === "JS" ||
                        element.toUpperCase() === "CSS" ||
                        element.toUpperCase() === "REACT" ||
                        element.toUpperCase() === "TYPESCRIPT" ||
                        element.toUpperCase() === "OOP"
                    )
                })

                if (verification.length === 0) {
                    errorCode = 422
                    throw new Error("The 'skills' field must contain at least one of the following skills: JS, CSS, React, Typescript, OOP.")
                }
            }

            const instructor: InstructorModel = new InstructorModel(name, email, birthDateFormat, skills)

            const insertInstructor = new InstructorDB
            const [code, message] = await insertInstructor.insertInstructor(instructor)

            res.status(code).send(message)

        } catch (error: any) {
            res.status(errorCode).send(error.slqMessage || error.message)
        }
    }

    // Pegar todos os instrutores.
    async getAllInstructor(req: Request, res: Response) {
        let errorCode: number = 500
        try {

            const selectInstructor = new InstructorDB()
            const result: InstructorModel[] = await selectInstructor.selectAllInstructor()

            if (!result) {
                errorCode = 404
                throw new Error("Sorry, we couldn't find any instructor.");
            }

            res.status(200).send(result)

        } catch (error: any) {
            res.status(errorCode).send({ message: error.message || "Internal error." })
        }
    }

    // Alocar instrutor de turma.
    async putChangeInstructorClass(req: Request, res: Response) {
        let errorCode: number = 500
        try {
            const { classId } = req.body
            if (!classId) {
                errorCode = 422
                throw new Error("Please insert a classId.");
            }

            const id: number = Number(req.params.id)

            const updateInstructor = new InstructorDB
            const [code, message] = await updateInstructor.changeInstructorClass(id, classId)

            res.status(code).send(message)
        } catch (error: any) {
            res.status(errorCode).send(error.message)
        }
    }
}
