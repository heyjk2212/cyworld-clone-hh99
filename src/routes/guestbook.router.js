import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { guestBookSchema } from "../validation/joi.js";

const router = express.Router();

// 방명록 작성/등록
router.post(
  "/users/:memberId/guestbook",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId } = req.params;
      // const { contents } = req.body;
      const validation = await guestBookSchema.validateAsync(req.body);
      const validateParams = await guestBookSchema.validateAsync(req.params);
      const { contents } = validation;
      const { memberId } = validateParams;

      const user = req.user;

      await prisma.guestBook.create({
        data: {
          MemberId: +memberId,
          contents,
          writerId: +user.memberId, // 로그인된 사용자, 즉 글을 작성한 사용자
        },
      });

      return res.status(201).json({ message: "등록이 완료되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 방명록 조회
router.get("/users/:memberId/guestbook", async (req, res, next) => {
  try {
    // const { memberId } = req.params;
    const validateParams = await guestBookSchema.validateAsync(req.params);
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

    const guestbook = await prisma.guestBook.findMany({
      where: {
        MemberId: +memberId,
      },
      select: {
        MemberId: true,
        postId: true,
        contents: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            loginId: true,
            username: true,
            nickname: true,
            Profile: {
              select: {
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ data: guestbook });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "서버 에러" });
  }
});

// 방명록 수정
router.put(
  "/users/:memberId/guestbook/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId } = req.params;
      // const { contents } = req.body;
      const validation = await guestBookSchema.validateAsync(req.body);
      const validateParams = await guestBookSchema.validateAsync(req.params);
      const { contents } = validation;
      const { memberId, postId } = validateParams;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "방명록을 삭제할 권한이 없습니다." });
      }

      await prisma.guestBook.update({
        where: {
          MemberId: +memberId,
          postId: +postId,
        },
        data: {
          contents,
        },
      });

      return res.status(201).json({ message: "해당 방명록이 수정되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 방명록 삭제
router.delete(
  "/users/:memberId/guestbook/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId } = req.params;
      const validateParams = await guestBookSchema.validateAsync(req.params);
      const { memberId, postId } = validateParams;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "방명록을 삭제할 권한이 없습니다." });
      }

      await prisma.guestBook.delete({
        where: {
          MemberId: +memberId,
          postId: +postId,
        },
      });

      return res.status(200).json({ message: "해당 방명록이 삭제되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);
export default router;
