import { app } from "./app";
import { getAllClasses } from "./endpoints/getAllClasses";
import { createNewClass } from "./endpoints/createNewClass"
import { getActiveClasses } from "./endpoints/getActiveClasses";
import { changeClassModule } from "./endpoints/changeClassModule";
import { InstructorController } from "./endpoints/InstructorController";

//-- getAllClasses --//
app.get("/class", getAllClasses)
//-- createNewClass --//
app.post("/class", createNewClass)
//-- getActiveClasses --//
app.get("/activeClasses", getActiveClasses)
//-- changeClassModule --//
app.put("/classes/:id", changeClassModule)

/* INSTRUCTOR */

const instructorController = new InstructorController()

app.post("/instructor", instructorController.postCreateInstructor)

app.get("/instructors", instructorController.getAllInstructor)

app.put("/instructor/:id", instructorController.putChangeInstructorClass)