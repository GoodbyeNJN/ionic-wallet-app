declare let window: any;
import { Component, NgZone } from "@angular/core";
import { App, Platform, MenuController, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { TabsPage } from "../pages/tabs/tabs";
import { Storage } from "@ionic/storage";
import { LoginPage } from "../pages/login/login";
import { ImportPage } from "../pages/login/import/import";
import { SetpwdPage } from "../pages/login/setpwd/setpwd";
import { TranslateService } from "@ngx-translate/core";
import VConsole from "vconsole";
// var vConsole = new VConsole();

import { domain, api, upgrade } from "../../config.js";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppVersion } from "@ionic-native/app-version";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage: any;
  pockets: any = [];
  user: any = {};
  lang: string = "zh";
  parameter: string = ""; //中君传的参数

  public versionApi: string = domain + api.version;
  public upgradeUrl: string = domain + upgrade;

  constructor(
    private app: App,
    platform: Platform,
    public alertCtrl: AlertController,
    statusBar: StatusBar,
    private zone: NgZone,
    private storage: Storage,
    private menuCtrl: MenuController,
    splashScreen: SplashScreen,
    private translate: TranslateService,
    private httpClient: HttpClient,
    private appVersion: AppVersion,
    private iab: InAppBrowser,
  ) {
    // alert(2)
    this.storage.get("user").then(user => {
      //获取当前用户
      //判断打开app时 是否为中君的 url存在 存本地 跳到支付页面
      (window as any).handleOpenURL = (url: string) => {
        console.log(url);
        this.parameter = url;
      };
      if (user) {
        if (this.parameter == "") {
          this.rootPage = TabsPage;
        } else {
          this.storage.set("parameter", this.parameter);
          this.rootPage = "PayforzojunPage";
        }
      } else {
        if (this.parameter == "") {
          this.rootPage = "LoginPage";
        } else {
          let prompt = this.alertCtrl.create({
            title: "提示",
            message: "请先创建钱包再尝试支付操作",
            buttons: [
              {
                text: "返回商家",
                handler: data => {
                  //这里做返回商家处理
                },
              },
            ],
          });
          prompt.present();
          // this.rootPage = 'LoginPage';
        }
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.initTranslateConfig(); //初始化中文
      statusBar.styleDefault();
      splashScreen.hide();
    });

    document.addEventListener("deviceready", async () => {
      const localVersion = await this.appVersion.getVersionCode();
      console.log("localVersion", localVersion);
      this.httpClient.get(this.versionApi).subscribe(
        // this.httpClient.get(this.versionApi + "?" + Date.now()).subscribe(
        (data: { version: string; versionNumber: number }) => {
          const remoteVersion = data.versionNumber;
          console.log("remoteVersion", remoteVersion);
          if (remoteVersion <= localVersion) {
            return;
          }

          const alert = this.alertCtrl.create({
            title: "应用更新",
            subTitle: "检测到应用有新版本，请点击确定按钮下载并手动安装。",
            buttons: [
              {
                text: "确定",
                handler: data => {
                  const browser = this.iab.create(this.upgradeUrl + remoteVersion + ".apk");
                },
              },
            ],
          });
          alert.present();
        },
        err => {
          console.log(err);
        },
      );
    });
  }

  //语言设置
  initTranslateConfig() {
    // 参数类型为数组，数组元素为本地语言json配置文件名
    this.translate.addLangs(["zh", "en"]);
    // 从storage中获取语言设置
    this.storage.get("language").then(l => {
      if (l) {
        this.lang = l;
        // 设置默认语言
        this.translate.setDefaultLang(this.lang);
        // 检索指定的翻译语言，返回Observable
        this.translate.use(this.lang);
      } else {
        // 设置默认语言
        this.translate.setDefaultLang(this.lang);
        // 检索指定的翻译语言，返回Observable
        this.translate.use(this.lang);
      }
      // 存储到storage
      this.storage.set("language", this.lang);
    });
  }
  ionOpen() {
    this.storage.get("pockets").then(p => {
      if (p) {
        // this.pockets = p;
        this.zone.run(() => {
          this.pockets = p;
        });
      }
    });
    this.storage.get("user").then(user => {
      if (user) {
        // this.pockets = p;
        this.zone.run(() => {
          this.user = user;
        });
      }
    });
  }

  jump(item) {
    if (item != "") {
      this.app.getRootNav().push(item);
      this.menuCtrl.close();
    } else {
      //err
    }
  }
}
