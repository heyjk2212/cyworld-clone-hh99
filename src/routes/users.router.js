import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserSchema } from "../validation/joi.js";

dotenv.config();
const router = express.Router();

//회원가입
router.post("/register", async (req, res, next) => {
  try {
    const validation = await UserSchema.validateAsync(req.body);
    const { id, password, name, nickname } = validation;

    const existUser = await prisma.users.findFirst({
      where: { id: id },
    });
    if (existUser) {
      return res.status(400).json({ message: "중복된 ID 입니다." });
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        id: id,
        password: encryptPassword,
        name: name,
        nickname: nickname,
      },
    });
    return res.status(200).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error(error);
  }
});

//로그인
router.post("/login", async (req, res, next) => {
  try {
    const { id, password } = req.body;
    const key = process.env.SECRET_KEY;
    const findUser = await prisma.users.findFirst({
      where: { id: id },
    });

    if (!findUser) {
      return res.status(400).json({ message: "존재하지 않는 ID입니다." });
    }

    const decodedPassword = await bcrypt.compare(password, findUser.password);

    if (!decodedPassword) {
      return res.status(400).json({ message: "비밀번호가 틀립니다." });
    }

    const token = jwt.sign(
      {
        memberId: findUser.memberId,
      },
      key,
      { expiresIn: "1h" },
    );
    const data = await prisma.users.findFirst({
      where: { id: id },
      select: {
        memberId: true,
        id: true,
        name: true,
        nickname: true,
      },
    });
    return res.status(200).json({ token: `Bearer ${token}`, data });
  } catch (error) {
    console.error(error);
  }
});

// 유저들 정보 가져오기
router.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        memberId: true,
        id: true,
        nickname: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
  }
});

// 유저 상세 조회
router.get("/users/:memberId", async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const users = await prisma.users.findFirst({
      where: {
        memberId: +memberId,
      },
      select: {
        memberId: true,
        id: true,
        nickname: true,
        name: true,
        Profile: {
          select: {
            profileImage: true,
            mood: true,
            message: true,
            introduction: true,
          },
        },
      },
    });

    if (users.Profile === null) {
      await prisma.profile.create({
        data: {
          MemberId: +memberId,
          mood: "즐거움",
          message: "곧 크리스마스",
          introduction: "안녕하세요",
          backgroundMusic: "https://www.youtube.com/watch?v=3AtDnEC4zak",
          profileImage:
            "https://hanghae99-assets.s3.ap-northeast-2.amazonaws.com/%EC%82%AC%EC%A7%84.jfif",
        },
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        memberId: +memberId,
      },
      select: {
        memberId: true,
        id: true,
        nickname: true,
        name: true,
        Profile: {
          select: {
            profileImage: true,
            mood: true,
            message: true,
            introduction: true,
          },
        },
      },
    });
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
  }
});

export default router;
