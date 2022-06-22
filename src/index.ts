import { app } from "./app";
import { getAllClasses } from "./endpoints/getAllClasses";


app.get("/class", getAllClasses)