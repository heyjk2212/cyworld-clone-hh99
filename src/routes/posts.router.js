import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 게시글 등록
router.post(
  "/users/:memberId/posts/new",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const { title, contents } = req.body;

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

      await prisma.posts.create({
        data: {
          MemberId: +memberId,
          title,
          contents,
        },
      });

      return res.status(201).json({ message: "게시글이 등록되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 게시글 조회
router.get("/users/:memberId/posts", async (req, res, next) => {
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

    const posts = await prisma.posts.findMany({
      where: {
        MemberId: +memberId,
      },
      select: {
        postId: true,
        title: true,
        contents: true,
        createdAt: true,
        updatedAt: true,
        likeCount: true,
        Comments: {
          select: {
            commentId: true,
            contents: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "서버 에러" });
  }
});

// 게시글 수정
router.patch(
  "/users/:memberId/posts/:postId/edit",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, postId } = req.params;
      const { title, contents } = req.body;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "게시글을 수정할 권한이 없습니다." });
      }

      await prisma.posts.update({
        where: {
          MemberId: +memberId,
          postId: +postId,
        },
        data: {
          title,
          contents,
        },
      });

      return res.status(201).json({ message: "수정이 완료되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 게시글 삭제
router.delete(
  "/users/:memberId/posts/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, postId } = req.params;
      const user = req.user;

      // 프로필 주인이 로그인한 사용자와 일치하는지 확인
      if (user.memberId !== +memberId) {
        return res
          .status(403)
          .json({ errorMessage: "게시글을 삭제할 권한이 없습니다." });
      }

      await prisma.posts.delete({
        where: {
          MemberId: +memberId,
          postId: +postId,
        },
      });

      return res.status(200).json({ message: "삭제가 완료되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 댓글 좋아요 API
router.post(
  "/users/:memberId/posts/:postId/like",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, postId } = req.params;

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

      // 좋아요..

      return res.status(200).json({ message: "좋아요를 했습니다" });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);
export default router;
