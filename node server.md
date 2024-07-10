## 创建项目目录并进入：


## 初始化 npm 项目：

npm init -y

## 安装必要的依赖：

npm install express
npm install -D typescript @types/express @types/node ts-node nodemon

###  初始化 TypeScript 配置：

npx tsc --init

##  修改 tsconfig.json，确保包含以下配置：

```{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 创建 src 目录和主文件 app.ts：

mkdir src
touch src/app.ts

##  在 src/app.ts 中编写 TypeScript 版的 Express 服务器代码

##  运行应用：

npm start


## swagger的集成

npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc

## 在src 目录下创建一个 swagger.ts 文件

## 在你的 src 目录下创建一个 swagger.ts 文件

## http://localhost:3001/api-docs 访问 Swagger UI


# swagger的自动生成

npm install tsoa @types/express express
npm install -D typescript @types/node
## 更新tsconfig
```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

```

