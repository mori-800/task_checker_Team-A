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
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'))

// firebaseの初期化設定　森
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

// ジャンルの読み取り処理
app.get("/genres", async(req, res) => {
  try {
  const AllGenres = await prisma.genre.findMany();
  res.json(AllGenres)
  } catch(error) {
  console.log(error)
  }
})

// タスクの保存処理
app.post("/tasks", upload.single('image_url'), async (req, res) => {

  try {
    const imagePath = req.file ? req.file.path : null;
    const deadlineDate = new Date(req.body.deadlineDate)
    const savedData = await prisma.task.create({
      data: {
        ...req.body,
        image_url: imagePath,
        deadlineDate: deadlineDate,
        status: Number(req.body.status),
        genreId: Number(req.body.genreId)

      },
    });

    if (savedData.image_url) {
      savedData.image_url = `http://localhost:3000/${savedData.image_url}`
    } else {
      savedData.image_url = null;
    }

    res.json(savedData)
  } catch(error) {
    console.log(error)
    res.status(500).send("タスクの保存に失敗しました")
  }
})

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

//firebaseにユーザーリストをリクエスト　森
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

app.listen(3000, () => {
  console.log("listening on localhost 3000")
})  