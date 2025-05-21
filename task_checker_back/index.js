const express = require("express")
const app = express();

// prismaを読み込む記述
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// cors対策
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


const multer = require('multer');
// multerの初期化（例: storageなどは既に設定済みと仮定）
const upload = multer();
app.use('/uploads', express.static('uploads'))
app.use(express.json());


// firebaseの初期化設定 森
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//============================
// JWT認証ミドルウェアの追加
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("JWT認証エラー:", err);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

//============================
//タスクの取得 river
app.get("/tasks", async(req, res) => {
  try {
  const AllTasks = await prisma.task.findMany();
  res.json(AllTasks)
  } catch(error) {
  console.log(error)
  }
})
//タスクの投稿 river
app.post("/tasks",upload.single('image_url'), async (req, res) => {
  try {
    const deadlineDate = new Date(req.body.deadlineDate)
    const savedData = await prisma.task.create({
      data: {
        ...req.body,
        deadlineDate: deadlineDate,
        status: Number(req.body.status), 
        genreId: Number(req.body.genreId),  
      },
    });
    res.json(savedData)
  } catch(error) {
    console.log(error)
    res.status(500).send("タスクの保存に失敗しました")
  }
})
//タスクの編集 river
app.put("/tasks/:id",async(req, res) => {
  const tasksId=parseInt(req.params.id);
  try{
    const deadlineDate = new Date(req.body.deadlineDate)
    const updateData = await prisma.task.update({
      where:{
        id: tasksId
      },
      data:{
        ...req.body,
        deadlineDate: deadlineDate,
        status: Number(req.body.status),
        genreId: Number(req.body.genreId)
      },
    });
    res.json(updateData)
    } catch(error) {
    res.status(500).send("タスクの更新に失敗しました。")
  }
})
//タスクの削除機能 river
app.delete('/tasks',async(req, res)=>{
  const delete_id=parseInt(req.query.id);
  try{
      const task = await prisma.task.delete({
      where:{
        id: delete_id,
      }
    });
    res.json(task);
  }catch(error){
    console.error("削除に失敗しました",error)
  }
})

//============================
//検索機能 river
app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  try {
    const tasks = await prisma.task.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: {
        deadlineDate: 'desc'
      }
    });
    res.json(tasks); // 検索結果を返す
  }catch(error) {
    console.error("検索処理に失敗しました:", error);
    res.status(500).json({ message: "検索処理に失敗しました" });
  }
});

//============================
// ジャンルの読み取り処理
app.get("/genres", async(req, res) => {
  try {
  const AllGenres = await prisma.genre.findMany();
  res.json(AllGenres)
  } catch(error) {
  console.log(error)
  }
})
// ジャンルの追加 吉田
app.post('/genres', async(req, res) => {
  try {
    const savedData = await prisma.genre.create({data: req.body});
    res.json(savedData)
  }catch(error){
    res.status(500).send("ジャンルの保存に失敗しました");
  }
})
// ジャンルの削除 吉田
app.delete("/genres/:id", async (req, res) => {
  try {
    const genreId = parseInt(req.params.id, 10);
    await prisma.genre.delete({where:{id: genreId}})
    return res.status(200).send();
  } catch(error) {
    res.status(500).send("ジャンルの削除に失敗しました。")
  }
})

//============================
app.get('/users', async(req, res) => {
  // レスポンス返却する際に使用する配列を準備
  let allUsers = [];

  const listAllUsers = async (nextPageToken) => {
    try {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      allUsers = allUsers.concat(listUsersResult.users.map(userRecord => userRecord.toJSON()));
      if (listUsersResult.pageToken) {
        await listAllUsers(listUsersResult.pageToken);
      }
    } catch (error) {
      console.log('Error listing users:', error);
      throw error; //エラーが発生したら、後続の処理を実施しない
    }
  };

  try {
    await listAllUsers();
    res.json(allUsers);
  }catch(error){
    res.status(500).send("ユーザーリストの取得に失敗しました。");
  }
})

//============================
// ステータス変更処理の管理
app.put(`/tasks/:id/status`, async(req, res) => {
  try{
    const tasksId = parseInt(req.params.id, 10);
    const statusId = parseInt(req.body.status, 10);
    const updateData = await prisma.task.update({
      where: { id: tasksId },
      data: { status: statusId }
    });
    res.json(updateData);
  }catch(error){
    res.status(500).send("ステータスの変更に失敗しました")
  }
})


//============================
//マイページ
app.get('/tasks/mypage', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid; // JWTから取得
    const tasks = await prisma.task.findMany({
      where: {
        makerId: userId
      },
      orderBy: {
        deadlineDate: 'asc'
      }
    });
    res.json(tasks);
  } catch (err) {
    console.error("タスク取得エラー:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//============================
//コメント投稿 river
app.post("/comment", async(req, res) => {
  try{
    const savedData = await prisma.comment.create({data: req.body });
    res.json(savedData);
  }catch(error){
    res.status(500).send("コメントの保存に失敗しました");
  }
})
//コメントの取得 river
app.get("/comments", async(_, res) => {
  try{
    const AllComments = await prisma.comment.findMany();
    res.json(AllComments);
  }catch(error){
    res.status(500).send("コメントの取得に失敗しました");
  }
})
//コメントの削除機能 river
app.delete("/comments/:id", async(req, res) => {
  try{
    const commentId = parseInt(req.params.id, 10);
    const deleteComment = await prisma.comment.delete({where: {id: commentId}})
    res.json(deleteComment)
  }catch(error){
    res.status(500).send("コメントの削除に失敗しました。")
  }
})

const { body, validationResult } = require('express-validator');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON形式で送られてくるリクエストも扱えるように（必要なら追加）

app.post(
  '/register',
  [
    // 🌸 ニックネーム：全角ひらがな・カタカナ・漢字
    body('nickname')
      .exists().withMessage('Nickname is required')
      .matches(/^[ぁ-んァ-ン一-龥]+$/).withMessage('Nickname should be in full-width Hiragana, Katakana, or Kanji characters.'),

    // 📧 Email：必須かつ形式チェック
    body('email')
      .exists().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address'),

    // 🔐 Password：必須、6文字以上
    body('password')
      .exists().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // 🔐 Password Confirmation：必須、一致チェック
    body('password_confirmation')
      .exists().withMessage('Password Confirmation is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),

    // ✅ 以下が追加バリデーション -----------------------------

    // [1] ジャンル：必須 + 整数
    body('genreId')
      .exists().withMessage('Genre is required')
      .isInt().withMessage('Genre must be an integer'),

    // [2] タイトル：必須
    body('name')
      .exists().withMessage('Title is required')
      .notEmpty().withMessage('Title cannot be empty'),

    // [3] 説明：必須
    body('explanation')
      .exists().withMessage('Explanation is required')
      .notEmpty().withMessage('Explanation cannot be empty'),

    // [4] 期限：必須 + 日付形式（yyyy-mm-dd）
    body('deadlineDate')
      .exists().withMessage('Deadline is required')
      .isISO8601().withMessage('Deadline must be a valid date in yyyy-mm-dd format'),

    // [5] 担当者：必須（IDが必要）
    body('assigneeId')
      .exists().withMessage('Assignee is required')
      .notEmpty().withMessage('Assignee cannot be empty')
  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // データベースへの保存
      const user = await prisma.user.create({ data: req.body });
      res.json(user);
    } catch (error) {
      console.error("DB error:", error);
      res.status(500).send(error);
    }
  }
);

app.listen(3000, () => {
  console.log("listening on localhost 3000")
})  
