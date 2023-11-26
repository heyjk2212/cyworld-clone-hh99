import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 프로필 등록
router.post(
  "/users/:memberId/profile",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const { mood, message, profileImage, introduction } = req.body;
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
    const { memberId } = req.params;

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
  async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const { mood, message, profileImage, introduction } = req.body;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "프로필을 업데이트 할 권한이 없습니다." });
      }

      await prisma.profile.update({
        where: {
          MemberId: +memberId,
        },
        data: {
          mood,
          message,
          profileImage,
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
      const { memberId } = req.params;
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
