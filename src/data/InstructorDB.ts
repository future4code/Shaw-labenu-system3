import { InstructorModel } from "../model/Instructor";
import { BaseDataBase } from "./BaseDataBase";

type instructorSkill = {
    id: number,
    name: string,
    email: string,
    birthDate: Date,
    classId: number,
    skill: string[]
}
export class InstructorDB extends BaseDataBase {

    // Inseri os dados do novo instrutor no banco de dados.
    async insertInstructor(instructor: InstructorModel) {
        let errorCode = 500
        try {

            const instructorDb = await BaseDataBase.connection("instructor")
                .select("email")
                .where({ email: instructor.getEmail() })

            if (instructorDb.length > 0) {
                errorCode = 409
                throw new Error("There is already a Instructor registered with this email address.")
            }

            const skills = await BaseDataBase.connection("skill")

            let instructorSkillById: number[] = []



            let checkSkills: string[] = instructor.getSkills()

            const instructorSkillByName: string[] = checkSkills.filter((skill: string) => {
                return (
                    skill.toUpperCase() === "JS" ||
                    skill.toUpperCase() === "CSS" ||
                    skill.toUpperCase() === "REACT" ||
                    skill.toUpperCase() === "TYPESCRIPT" ||
                    skill.toUpperCase() === "OOP"
                )
            })

            let newInstructorSkill: string[] = []

            instructorSkillByName.forEach((instructorSkill) => {

                let checkSkills = skills.find((skill: {
                    id: number,
                    name: string
                }) => skill.name.toLowerCase() === instructorSkill.toLowerCase())

                if (checkSkills !== undefined) {
                    instructorSkillById.push(checkSkills.id)
                } else {
                    newInstructorSkill.push(instructorSkill)
                }
            })

            for (const instructorSkill of newInstructorSkill) {
                await BaseDataBase.connection("skill")
                    .insert({
                        name: instructorSkill
                    })
            }

            const updateSkills = await BaseDataBase.connection("skill")

            newInstructorSkill.forEach((skill) => {
                const newSkill = updateSkills.find((skillDB) => skill.toLowerCase() === skillDB.name.toLowerCase())
                newSkill !== undefined && instructorSkillById.push(newSkill.id)
            })

            await BaseDataBase.connection("instructor")
                .insert({
                    name: instructor.getName(),
                    email: instructor.getEmail(),
                    birth_date: instructor.getBirthDate()
                })

            const newInstructorDB = await BaseDataBase.connection("instructor")
                .select("id")
                .where({ email: instructor.getEmail() })

            for (const skillId of instructorSkillById) {
                await BaseDataBase.connection("instructor_skill")
                    .insert({
                        instructor_id: newInstructorDB[0].id,
                        skill_id: skillId,
                    })
            }

            return [201, "Instructor succefully registered."]
        } catch (error: any) {
            return [errorCode, error.message]
        }

    }

    // Retorna os dados dos instrutores no banco de dados.
    async selectAllInstructor() {
        try {
            const result = await BaseDataBase.connection("instructor")
                .select("*")
            if (!result.length) {
                throw new Error("Instructor not found.")
            }

            const response: Array<instructorSkill> = []

            for (const instructor of result) {
                const skills = await BaseDataBase.connection("instructor")
                    .join('instructor_skill', 'instructor_skill.instructor_id', 'instructor.id')
                    .join('skill', 'instructor_skill.skill_id', 'skill.id')
                    .select('skill.name')
                    .where({ instructor_id: instructor.id })

                const instructorsSkills = skills.map((skill) => {
                    return skill.name
                })

                response.push({
                    id: instructor.id,
                    name: instructor.name,
                    email: instructor.email,
                    birthDate: instructor.birth_date,
                    classId: instructor.class_id,
                    skill: instructorsSkills
                })
            }

            return response
        } catch (error: any) {
            return error.message
        }

    }

    // Aloca o instrutor para uma nova turma.
    async changeInstructorClass(id: number, classId: number) {
        await BaseDataBase.connection("instructor")
            .update({ class_id: classId })
            .where({ id: id })
    }
}