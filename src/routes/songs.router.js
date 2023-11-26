import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 쥬크박스 노래 등록
router.post(
  "/users/:memberId/songs",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const { songUrl } = req.body;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "노래를 등록할 권한이 없습니다." });
      }

      await prisma.songs.create({
        data: {
          MemberId: +memberId,
          songUrl,
        },
      });

      return res.status(201).json({ errorMessage: "노래가 등록되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ errorMessage: "서버 에러" });
    }
  },
);

// 노래 조회
router.get("/users/:memberId/songs", async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const user = await prisma.users.findFirst({
      where: {
        memberId: +memberId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ errorMessage: "유저가 존재하지 않습니다." });
    }

    const songs = await prisma.songs.findMany({
      where: {
        MemberId: +memberId,
      },
      select: {
        songId: true,
        songUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ data: songs });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ errorMessage: "서버 에러" });
  }
});

// 노래 삭제
router.delete(
  "/users/:memberId/songs/:songId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, songId } = req.params;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "노래를 삭제할 권한이 없습니다." });
      }

      const song = await prisma.songs.findFirst({
        where: {
          songId: +songId,
        },
      });

      if (!song) {
        return res
          .status(404)
          .json({ errorMessage: "존재하지 않는 노래입니다." });
      }

      await prisma.songs.delete({
        where: {
          MemberId: +memberId,
          songId: +songId,
        },
      });

      return res.status(200).json({ message: "노래가 삭제되었습니다" });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ errorMessage: "서버 에러" });
    }
  },
);
export default router;
