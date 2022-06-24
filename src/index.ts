import { app } from "./app";
import { getAllClasses } from "./endpoints/getAllClasses";
import { createNewClass } from "./endpoints/createNewClass"
import { getActiveClasses } from "./endpoints/getActiveClasses";
import { changeClassModule } from "./endpoints/changeClassModule";
import StudentControler from "./endpoints/StudentControler";

//-- getAllClasses --//
app.get("/class", getAllClasses)
//-- createNewClass --//
app.post("/class", createNewClass)
//-- getActiveClasses --//
app.get("/activeClasses", getActiveClasses)
//-- changeClassModule --//
app.put("/classes/:id", changeClassModule)




// student endpoints
const studentControler = new StudentControler()
app.get("/student", studentControler.getStudent)
app.post("/student", studentControler.createStudent)
app.put("/student/:studentId", studentControler.updateStudentClass)

