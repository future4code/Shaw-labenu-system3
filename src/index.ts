import { app } from "./app";
import { getAllClasses } from "./endpoints/getAllClasses";
import { createNewClass } from "./endpoints/createNewClass"
import { getActiveClasses } from "./endpoints/getActiveClasses";
import { changeClassModule } from "./endpoints/changeClassModule";

//-- getAllClasses --//
app.get("/class", getAllClasses)
//-- createNewClass --//
app.post("/class", createNewClass)
//-- getActiveClasses --//
app.get("/activeClasses", getActiveClasses)
//-- changeClassModule --//
app.put("/classes/:id", changeClassModule)

