const AWS = require("@aws-sdk/client-s3");
const fs = require("fs");
const { FileMetadata } = require("./../model/fileModal");
const formidable = require("formidable");
require("dotenv").config();

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;
const Bucket = process.env.BUCKET;

const uploadObject = async (filePath, Key, fileMetadata) => {
  const client = getClient();
  const fileStream = fs.createReadStream(filePath);
  const response = await client.putObject({
    Bucket,
    Key,
    Body: fileStream,
  });

  const newFile = new FileMetadata({
    ...fileMetadata,
  });

  await newFile.save();
  return response;
};

const getClient = () => {
  const client = new AWS.S3({
    credentials: {
      secretAccessKey,
      accessKeyId,
    },
    region,
  });
  return client;
};

const createFolder = async (Key) => {
  try {
    const client = getClient();
    const response = await client.putObject({
      Bucket,
      Key,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const constructKey = (folder_name, owner = "gourav", fileName = "") => {
  return fileName
    ? `${owner}/${folder_name}/${fileName}`
    : `${owner}/${folder_name}/`;
};

const getObject = async (Key) => {
  try {
    const client = getClient();
    const obj = await client.getObject({
      Bucket,
      Key,
    });
    console.log(obj);
    return obj;
  } catch (error) {}
};

const deleteObject = async (Key) => {
  const client = getClient();
  return await client.deleteObject({
    Bucket,
    Key,
  });
};

const handleCreateFolder = async (req, res) => {
  try {
    const { folder_name, sub_folder } = req.body;
    if (!folder_name) {
      return res.send("Bad Request").status(400);
    }

    let key;

    if (sub_folder) {
      key = constructKey(`${folder_name}/${sub_folder}`);
    } else key = constructKey(folder_name);

    const response = await createFolder(key);

    res.json({
      message:
        response["$metadata"].httpStatusCode === 200
          ? "Created Successfully"
          : "Something went wrong",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

const handleFileUpload = async (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.json({
        message: "Error while registering Try Again",
      });
    }
    const { file } = files;
    const { folder_name, sub_folder } = fields;

    if (!file) {
      return res.json({
        message: "file is required",
      });
    }

    if (!folder_name) {
      return res.json({
        message: "folder name is required",
      });
    }

    let key;
    let owner = req.user.username;

    if (sub_folder) {
      key = constructKey(
        `${folder_name}/${sub_folder}`,
        owner,
        file.originalFilename
      );
    } else key = constructKey(folder_name, owner, file.originalFilename);

    const doExist = await FileMetadata.find({ path: key });
    if (doExist.length > 0) {
      return res.json({
        message: "File already exists!",
      });
    }
    const fileMetaData = {
      fileName: file.originalFilename,
      size: file.size,
      owner: owner,
      path: key,
    };

    const upload = await uploadObject(file.filepath, key, fileMetaData);
    console.log(upload);

    res.send("Successfully registered");
  });
};

const handleFileDelete = async (req, res) => {
  try {
    const { path } = req.body;
    const owner = req.user.username;
    const key = `${owner}/${path}`;

    await FileMetadata.deleteOne({ path: key });
    await deleteObject(key);
    return res.status(204);
  } catch (error) {
    res.send("Something Went Wrong");
  }
};

module.exports = {
  handleCreateFolder,
  handleFileUpload,
  handleFileDelete,
};
