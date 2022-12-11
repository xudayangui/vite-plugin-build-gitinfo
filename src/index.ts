import fs from 'fs';
import { execSync} from 'child_process';
import type { Plugin, IndexHtmlTransformResult } from 'vite';

// git 最后一次提交的 Head

const COMMIT = execSync('git show -s --format=%H').toString().trim()
const COMMITUSERNAME = execSync('git show -s --format=%cn').toString().trim()
const COMMITUSERMAIL = execSync('git show -s --format=%ce').toString().trim()
const COMMITDATE = formatDate(new Date(execSync(`git show -s --format=%cd`).toString()))
const BRANCH = execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
const BUILDDATE = formatDate(new Date())
// 允许在没有 tag 的时候，直接使用 git commit hash 
const TAG = execSync('git describe --long --tags --dirty --always').toString().trim()

const getAppInfo = () => {
  const pkg: any = fs.readFileSync(process.cwd() + '/package.json', 'utf-8');
  const { name, version } = JSON.parse(pkg);
  return {
    name,
    version,
  };
};
interface Options {
  showBuildUser?: boolean;
  enableMeta?: boolean;
  enableLog?: boolean;
  enableGlobal?: boolean;
}
export default (option?: Options): Plugin => {
  const { showBuildUser = false, enableMeta = false, enableLog = false, enableGlobal = false } = option || {};
  return {
    name: 'vite-plugin-build-gitinfo',
    async transformIndexHtml() {
      const els: IndexHtmlTransformResult = [];
      const appInfo = getAppInfo();
      let info: any = {
        ...appInfo
      };
      try {
        info.commit = COMMIT;
        info.userName = COMMITUSERNAME;
        info.ermail = COMMITUSERMAIL;
        info.commitdDate= COMMITDATE;
        info.branch = BRANCH;
        info.buildDate = BUILDDATE;
        info.tag= TAG;
        showBuildUser && (info.buildUser = info.username);
      } catch (error) {}
      let appInfoText = JSON.stringify(info);
      appInfoText = appInfoText.replace(/"/g, "'");
      if(enableMeta){
        for(let i in info){
          els.push({
            tag: "meta",
            injectTo: "head-prepend",
            attrs: {
              name:i ,
              content: info[i]
            }
          });
        }
      }
      enableLog &&
        els.push({
          tag: 'script',
          injectTo: 'body',
          children: `console.log("GIT_INFO",${appInfoText})`
        });
      enableGlobal &&
        els.push({
          tag: 'script',
          injectTo: 'body',
          children: `__APP_INFO__ = ${appInfoText}`
        });
      return els;
    }
  };
};
function formatDate (date) {
  function pad(value) {
      return (value < 10 ? '0':'') + value
  }
  let year = date.getFullYear();
  let month = pad(date.getMonth() + 1);
  let day = pad(date.getDate());
  let hour = pad(date.getHours());
  let minutes = pad(date.getMinutes());
  let seconds = pad(date.getSeconds());
  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds
}