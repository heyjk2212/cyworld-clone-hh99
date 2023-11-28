import Joi from "joi";

const commentsSchema = Joi.object({
  contents: Joi.string().min(1).max(1000),
  memberId: Joi.number().integer(),
  postId: Joi.number().integer(),
  commentId: Joi.string(),
});

const diariesSchema = Joi.object({
  contents: Joi.string().min(1).max(1000),
  memberId: Joi.number().integer(),
  diaryId: Joi.number().integer(),
});

const guestBookSchema = Joi.object({
  contents: Joi.string().min(1).max(1000),
  memberId: Joi.number().integer(),
  postId: Joi.number().integer(),
});

const postsSchema = Joi.object({
  title: Joi.string().min(1).max(500),
  contents: Joi.string().min(1).max(1000),
  memberId: Joi.number().integer(),
  postId: Joi.number().integer(),
});

const profileSchema = Joi.object({
  mood: Joi.string().min(1).max(500),
  message: Joi.string().min(1).max(1000),
  profileImage: Joi.string().min(1).max(1000),
  introduction: Joi.string().min(1).max(1000),
  memberId: Joi.number().integer(),
});

const songsSchema = Joi.object({
  songUrl: Joi.string().min(1).max(1000),
  memberId: Joi.number().integer(),
  songId: Joi.number().integer(),
});


const UserSchema = Joi.object({
  id : Joi.string().min(1).max(15).alphanum().required(),
  password : Joi.string().min(1).max(15).required(),
  name : Joi.string().min(1).max(30).required(),
  nickname : Joi.string().min(1).max(10).required()
})

export {
  commentsSchema,
  diariesSchema,
  guestBookSchema,
  postsSchema,
  profileSchema,
  songsSchema,
  UserSchema,
};