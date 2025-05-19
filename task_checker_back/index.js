const express = require("express")
const app = express();
app.use(express.json());

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

// firebaseの初期化設定　森
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

app.get("/tasks", async(req, res) => {
  try {
  const AllTasks = await prisma.task.findMany();
  const updatedTasks = AllTasks.map((task) => {
    if (task.image_url) {
      task.image_url = `http://localhost:3000/${task.image_url}`
      console.log(task.image_url)
    } else {
      task.image_url = null;
    }
    return task;
  });
  res.json(updatedTasks)
  } catch(error) {
  console.log(error)
  }
})

//ポストの削除機能 river
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

// ジャンルの読み取り処理
app.get("/genres", async(req, res) => {
  try {
  const AllGenres = await prisma.genre.findMany();
  res.json(AllGenres)
  } catch(error) {
  console.log(error)
  }
})

app.post('/tasks', upload.fields([
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, explanation, deadlineDate, status, genreId, assigneeId, authorId } = req.body;

    console.log("🔥 req.body:", req.body);
    console.log("🔥🔥 req.files:", req.files);

const newTask = await prisma.task.create({
  data: {
    name: req.body.name,
    explanation: req.body.explanation,
    deadlineDate: new Date(req.body.deadlineDate),
    status: Number(req.body.status),
    genreId: Number(req.body.genreId),
    assigneeId: req.body.assigneeId,
    makerId: req.body.authorId, // 🔥 ここで authorId の値を makerId に入れる
    image_url: null, // または req.files.image[0].path 等
  }
});


    res.status(201).json(newTask);
  } catch (error) {
    console.error("タスク作成失敗", error);
    res.status(500).json("タスクの保存に失敗しました");
  }
});

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

    const updatedTasks = tasks.map((task) => {
      if (task.image_url) {
        task.image_url = `http://localhost:3000/${task.image_url}`
      } else {
        task.image_url = null;
      }
      return task;
    });

    res.json(updatedTasks); // 検索結果を返す
  } catch (error) {
    console.error("検索処理に失敗しました:", error);
    res.status(500).json({ message: "検索処理に失敗しました" });
  }
});


// ジャンルの追加　吉田
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

// POST /users
app.post('/users', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    const newUser = await prisma.user.create({
      data: {
        uid,
        email,
        displayName,
        photoURL,
      }
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("ユーザー登録エラー:", err);
    res.status(500).json({ error: "ユーザーの登録に失敗しました" });
  }
});


// ユーザー一覧取得エンドポイントの追加
app.get('/users', async (_, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        uid: true,
        displayName: true,
        email: true,
        photoURL: true
      }
    });
    res.json(users)
  } catch (error) {
    res.status(500).send("ユーザーデータの取得に失敗しました")
  }
});

app.listen(3000, () => {
  console.log("listening on localhost 3000")
})  

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
