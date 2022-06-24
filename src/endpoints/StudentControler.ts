import { Request, Response } from "express";
import { StudentDataBase } from "../data/StudentDataBase";
import { StudentModel } from "../model/StudentModel";

export default class StudentControler {

    public async getStudent(req: Request, res: Response) {

        try {
            const { name } = req.query
            if (!name) {
                throw new Error ("Query required.")
            }
            const studentDB = new StudentDataBase()
            const student = await studentDB.getStudentByName(name as string)
            res.status(200).send(student)

        } catch (error: any) {
            res.status(400).send(error.message)
        }

    }

    public async createStudent(req: Request, res: Response) {
        const { name, email, birthDate, hobby } = req.body

        const student = new StudentModel(name, email, birthDate, hobby)
        const studentDB = new StudentDataBase()

        studentDB.createStudent(student)


    }

    public async updateStudentClass(req: Request, res: Response) {

        try {
            const { classId } = req.body
            const studentId = Number(req.params.studentId)

            const studentDB = new StudentDataBase()
            const message = await studentDB.updateStudentClass(studentId, classId)

            res.status(200).send(message)

        } catch (error: any) {
            res.status(400).send(error.message)
        }

    }
}