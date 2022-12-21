# vite-plugin-build-gitinfo



自动将应用版本信息、git相关信息插入到你的应用中，方便做追溯。

## Demo
支持console.log、meta、全局变量三种方式，默认开启meta，如果环境没有git，这无法插入git相关信息。
```json
{
    "commit":"提交信息" ,
    "commitdDate":"commit时间",
    "branch":"分支",
    "buildDate":"打包时间",
    "tag": "tag"
}
```

## Install
```sh
yarn add -D vite-plugin-build-gitinfo
# OR npm install -D vite-plugin-build-gitinfo
```

## Usage
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vitePluginAppinfo from 'vite-plugin-build-gitinfo'

export default defineConfig({
  plugins: [
    vitePluginAppinfo({
      enableLog: true
    })
  ],
})
```

## Config

- `showBuildUser` - 显示打包的用户 (`false` by default)
- `showBuildUserEmail` - 显示打包的用户邮箱 (`false` by default)
- `enableMeta` - 添加 \<meta name="commit" content="commit"> 到 \<head>中 (`true` by default)
- `enableLog` - Console打印 (`false` by default)
- `enableGlobal` - 设置全局变量 *\`\_\_APP_INFO\_\_\`* . (`true` by default)
