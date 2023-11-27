import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { commentsSchema } from "../validation/joi.js";

const router = express.Router();

// 댓글 등록
router.post(
  "/users/:memberId/posts/:postId/comments",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId } = req.params;
      // const { contents } = req.body;
      const validation = await commentsSchema.validateAsync(req.body);
      const validateParams = await commentsSchema.validateAsync(req.params);
      const { contents } = validation;
      const { memberId, postId } = validateParams;
      const user = req.user;

      const post = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });

      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: "등록된 포스트가 아닙니다." });
      }

      await prisma.comments.create({
        data: {
          MemberId: +memberId,
          writerId: +user.memberId,
          PostId: +postId,
          contents,
        },
      });

      return res.status(201).json({ message: "댓글등록이 완료되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ errorMessage: "서버 에러" });
    }
  },
);

// 댓글 수정
router.put(
  "/users/:memberId/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId, commentId } = req.params;
      // const { contents } = req.body;
      const validation = await commentsSchema.validateAsync(req.body);
      const validateParams = await commentsSchema.validateAsync(req.params);
      const { contents } = validation;
      const { memberId, postId, commentId } = validateParams;
      const user = req.user;

      const checkComments = await prisma.comments.findFirst({
        where: {
          commentId: +commentId,
        },
      });

      if (!checkComments) {
        return res.status(403).json({ errorMessage: "없는 댓글입니다." });
      }

      // 로그인한 사용자와 프로필 주인이 일치하지 않으면 수정할 권한이 없음
      // 로그인한 사용자가 글쓴이가 아니어도 수정할 권한이 없음
      if (
        user.memberId !== +memberId &&
        user.memberId !== checkComments.writerId
      ) {
        return res
          .status(403)
          .json({ errorMessage: "댓글을 수정할 권한이 없습니다." });
      }

      const post = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });

      if (!post) {
        return res.status(404).json({ errorMessage: "없는 포스트입니다" });
      }

      const comment = await prisma.comments.findFirst({
        where: {
          commentId: +commentId,
        },
      });

      if (!comment) {
        return res.status(404).json({ errorMessage: "없는 댓글입니다" });
      }

      await prisma.comments.update({
        where: {
          MemberId: +memberId,
          PostId: +postId,
          commentId: +commentId,
        },
        data: {
          contents,
        },
      });

      return res.status(201).json({ message: "수정되었습니다." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ errorMessage: "서버 에러" });
    }
  },
);

// 댓글 삭제
router.delete(
  "/users/:memberId/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      // const { memberId, postId, commentId } = req.params;
      const validateParams = await commentsSchema.validateAsync(req.params);
      const { memberId, postId, commentId } = validateParams;
      const user = req.user;

      const checkComments = await prisma.comments.findFirst({
        where: {
          commentId: +commentId,
        },
      });

      if (!checkComments) {
        return res.status(404).json({ errorMessage: "없는 댓글입니다" });
      }

      // 로그인한 사용자와 프로필 주인이 일치하지 않으면 삭제할 권한이 없음
      // 로그인한 사용자가 글쓴이가 아니어도 삭제할 권한이 없음
      if (
        user.memberId !== +memberId &&
        user.memberId !== checkComments.writerId
      ) {
        return res
          .status(403)
          .json({ errorMessage: "댓글을 삭제할 권한이 없습니다." });
      }

      const post = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });

      if (!post) {
        return res.status(404).json({ errorMessage: "없는 포스트입니다" });
      }

      await prisma.comments.delete({
        where: {
          MemberId: +memberId,
          PostId: +postId,
          commentId: +commentId,
        },
      });

      return res.status(200).json({ message: "삭제가 완료되었습니다" });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ errorMessage: "서버 에러" });
    }
  },
);
export default router;
