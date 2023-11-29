import express from "express";
import UsersRouter from "./routes/users.router.js";
import ProfileRouter from "./routes/profile.router.js";
import SongsRouter from "./routes/songs.router.js";
import DiariesRouter from "./routes/diaries.router.js";
import GuestbookRouter from "./routes/guestbook.router.js";
import PostsRouter from "./routes/posts.router.js";
import CommentsRouter from "./routes/comments.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 3000;
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "success" });
});

app.use("/api", [
  UsersRouter,
  ProfileRouter,
  SongsRouter,
  DiariesRouter,
  GuestbookRouter,
  PostsRouter,
  CommentsRouter,
]);

app.listen(PORT, () => {
  console.log(PORT, `Server running on port ${PORT}`);
});