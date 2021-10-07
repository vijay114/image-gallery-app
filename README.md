# OJ Gallery

This application allows user to create an account and manage images

Application front end is built using React and backend is build using nodeJS

Database Used is MongoDB

Application is integrated with Swagger

### Contents

- [How to run on local machine with Docker](#how-to-run-on-local-machine-with-docker)
- [How to run on local machine without Docker ](#how-to-run-on-local-machine-without-docker)

## How to run on local machine with Docker

Download and Install Docker from https://www.docker.com/products/docker-desktop

Install NodeJS from https://nodejs.org/en/download/ if not already installed.

Clone git repo or download source code

```bash
git clone https://github.com/vijay114/oj-gallery.git
```

Navigate to cloned folder using terminal

```bash
cd <path-to-directory>/oj-gallery
```

Create front end docker image

```bash
docker build --file oj-gallery-react/react.docker -t oj-gallery-web-frontend .
```

Create backend end docker image

```bash
docker build --file oj-gallery-nodejs/node.docker -t oj-gallery-web-backe
```

Run both using docker compose

```bash
docker-compose -f docker-compose.yml up
```

You can view the exposed APIs in Swagger on following url

 http://localhost:8080/swagger/api-docs/

You can view the front end on following url

 http://localhost:3000/

Sign up, sign in and upload images. For best viewing experience upload more then 10 images.

## How to run on local machine without Docker

Install NodeJS from https://nodejs.org/en/download/ if not already installed.

Clone git repo or download source code

```bash
git clone https://github.com/vijay114/oj-gallery.git
```

### Running Backend

Navigate to oj-gallery-nodejs folder using terminal

```bash
cd <path-to-directory>/oj-gallery/oj-gallery-nodejs
```

Update environment values according to your local in .env file of oj-gallery-nodejs folder

Install node modules

```bash
npm install
```

Run nodejs server

```bash
npm start
```

You can view the exposed APIs in Swagger on following url

 http://localhost:8080/swagger/api-docs/

### Running Front End 

Navigate to oj-gallery-nodejs folder using terminal

```bash
cd <path-to-directory>/oj-gallery/oj-gallery-nodejs
```

Update environment values according to your local in .env file of oj-gallery-react folder

Install node modules

```bash
npm install
```

Run react

```bash
npm start
```

You can view the front end on following url

 http://localhost:3000/

Sign up, sign in and upload images. For best viewing experience upload more then 10 images.
