import { StudentModel } from "../model/StudentModel";
import { BaseDataBase } from "./BaseDataBase";
import { Student, Hobby } from "../types"
import { ClassModel } from "../model/ClassModel";


export class StudentDataBase extends BaseDataBase {

    // Pega estudantes por  nome
    async getStudentByName(name: string) {

        try {

            const result: Student[] = await BaseDataBase.connection("student")
                .select("id", "name", "email", "birth_date as birthDate", "class_id as classId")
                .where("name", "like", `%${name}%`)

            if (!result.length) {
                throw new Error("Student not found.")
            }

            let response: Array<Student> = []

            for (const student of result) {

                const hobbies: Hobby[] = await BaseDataBase.connection("student")
                    .join('student_hobby', 'student_hobby.student_id', 'student.id')
                    .join('hobby', 'student_hobby.hobby_id', 'hobby.id')
                    .select('hobby.name')
                    .where({ student_id: student.id })

                const hobbiesStudent: string[] = hobbies.map((hobby: Hobby) => {
                    return hobby.name
                })

                response.push({
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    birthDate: student.birthDate,
                    classId: student.classId,
                    hobby: hobbiesStudent
                })
            }
            return response


        } catch (error: any) {
            return error.message
        }
    }

    // Cria estudante 
    async createStudent(student: StudentModel) {
        let errorCode: number = 400

        try {

            const studentsDB: Student[] = await BaseDataBase.connection("student")
                .select("email")
                .where({ email: student.getEmail() })

            if (studentsDB.length > 0) {
                errorCode = 409
                throw new Error("There is already a Student registered with this email address.")
            }

            const hobbies: Hobby[] = await BaseDataBase.connection("hobby")

            let studentHobbyId: number[] = []
            let studentHobbyName: string[] = student.getHobby()
            let newStudentHobbies: string[] = []

            studentHobbyName.forEach((studentHobby) => {

                let checkHobbies: Hobby | undefined = hobbies.find((hobby) => hobby.name.toLowerCase() === studentHobby.toLowerCase())


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

            const updateHobbies: Hobby[] = await BaseDataBase.connection("hobby")

            newStudentHobbies.forEach((hobby) => {
                const newHobby: Hobby | undefined = updateHobbies.find((hobbyDB) => hobby.toLowerCase() === hobbyDB.name.toLowerCase())
                newHobby !== undefined && studentHobbyId.push(newHobby.id)
            })

            await BaseDataBase.connection("student")
                .insert({
                    name: student.getName(),
                    email: student.getEmail(),
                    birth_date: student.getBirthDate()
                })

            const newStudentsDB: Student[] = await BaseDataBase.connection("student")
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

    // Atualiza a turma do estudante
    async updateStudentClass(studentId: number, newClassId: number) {
        let errorCode: number = 400
        try {

            const checkClass: ClassModel[] = await BaseDataBase.connection("class")
                .select("*")
                .where({ id: newClassId })

            if (checkClass.length === 0) {
                errorCode = 404
                throw new Error("Class not registered.")
            }

            await BaseDataBase.connection("student")
                .update({ class_id: newClassId })
                .where({ id: studentId })

            return [200, "Student's Class succefully updated."]
        } catch (error: any) {
            return [errorCode, error.message]
        }
    }
}