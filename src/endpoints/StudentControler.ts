import { Request, Response } from 'express'
import { StudentDataBase } from '../data/StudentDataBase'
import { StudentModel } from '../model/StudentModel'
import moment from 'moment'

export default class StudentControler {

    public async getStudent(req: Request, res: Response) {

        try {
            const { name } = req.query
            if (!name) {
                throw new Error("Query required.")
            }
            const studentDB = new StudentDataBase()
            const student = await studentDB.getStudentByName(name as string)
            res.status(200).send(student)

        } catch (error: any) {
            res.status(400).send(error.message)
        }

    }

    public async createStudent(req: Request, res: Response) {
        let errorCode = 400
        try {
            const { name, email, birthDate, hobby } = req.body

            if (!name || !email || !birthDate || !hobby) {
                errorCode = 422
                throw new Error("All fields are required.")
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
                throw new Error("The 'birthDate' field must be of type string.")
            }

            const birthDateFormat = moment(birthDate, 'DD/MM/YYYY').format('YYYY/MM/DD');

            if (birthDateFormat === "Invalid date" || birthDate.length !== 10) {
                errorCode = 422
                throw new Error("Check if the date format is correct (DD/MM/AAAA) or if its values are valid.")
            }
            if (Array.isArray(hobby) === false) {
                res.statusCode = 422
                throw new Error("The 'hobby' field must be a string array type.")
            }
            if (hobby.length === 0) {
                res.statusCode = 422
                throw new Error("The 'hobby' field must contain at least one hobby.")
            }
            const checkHobbtType = hobby.every((hobby: any) => {
                return typeof hobby === "string"
            })
            if (!checkHobbtType) {
                res.statusCode = 422
                throw new Error("The 'hobby' field must be a string array type.")
            }

            const student = new StudentModel(name, email, birthDateFormat, hobby)
            const studentDB = new StudentDataBase()

            const [code, message] = await studentDB.createStudent(student)

            res.status(code).send(message)

        } catch (error: any) {
            res.status(errorCode).send(error.message)
        }

    }

    public async updateStudentClass(req: Request, res: Response) {
        let errorCode = 400
        try {
            const { classId } = req.body
            const studentId = Number(req.params.studentId)

            if (!classId) {
                errorCode = 422
                throw new Error("The 'classId' field is required.")
            }

            if (typeof classId !== "number") {
                errorCode = 422
                throw new Error("The 'classId' field must be of type number.")
            }

            const studentDB = new StudentDataBase()
            const [code, message] = await studentDB.updateStudentClass(studentId, classId)

            res.status(code).send(message)

        } catch (error: any) {
            res.status(400).send(error.message)
        }

    }
}