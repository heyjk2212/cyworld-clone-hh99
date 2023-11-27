import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { postsSchema } from "../validation/joi.js";

const router = express.Router();

// 게시글 등록
router.post(
  "/users/:memberId/posts/new",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId } = req.params;
      // const { title, contents } = req.body;
      const validation = await postsSchema.validateAsync(req.body);
      const validateParams = await postsSchema.validateAsync(req.params);
      const { title, contents } = validation;
      const { memberId } = validateParams;
      const user = req.user;

      await prisma.posts.create({
        data: {
          MemberId: +memberId,
          writerId: +user.memberId,
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
    // const { memberId } = req.params;
    const validateParams = await postsSchema.validateAsync(req.params);
    const { memberId } = validateParams;

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
        writerId: true,
        title: true,
        contents: true,
        createdAt: true,
        updatedAt: true,
        likeCount: true,
        Comments: {
          select: {
            commentId: true,
            writerId: true,
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
      // const { memberId, postId } = req.params;
      // const { title, contents } = req.body;
      const validation = await postsSchema.validateAsync(req.body);
      const validateParams = await postsSchema.validateAsync(req.params);
      const { memberId, postId } = validateParams;
      const { title, contents } = validation;
      const user = req.user;

      const checkPosts = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });

      if (!checkPosts) {
        return res
          .status(404)
          .json({ errorMessage: "수정할 게시글이 없습니다." });
      }

      // 로그인한 사용자와 프로필 주인이 일치하지 않으면 수정할 권한이 없음
      // 로그인한 사용자가 글쓴이가 아니어도 수정할 권한이 없음
      if (
        user.memberId !== +memberId &&
        user.memberId !== checkPosts.writerId
      ) {
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
      // const { memberId, postId } = req.params;
      const validateParams = await postsSchema.validateAsync(req.params);
      const { memberId, postId } = validateParams;
      const user = req.user;

      const checkPosts = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });

      if (!checkPosts) {
        return res
          .status(404)
          .json({ errorMessage: "삭제할 게시글이 없습니다." });
      }

      // 로그인한 사용자와 프로필 주인이 일치하지 않으면 수정할 권한이 없음
      // 로그인한 사용자가 글쓴이가 아니어도 수정할 권한이 없음
      if (
        user.memberId !== +memberId &&
        user.memberId !== checkPosts.writerId
      ) {
        return res
          .status(403)
          .json({ errorMessage: "게시글을을 삭제할 권한이 없습니다." });
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

// 게시글 좋아요 등록 API
router.post(
  "/users/:memberId/posts/:postId/like/add",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId } = req.params;
      const validateParams = await postsSchema.validateAsync(req.params);
      const { memberId, postId } = validateParams;
      const userMemberId = req.user.memberId; // 로그인한 사용자의 아이디

      // 해당 사용자가 해당 게시글에 이미 좋아요를 눌렀는지 확인
      const existingLike = await prisma.likes.findFirst({
        where: {
          PostId: +postId,
          MemberId: +userMemberId,
        },
      });

      // 이미 좋아요를 눌렀으면 에러 응답
      if (existingLike) {
        return res.status(400).json({ error: "이미 좋아요를 눌렀습니다" });
      }

      // 좋아요 추가
      const like = await prisma.likes.create({
        data: {
          PostId: +postId,
          MemberId: +userMemberId,
        },
      });

      // 해당 게시물에 좋아요 갯수 증가
      await prisma.posts.update({
        where: {
          postId: +postId,
        },
        data: {
          likeCount: {
            increment: 1, // 좋아요 수를 1 증가
          },
        },
      });

      return res.status(201).json({ message: "좋아요를 했습니다" });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

// 게시글 좋아요 삭제 API
router.delete(
  "/users/:memberId/posts/:postId/like/remove",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId } = req.params;
      const validateParams = await postsSchema.validateAsync(req.params);
      const { memberId, postId } = validateParams;
      const userMemberId = req.user.memberId; // 로그인한 사용자의 아이디

      // 해당 사용자가 해당 게시글에 좋아요를 눌렀는지 확인
      const existingLike = await prisma.likes.findFirst({
        where: {
          PostId: +postId,
          MemberId: +userMemberId,
        },
      });

      // 이미 좋아요를 누른 경우에만 취소
      if (existingLike) {
        // 좋아요 삭제
        const deletedLike = await prisma.likes.deleteMany({
          where: {
            PostId: +postId,
            MemberId: +userMemberId,
          },
        });

        // 해당 게시글의 좋아요 개수 감소
        await prisma.posts.update({
          where: {
            postId: +postId,
          },
          data: {
            likeCount: {
              decrement: 1, // 좋아요 수를 1 감소
            },
          },
        });

        return res.status(200).json({ message: "좋아요를 취소했습니다" });
      } else {
        return res
          .status(404)
          .json({ message: "해당 게시글에 대한 좋아요가 없습니다" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "서버 에러" });
    }
  },
);

export default router;
