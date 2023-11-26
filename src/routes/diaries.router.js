import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 다이어리 등록
router.post(
  "/users/:memberId/diary",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const { contents } = req.body;
      const user = req.user;

      // 다이어리 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "다이어리를 작성할 권한이 없습니다." });
      }

      await prisma.diaries.create({
        data: {
          MemberId: +memberId,
          contents,
        },
      });

      return res.status(200).json({ message: "다이어리가 작성되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 다이어리 조회
router.get("/users/:memberId/diary", authMiddleware, async (req, res, next) => {
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

    const myDiary = await prisma.diaries.findMany({
      where: {
        MemberId: +memberId,
      },
      select: {
        MemberId: true,
        contents: true,
        diaryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ data: myDiary });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "서버 에러" });
  }
});

// 다이어리 수정
router.put(
  "/users/:memberId/diary/:diaryId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, diaryId } = req.params;
      const { contents } = req.body;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "다이어리를 수정할 권한이 없습니다." });
      }

      const diary = await prisma.diaries.findFirst({
        where: {
          diaryId: +diaryId,
        },
      });

      if (!diary) {
        return res
          .status(400)
          .json({ errorMessage: "다이어리가 존재하지 않습니다." });
      }

      await prisma.diaries.update({
        where: {
          MemberId: +memberId,
          diaryId: +diaryId,
        },
        data: {
          MemberId: +memberId,
          contents,
        },
      });

      return res
        .status(200)
        .json({ message: "해당 다이러리가 수정되었습니다" });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 다이어리 삭제
router.delete(
  "/users/:memberId/diary/:diaryId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, diaryId } = req.params;
      const user = req.user;

      // 다이어리 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "다이어리를 삭제할 권한이 없습니다." });
      }

      await prisma.diaries.delete({
        where: {
          MemberId: +memberId,
          diaryId: +diaryId,
        },
      });

      return res
        .status(200)
        .json({ message: "해당 다이어리가 삭제되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);
export default router;
