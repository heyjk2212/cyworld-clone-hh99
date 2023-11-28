import express from "express";
import UsersRouter from "./routes/users.router.js";

const app = express();
const PORT = 3000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, `Server running on port ${PORT}`);
});