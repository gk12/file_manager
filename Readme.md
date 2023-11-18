# Tech Stack

- NodeJS
- ExpressJS
- MongoDB

### For database we are using MongoDB with Mongoose(ORM)

### For Authentication part we are using token based authentication using JSON WEB TOKEN

## Basic Requirements

- NodeJS >= 14
- A running instance of MongoDB(for now i have used my mongodb cluster)

# Steps To Start The Application

- First of all you need to install all of the dependencies using

```
 npm install
```

Once all dependencies have been installed take a look at the .env if all the environment variables are present if yes then you can start the server with a simple

```
 npm start
```

## Routes

First Of All, You need to get a token to access all the other routes You can get a token using login route(http://localhost:8080/login) by passing payload

```
{
    "email": "Registered Email Id",
    "password":"Valid Password"
}
```

After successful login you will receive the token

```
{
    "token": "some token"
}
```

### NOTE :- You will need to include this token in the headers as Authorization header without Bearer

```
headers : {
  "Authorization" : token
}
```

### File Routes

```
/api/v1/create/folder
```

You need to pass folder_name in req.body to create folder

```
Example :- {
  folder_name: "test"
}
```

```
/api/v1/create/sub_folder
```

You need to pass folder_name and sub_folder in req.body to create folder

```
Example :- {
  folder_name: "test",
  sub_folder: "test_sub_folder"
}
```

```
/api/v1/upload/file
```

To upload a file. You need to create a a field in multipart form formdata named file and attach your actual file to it additional fields are folder_name and subfolder_name where you want to store the uploaded file

```
Example :- {
  file: example.txt,
  folder_name: "test,
  sub_folder: "test_sub_folder"
}
```

```
/api/v1/remove/file
```

To delete a file you simply need to pass the complete path of the file.

```
Example :- {
  path: "test/test_sub_folder/example.txt"
}
```
