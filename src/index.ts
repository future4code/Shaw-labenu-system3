import { app } from "./app";
import StudentControler from "./endpoints/StudentControler";
import { InstructorController } from "./endpoints/InstructorController";
import { ClasseControler } from "./endpoints/ClassControler"

// class endpoints 
const classeControler = new ClasseControler()
app.get("/class", classeControler.getAllClasses)
app.post("/class", classeControler.createNewClass)
app.get("/activeClasses", classeControler.getActiveClasses)
app.put("/classes/:id", classeControler.changeClassModule)

// student endpoints
const studentControler = new StudentControler()
app.get("/student", studentControler.getStudent)
app.post("/student", studentControler.createStudent)
app.put("/student/:studentId", studentControler.updateStudentClass)


// instructor endpoints 
const instructorController = new InstructorController()
app.post("/instructor", instructorController.postCreateInstructor)
app.get("/instructors", instructorController.getAllInstructor)
app.put("/instructor/:id", instructorController.putChangeInstructorClass)
