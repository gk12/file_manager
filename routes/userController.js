const mongoose = require('mongoose');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Secret = 'assignment';
async function Hashed(password) {
  const salt = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const duplicate = await User.findOne({ email: email });
    if (duplicate) {
      return res.end('user already regiserted with the same email');
    }
    const hashed = await Hashed(password);
    User.create({ username, email, password: hashed });
    res.json({
      message: 'user created success',
    });
  } catch (error) {
    res.json({
      message: 'Something went wrong',
    });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        message: 'Incorrect password',
      });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      Secret,
      {
        expiresIn: '1h',
      }
    );
    res.json({
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: 'Something went wrong',
    });
  }
};

module.exports = { register, login };
