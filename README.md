# cyworld-clone-hh99

## ERD

![drawSQL-clone-project-export-2023-11-26](https://github.com/heyjk2212/cyworld-clone-hh99/assets/147573753/11a8203b-9a30-491c-99a0-3311ba9602a2)

## API SPEC

### 3000 포트사용

|기능|METHOD|URL|
|:--|:--:|:--|
| 회원가입 API |POST|http://localhost:3000/api/register
|로그인 API |POST|http://localhost:3000/api/login
| 전체 사용자 조회 API |GET | http://localhost:3000/api/users
| 사용자 상세 조회 API |GET | http://localhost:3000/api/users/memberId
| 게시글(+댓글) 조회 API |GET | http://localhost:3000/api/users/memberId/posts
| 게시글 등록 API |POST | http://localhost:3000/api/users/memberId/posts/new
| 게시글 수정 API |PATCH | http://localhost:3000/api/users/memberId/posts/edit
| 게시글 삭제 API |DELETE | http://localhost:3000/api/users/memberId/posts/postId
| 게시글 좋아요 API |POST | http://localhost:3000/api/users/memberId/posts/postId/like
| 게시판 댓글 등록 API |POST | http://localhost:3000/api/users/memberId/posts/postId/comments
| 게시판 댓글 수정 API |PUT | http://localhost:3000/api/users/memberId/posts/postId/comments
| 게시판 댓글 삭제 API |DELETE | http://localhost:3000/api/users/memberId/posts/postId/comments
| 방명록 작성 API |POST | http://localhost:3000/api/users/memberId/guestbook
| 방명록 조회 API |GET | http://localhost:3000/api/users/memberId/guestbook
| 방명록 수정 API |PATCH | http://localhost:3000/api/users/memberId/guestbook/postId
| 방명록 삭제 API |DELETE | http://localhost:3000/api/users/memberId/guestbook/postId
| 쥬크박스 노래 등록 API |POST | http://localhost:3000/api/users/memberId/songs
| 쥬크박스 노래 조회 API |GET | http://localhost:3000/api/users/memberId/songs
| 쥬크박스 노래 삭제 API |DELETE | http://localhost:3000/api/users/memberId/songs/songId
| 사용자 프로필 조회 API |GET | http://localhost:3000/api/users/memberId/profile
| 사용자 프로필 수정 API |PATCH | http://localhost:3000/api/users/memberId/profile
| 사용자 프로필 삭제 API |DELETE | http://localhost:3000/api/users/memberId/profile
| 다이어리 작성 API |POST | http://localhost:3000/api/users/memberId/diary
| 다이어리 조회 API |GET | http://localhost:3000/api/users/memberId/diary
| 다이어리 수정 API |PUT | http://localhost:3000/api/users/memberId/diary/diaryId
| 다이어리 삭제 API |DELETE | http://localhost:3000/api/users/memberId/diary/diaryId



