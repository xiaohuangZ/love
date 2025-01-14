const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// 连接 MongoDB
mongoose.connect("mongodb://localhost:27017/love_diary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 中间件
app.use(cors());
app.use(express.json());

// 定义数据模型
const DiarySchema = new mongoose.Schema({
  date: String,
  title: String,
  content: String,
  tags: [String],
});

const MediaSchema = new mongoose.Schema({
  type: String,
  date: String,
  title: String,
  description: String,
  src: String,
});

const AnniversarySchema = new mongoose.Schema({
  type: String,
  title: String,
  date: String,
  description: String,
  eventType: String,
});

const WishSchema = new mongoose.Schema({
  priority: String,
  priorityText: String,
  title: String,
  description: String,
  completed: Boolean,
});

const Diary = mongoose.model("Diary", DiarySchema);
const Media = mongoose.model("Media", MediaSchema);
const Anniversary = mongoose.model("Anniversary", AnniversarySchema);
const Wish = mongoose.model("Wish", WishSchema);

// API 路由
// 日记相关
app.get("/api/diaries", async (req, res) => {
  try {
    const diaries = await Diary.find().sort({ date: -1 });
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/diaries", async (req, res) => {
  try {
    const diary = new Diary(req.body);
    await diary.save();
    res.json(diary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 照片和视频相关
app.get("/api/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ date: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/media", async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 纪念日相关
app.get("/api/anniversaries", async (req, res) => {
  try {
    const anniversaries = await Anniversary.find();
    res.json(anniversaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/anniversaries", async (req, res) => {
  try {
    const anniversary = new Anniversary(req.body);
    await anniversary.save();
    res.json(anniversary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 心愿相关
app.get("/api/wishes", async (req, res) => {
  try {
    const wishes = await Wish.find();
    res.json(wishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wishes", async (req, res) => {
  try {
    const wish = new Wish(req.body);
    await wish.save();
    res.json(wish);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
