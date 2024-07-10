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