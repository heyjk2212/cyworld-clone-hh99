# cyworld-clone-hh99

## ERD

![drawSQL-clone-project-export-2023-11-26](https://github.com/heyjk2212/cyworld-clone-hh99/assets/147573753/11a8203b-9a30-491c-99a0-3311ba9602a2)

<br>

## 주요 기능

- 사용자 인증과 권한 관리
- 프로필 소유주는 모든 페이지에서 삭제 권한을 보유하며, 다른 사용자의 글 수정 권한은 없고 해당 글의 삭제 권한만 가짐
- 방명록과 게시판: 로그인한 사용자는 글을 작성하고 수정, 삭제할 수 있으며, 프로필 소유주는 해당 글의 삭제 권한만 가짐
- 쥬크박스, 다이어리, 프로필 페이지: 쓰기, 수정, 삭제 권한은 프로필 소유주에게만 부여됨
- 모든 로그인한 사용자는 페이지를 볼 수 있음
- 이미지 업로드 및 저장 기능은 AWS S3를 활용함

<br>

## API SPEC

### 3000 포트사용

| 기능                       | METHOD | URL                                                               |
| :------------------------- | :----: | :---------------------------------------------------------------- |
| 회원가입 API               |  POST  | http://localhost:3000/api/register                                |
| 로그인 API                 |  POST  | http://localhost:3000/api/login                                   |
| 전체 사용자 조회 API       |  GET   | http://localhost:3000/api/users                                   |
| 사용자 상세 조회 API       |  GET   | http://localhost:3000/api/users/memberId                          |
| 게시글(+댓글) 조회 API     |  GET   | http://localhost:3000/api/users/memberId/posts                    |
| 게시글 등록 API            |  POST  | http://localhost:3000/api/users/memberId/posts/new                |
| 게시글 수정 API            | PATCH  | http://localhost:3000/api/users/memberId/posts/edit               |
| 게시글 삭제 API            | DELETE | http://localhost:3000/api/users/memberId/posts/postId             |
| 게시글 좋아요 등록 API     |  POST  | http://localhost:3000/api/users/memberId/posts/postId/like/add    |
| 게시글 좋아요 삭제 API API |  POST  | http://localhost:3000/api/users/memberId/posts/postId/like/remove |
| 게시판 댓글 등록 API       |  POST  | http://localhost:3000/api/users/memberId/posts/postId/comments    |
| 게시판 댓글 수정 API       |  PUT   | http://localhost:3000/api/users/memberId/posts/postId/comments    |
| 게시판 댓글 삭제 API       | DELETE | http://localhost:3000/api/users/memberId/posts/postId/comments    |
| 방명록 작성 API            |  POST  | http://localhost:3000/api/users/memberId/guestbook                |
| 방명록 조회 API            |  GET   | http://localhost:3000/api/users/memberId/guestbook                |
| 방명록 수정 API            | PATCH  | http://localhost:3000/api/users/memberId/guestbook/postId         |
| 방명록 삭제 API            | DELETE | http://localhost:3000/api/users/memberId/guestbook/postId         |
| 쥬크박스 노래 등록 API     |  POST  | http://localhost:3000/api/users/memberId/songs                    |
| 쥬크박스 노래 조회 API     |  GET   | http://localhost:3000/api/users/memberId/songs                    |
| 쥬크박스 노래 삭제 API     | DELETE | http://localhost:3000/api/users/memberId/songs/songId             |
| 사용자 프로필 조회 API     |  GET   | http://localhost:3000/api/users/memberId/profile                  |
| 사용자 프로필 수정 API     | PATCH  | http://localhost:3000/api/users/memberId/profile                  |
| 사용자 프로필 삭제 API     | DELETE | http://localhost:3000/api/users/memberId/profile                  |
| 다이어리 작성 API          |  POST  | http://localhost:3000/api/users/memberId/diary                    |
| 다이어리 조회 API          |  GET   | http://localhost:3000/api/users/memberId/diary                    |
| 다이어리 수정 API          |  PUT   | http://localhost:3000/api/users/memberId/diary/diaryId            |
| 다이어리 삭제 API          | DELETE | http://localhost:3000/api/users/memberId/diary/diaryId            |
