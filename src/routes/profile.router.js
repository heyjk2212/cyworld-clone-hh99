import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { profileSchema } from "../validation/joi.js";
// import AWS from "aws-sdk";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import path from "path";
import dotenv from "dotenv";
dotenv.config();

// AWS 설정 로드
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

const router = express.Router();

// let s3 = new AWS.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "hanghae99-assets",
//     key: function (req, file, cb) {
//       let extension = path.extname(file.originalname);
//       cb(null, Date.now().toString() + extension);
//     },
//     acl: "public-read-write",
//   }),
// });

// 프로필 등록
router.post(
  "/users/:memberId/profile",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId } = req.params;
      // const { mood, message, profileImage, introduction } = req.body;
      const validation = await profileSchema.validateAsync(req.body);
      const validateParams = await profileSchema.validateAsync(req.params);
      const { memberId } = validateParams;
      const { mood, message, profileImage, introduction } = validation;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "프로필을 등록할 할 권한이 없습니다." });
      }

      const findUser = await prisma.users.findFirst({
        where: {
          memberId: +memberId,
        },
      });

      if (!findUser) {
        return res
          .status(400)
          .json({ errorMessage: "유저가 존재하지 않습니다." });
      }

      const userProfile = await prisma.profile.create({
        data: {
          MemberId: +memberId,
          mood,
          message,
          profileImage,
          introduction,
        },
      });

      return res.status(201).json({ message: "프로필이 등록 되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 프로필 조회
router.get("/users/:memberId/profile", async (req, res, next) => {
  try {
    // const { memberId } = req.params;
    const validateParams = await profileSchema.validateAsync(req.params);
    const { memberId } = validateParams;

    const user = await prisma.users.findFirst({
      where: {
        memberId: +memberId,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ errorMessage: "유저가 존재하지 않습니다." });
    }

    const userProfile = await prisma.profile.findFirst({
      where: {
        MemberId: +memberId,
      },
      select: {
        MemberId: true,
        mood: true,
        profileImage: true,
        introduction: true,
        message: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ data: userProfile });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "서버 에러" });
  }
});

// 프로필 수정
router.patch(
  "/users/:memberId/profile",
  authMiddleware,
  // upload.single("file"),
  async (req, res, next) => {
    try {
      // const { memberId } = req.params;
      // const { mood, message, introduction } = req.body;
      const validation = await profileSchema.validateAsync(req.body);
      const validateParams = await profileSchema.validateAsync(req.params);
      const { memberId } = validateParams;
      const { mood, message, introduction } = validation;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "프로필을 업데이트 할 권한이 없습니다." });
      }

      // 파일 정보 확인을 위한 콘솔 로그
      console.log(req.file);

      // 업로드된 파일은 req.file 객체에 저장
      // const file = req.file; // 업로드된 파일 정보

      // const params = {
      //   Bucket: "hanghae99-assets",
      //   Key: file.originalname,
      //   Body: file.buffer, // 파일의 데이터
      // };

      // S3에 파일 업로드
      //const result = await s3.upload(params).promise();

      // S3에 파일 업로드된 URL을 프로필 업데이트에 사용
      await prisma.profile.update({
        where: {
          MemberId: +memberId,
        },
        data: {
          mood,
          message,
          // profileImage: result.Location, // S3에 업로드된 파일의 URL
          introduction,
        },
      });

      return res.status(201).json({ message: "프로필이 수정되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 프로필 삭제
router.delete(
  "/users/:memberId/profile",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId } = req.params;
      const validateParams = await profileSchema.validateAsync(req.params);
      const { memberId } = validateParams;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "프로필을 삭제할 권한이 없습니다." });
      }

      await prisma.profile.delete({
        where: {
          MemberId: +memberId,
        },
      });

      return res.status(200).json({ errorMessage: "프로필이 삭제되었습니다" });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);
export default router;
