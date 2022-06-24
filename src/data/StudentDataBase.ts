import { StudentModel } from "../model/StudentModel";
import { BaseDataBase } from "./BaseDataBase";

export class StudentDataBase extends BaseDataBase {

    async getStudentByName(name: string) {
        try {

            const result = await BaseDataBase.connection("student")
                .where("name", "like", `%${name}%`)

            if (!result.length) {
                throw new Error("Student not found.")
            }

            return result

        } catch (error: any) {
            return error.message
        }
    }

    async createStudent(student: StudentModel) {
        let errorCode: number = 400

        try {

            const studentsDB = await BaseDataBase.connection("student")
                .select("email")
                .where({ email: student.getEmail() })

            if (studentsDB.length > 0) {
                errorCode = 409
                throw new Error("There is already a Student registered with this email address.")
            }

            const hobbies = await BaseDataBase.connection("hobby")

            let studentHobbyId: number[] = []
            let studentHobbyName: string[] = student.getHobby()
            let newStudentHobbies: string[] = []

            studentHobbyName.forEach((studentHobby) => {

                let checkHobbies = hobbies.find((hobby: {
                    name: string,
                    id: number
                }) => hobby.name.toLowerCase() === studentHobby.toLowerCase())


                if (checkHobbies !== undefined) {
                    studentHobbyId.push(checkHobbies.id)
                } else {
                    newStudentHobbies.push(studentHobby)
                }
            })

            for (const studentHobby of newStudentHobbies) {
                await BaseDataBase.connection("hobby")
                    .insert({
                        name: studentHobby
                    })
            }

            const updateHobbies = await BaseDataBase.connection("hobby")

            newStudentHobbies.forEach((hobby) => {
                const newHobby = updateHobbies.find((hobbyDB) => hobby.toLowerCase() === hobbyDB.name.toLowerCase())
                newHobby !== undefined && studentHobbyId.push(newHobby.id)
            })

            await BaseDataBase.connection("student")
                .insert({
                    name: student.getName(),
                    email: student.getEmail(),
                    birth_date: student.getBirthDate()
                })

            const newStudentsDB = await BaseDataBase.connection("student")
                .select("id")
                .where({ email: student.getEmail() })

            for (const hobbyId of studentHobbyId) {
                await BaseDataBase.connection("student_hobby")
                    .insert({
                        student_id: newStudentsDB[0].id,
                        hobby_id: hobbyId,
                    })
            }

            return [201, "Student succefully registered."]
        } catch (error: any) {
            return [errorCode, error.message]
        }
    }

    async updateStudentClass(studentId: number, newClassId: number) {
        try {
            await BaseDataBase.connection("student")
                .update({ class_id: newClassId })
                .where({ id: studentId })

            return [200, "Student's Class succefully updated."]
        } catch (error: any) {
            return [400, error.sqlMessage]
        }
    }
}