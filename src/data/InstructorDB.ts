import { InstructorModel } from "../model/Instructor";
import { BaseDataBase } from "./BaseDataBase";
import { instructorSkill, Skill } from "../types"
import { ClassModel } from "../model/ClassModel";

export class InstructorDB extends BaseDataBase {

    // Inseri os dados do novo instrutor no banco de dados.
    async insertInstructor(instructor: InstructorModel) {
        let errorCode: number = 500
        try {

            const instructorDb: InstructorModel[] = await BaseDataBase.connection("instructor")
                .select("email")
                .where({ email: instructor.getEmail() })

            if (instructorDb.length > 0) {
                errorCode = 409
                throw new Error("There is already a Instructor registered with this email address.")
            }

            const skills: Skill[] = await BaseDataBase.connection("skill")

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

            instructorSkillByName.forEach((instructorSkill: string) => {

                let checkSkills: Skill | undefined = skills.find(
                    (skill: Skill) => skill.name.toLowerCase() === instructorSkill.toLowerCase()
                )

                checkSkills !== undefined ?
                    instructorSkillById.push(checkSkills.id) : newInstructorSkill.push(instructorSkill);
            })

            for (const instructorSkill of newInstructorSkill) {
                await BaseDataBase.connection("skill")
                    .insert({
                        name: instructorSkill
                    })
            }

            const updateSkills: Skill[] = await BaseDataBase.connection("skill")

            newInstructorSkill.forEach((skill: string) => {
                const newSkill: Skill | undefined =
                    updateSkills.find(
                        (skillDB: Skill) => skill.toLowerCase() === skillDB.name.toLowerCase()
                    )
                newSkill !== undefined && instructorSkillById.push(newSkill.id)
            })

            await BaseDataBase.connection("instructor")
                .insert({
                    name: instructor.getName(),
                    email: instructor.getEmail(),
                    birth_date: instructor.getBirthDate()
                })

            const newInstructorDB: instructorSkill[] = await BaseDataBase.connection("instructor")
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

            const result: instructorSkill[] = await BaseDataBase.connection("instructor")
                .select("name", "id", "email", "class_id as classID", "birth_date as birthDate")

            if (!result.length) {
                throw new Error("Instructor not found.")
            }

            const response: Array<instructorSkill> = []

            for (const instructor of result) {
                const skills: Array<instructorSkill> = await BaseDataBase.connection("instructor")
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
                    birthDate: instructor.birthDate,
                    classId: instructor.classId,
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
        let errorCode = 500
        try {
            const checkClassId: ClassModel[] = await BaseDataBase.connection("class")
                .select("*")
                .where({ id: classId })

            if (checkClassId.length === 0) {
                errorCode = 404
                throw new Error("ClassId not registered.")
            }

            const checkInstructorId: InstructorModel[] = await BaseDataBase.connection("instructor")
                .select("*")
                .where({ id: id })

            if (checkInstructorId.length === 0) {
                errorCode = 404
                throw new Error("InstructorId not registered.")
            }

            await BaseDataBase.connection("instructor")
                .update({ class_id: classId })
                .where({ id: id })

            return [200, "Instructor's class succefully updated."]
        } catch (error: any) {
            return [errorCode, error.message]
        }
    }
}