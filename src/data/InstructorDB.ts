import { Instructor } from "../model/Instructor";
import { BaseDataBase } from "./BaseDataBase";

export class InstructorDB extends BaseDataBase{

    // Inseri os dados do novo instrutor no banco de dados.
    async insertInstructor(instructor: Instructor){
        await BaseDataBase.connection("instructor")
        .insert({
            name: instructor.getName(), 
            email: instructor.getEmail(), 
            birth_date: instructor.getBirth_Date()
        })
    }

    // Retorna os dados dos instrutores no banco de dados.
    async selectAllInstructor(){
        const result = await BaseDataBase.connection("instructor")
        .select("*")

        return result
    }

    // Aloca o instrutor para uma nova turma.
    async changeInstructorClass(id: number, classId: number){
        await BaseDataBase.connection("instructor")
        .update({ class_id: classId })
        .where({ id: id })
    }
}