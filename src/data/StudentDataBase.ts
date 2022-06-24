import { StudentModel } from "../model/StudentModel";
import { BaseDataBase } from "./BaseDataBase";

export class StudentDataBase extends BaseDataBase {

   async getStudentByName(name:string){
    try {

        const result = await BaseDataBase.connection("student")
        .where("name", "like", `%${name}%`)

        if(!result.length){
            throw new Error("Student not found.")
        }

        return result

    } catch (error:any) {
        return error.message
    }
   }

    async createStudent(student: StudentModel) {
       try {
            const hobbies = await BaseDataBase.connection("hobby")
            
            let studentHobbyId:number[] =[]
            let studentHobbyName: string[] = student.getHobby()

            for(const studentHobby of studentHobbyName){
                let checkHobbies = hobbies.find((hobby:string)=> hobby.toLowerCase() === studentHobby.toLowerCase())

                if(checkHobbies.length > 0){
                    studentHobbyId.push(checkHobbies.id) 
                    const index:number = studentHobbyName.findIndex((hobby:string)=> hobby.toLowerCase() === checkHobbies.name.toLowerCase())
                    studentHobbyName.splice(index,1)
                } 
            }

            for(const studentHobby of studentHobbyName){
                BaseDataBase.connection("hobby")
                .insert({                    
                    name: studentHobby
                })
            }



            BaseDataBase.connection("student")
            .insert({
                name: student.getName(),
                email: student.getEmail(),
                birth_date: student.getBirthDate()
            })

            for(const hobbyId of studentHobbyId)
            BaseDataBase.connection("student_hobby")
           
            

        
       } catch (error:any) {
            return error.sqlMessage
       }
    }

    async updateStudentClass(studentId:number, newClassId:number){
        try {
            await BaseDataBase.connection("student")
            .update({class_id: newClassId})
            .where({id: studentId})

            return "Student's Class succefully updated."
        } catch (error:any) {
            return error.sqlMessage
        }
    }
}