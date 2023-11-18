const express = require("express");
const app = express();
const fileRoutes = require("./routes/file.routes");
const userRoutes = require("./routes/user.routes");

const { connectToDB } = require("./db");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - Token not provided' });
  }
  const secretKey = 'assignment';
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

app.use("/api/v1",verifyToken, fileRoutes);
app.use("/api/v1",userRoutes);

const startServer = () =>
  app.listen(PORT, function () {
    console.log(`Server listening on ${PORT}`);
  });

connectToDB()
  .then(() => startServer())
  .catch(console.log);
