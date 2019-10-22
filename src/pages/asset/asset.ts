import { Component, ViewChild, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Slides,
  AlertController,
  ToastController,
  LoadingController,
} from "ionic-angular";
import { WalletProvider } from "../../providers/wallet";
import { Storage } from "@ionic/storage";
import { MenuController } from "ionic-angular";
import { BaseUI } from "../common/baseui";
import { TranslateService } from "@ngx-translate/core";
import { takeUntil } from "rxjs/operator/takeUntil";
import VConsole from "vconsole";
// var vConsole = new VConsole();

import Chain3 from "chain3";
import { abi, bytecode } from "../../tokens/20/contract.js";

import { domain, api, rpcUrl } from "../../../config.js";

import { HttpClient, HttpParams } from "@angular/common/http";

/**
 * Generated class for the AssetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-asset",
  templateUrl: "asset.html",
})
export class AssetPage extends BaseUI {
  @ViewChild(Slides) slides: Slides;
  tabs: string = "pass";
  pockets: any = [];
  user: any = {};
  ERC20: any = [];
  ERC721: any = [];
  tokens: any = []; //通证余额
  publicPem: any =
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZMESj2X2x9X4TvW3s0e+TYqsz69P0hNqnJuJX/hsnZjlO/A41cUyzw/4oVBkFNThC7X06NiiciHvHB+f8VowynReNFeGxB13ULLGb2mRVerk/enPJ1iJWLMKrvPOq0nuErhnovdyEmhqrITDPmNb/TADQHACCVi/l7h635SSpIwIDAQAB";
  privte: any =
    "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJkwRKPZfbH1fhO9bezR75NiqzPr0/SE2qcm4lf+GydmOU78DjVxTLPD/ihUGQU1OELtfTo2KJyIe8cH5/xWjDKdF40V4bEHXdQssZvaZFV6uT96c8nWIlYswqu886rSe4SuGei93ISaGqshMM+Y1v9MANAcAIJWL+XuHrflJKkjAgMBAAECgYEAkajf25y2dDymAUch+wkz8MTlXZ1kESEyd7X1iw3H7BK7c2sgZ5iwAk7eoKI2mEkekiUX6f4NZ6ovZ/UQlVQGQa7MP2byrEMssE8swmjXL5XOsIRCDYt1JV+B8568vGa2W5n+nGy7ljE0X8cw8m6CcaqM+po2mqQmwEnm6zP8YSECQQDfv6l45b7CcfpkAruFwtthVF71zQtoFkWU/apATXqcGSa2sn70YwsBpzuB8sRzhLkISGrXa423A+QDGEUAr+4lAkEAr0Tu/NvKnD0xb02S3J5aYXDQViuGyJyAgtZlFKnjn5bkUOsgDsDclLXRnC7WQJALBY/q+0FxVQor4jh/TahjpwJAZbc6ssQ2uSyZeJepagCQPKnfVXy2X8YoMbgzinHueEIS0GFKx4yy9zhwG/4iAqXme/Z346B4VyfEoweIbuyLpQJAIseuGRVQfnKSNcESDJ+L1dw6K29Vvsd3pP8AbfpMhiW+RuRxpxvUadouryyILaWn2kG14ogZAkQTcz+821837wJBAKON+bp5atHRzJdQn5od3WUrrz52OKiz4wwEB6eH1XLe3K82Om3eNMLaGbv/Ll2O5UmRzvAz8DXotMtTL5Hsz0E=";
  subChainInfo: any = {
    MicroChain: "0xac7c54e2b6bae6768bbc90afc51b022e9200a4dc",
    ScsCount: 8,
    balance: 5000000000000,
    blockReward: 469639600302410,
    dapp_base_address: "0x7eb9624edd7171e154cda4516742be3987a5d459",
    erc20_address: "0x383811667cE9646E8bCE8aff8Ca049751dbeC64B",
    erc20_symbol: "CKT",
    subchain_address: "0xac7c54e2b6bae6768bbc90afc51b022e9200a4dc",
    icon: "http://trusting.halobtc.com/90b6fd38-3499-4af2-9c87-039bec9727b9.png",
    is_token: 1,
    monitor_ip: "47.110.129.12:50068",
    name: "卡巴子链",
    proportion: "1:1",
    rpc: "",
    sender: "0x19dcff83384184a779a7abb2a9b4645af3e6e646",
    txReward: 93927920435,
    viaReward: 9392792006040992,
    vnode_ip: "",
    vnode_protocol_address: "",
    describe: "区块链上的新能源汽车子链",
    id: 1,
    main_account: "",
    token_icon: "http://trusting.halobtc.com/90b6fd38-3499-4af2-9c87-039bec9727b9.png",
    updatedAt: 1560138262967,
  };
  balance: any = ""; //子链余额
  Tokens: any; //storage里面的token
  Token721: any; //storage里面的token721
  Token20: any; //storage里面的token20
  collections: any = []; //收藏品余额

  public chain3: Chain3;
  public getContractInfoApi: string = domain + api.getInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private zone: NgZone,
    public menuCtrl: MenuController,
    public walletProvider: WalletProvider,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    private httpClient: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    super();

    this.chain3 = new Chain3(new Chain3.providers.HttpProvider(rpcUrl));

    setTimeout(() => {
      this.getPockets(); //获取所有钱包
    }, 1000);
    // const key = new NodeRSA({ b: 1024 });
    // const pkcsType = 'pkcs1';
    // key.setOptions({ encryptionScheme: pkcsType });
    // const publicPem = key.exportKey(pkcsType + '-public-pem');//制定输出格式
    // const privatePem = key.exportKey(pkcsType + '-private-pem');
    // console.log(pkcsType + '公钥:\n', publicPem);
    // console.log(pkcsType + '私钥:\n', privatePem);
  }

  ionViewDidLoad() {
    //   // console.log('ionViewDidLoad AssetPage');
    //     this.getPockets();//获取所有钱包
  }
  ionViewWillEnter() {
    if (this.tokens.length > 0 || this.collections.length > 0) {
      this.onlyGetPockets(); //时时更新钱包
      this.getPockets(); //获取所有钱包
      this.onlyGetTokens(); //时时更新资产
    }
  }
  onlyGetPockets() {
    this.storage.get("pockets").then(p => {
      if (p) {
        if (p.length != this.pockets.length) {
          this.pockets = p;
        }
        // this.user = p[0];
        // this.storage.set('user',this.user);
      }
    });
  }
  async onlyGetTokens() {
    let that = this;
    if (await this.storage.get("tokens")) {
      that.Tokens = await that.storage.get("tokens");
      that.Token721 = that.Tokens.ERC721;
      that.Token20 = that.Tokens.ERC20;
      that.ERC721 = [];
      that.ERC20 = [];
      for (let key in that.Tokens.ERC721) {
        if (that.Tokens.ERC721[key].flag == true) {
          that.ERC721.push(that.Tokens.ERC721[key].symbol);
        }
      }
      for (let key in that.Tokens.ERC20) {
        if (that.Tokens.ERC20[key].flag == true) {
          that.ERC20.push(that.Tokens.ERC20[key].symbol);
        }
      }
    } else {
      that.ERC721 = ["NFT"];
      that.ERC20 = [];
    }
    that.getMoacAndTokenBalances();
    that.getCollectionBalances();
  }
  async getPockets() {
    let that = this;
    if (await that.storage.get("pockets")) {
      that.pockets = await that.storage.get("pockets");
      that.user = that.pockets[0];
      that.storage.set("user", that.user);
      // this.getCollectionBalances();//页面出来 点击再条用
    }
    if (await that.storage.get("tokens")) {
      that.Tokens = await that.storage.get("tokens");
      that.Token721 = that.Tokens.ERC721;
      that.Token20 = that.Tokens.ERC20;
      that.ERC721 = [];
      that.ERC20 = [];
      for (let key in that.Tokens.ERC721) {
        if (that.Tokens.ERC721[key].flag == true) {
          that.ERC721.push(that.Tokens.ERC721[key].symbol);
        }
      }
      for (let key in that.Tokens.ERC20) {
        if (that.Tokens.ERC20[key].flag == true) {
          that.ERC20.push(that.Tokens.ERC20[key].symbol);
        }
      }
    } else {
      that.ERC721 = ["NFT"];
      that.ERC20 = [];
    }
    that.getMoacAndTokenBalances();
  }
  async getMoacAndTokenBalances() {
    //获得MOAC和ERC20代币的余额  --moac放在第一个
    let that = this;
    let balances: any;
    try {
      balances =
        (await that.walletProvider.getMoacAndTokenBalances(that.user.address, that.ERC20)) || [];
      for (let key in balances) {
        for (let item in that.Token20) {
          if (balances[key].code == that.Token20[item].symbol) {
            balances[key].icon = that.Token20[item].icon;
          }
        }
      }
      that.zone.run(() => {
        that.tokens = balances;
      });
    } catch (e) {
      that.tokens = [];
    }
    // this.tokens = await this.walletProvider.getMoacAndTokenBalances(this.user.address,this.ERC20) || [];
  }
  async getCollectionBalances() {
    //获得ERC721收藏品的余额
    let that = this;
    let balances: any;
    try {
      balances =
        (await that.walletProvider.getCollectionBalances(that.user.address, that.ERC721)) || [];
      for (let key in balances) {
        for (let item in that.Token721) {
          if (balances[key].code == that.Token721[item].symbol) {
            balances[key].icon = that.Token721[item].icon;
          }
        }
      }
      that.zone.run(() => {
        that.collections = balances;
      });
    } catch (e) {
      that.collections = [];
    }
    // this.collections = await this.walletProvider.getCollectionBalances(this.user.address,this.ERC721) || [];
  }
  slideChanged() {
    //切换钱包
    let currentIndex: number = this.slides.getActiveIndex();
    if (currentIndex == this.pockets.length) {
      currentIndex = this.pockets.length - 1;
    }
    this.user = this.pockets[currentIndex];
    this.storage.set("user", this.user);
    this.tabs = "pass";
    this.getMoacAndTokenBalances();
  }
  toTokenDetails(item) {
    //去通证详情
    // if(item.value == 0){
    //     this.errorMsg('暂无余额');
    // }else{
    this.navCtrl.push("TokendetailsPage", {
      item: item,
    });
    // }
  }
  toCollectionDetails(item) {
    //去收藏品详情
    // if(item.value == 0){
    //     this.errorMsg('暂无余额');
    // }else{
    this.navCtrl.push("CollectionlistPage", {
      item: item,
      user: this.user,
    });
    // }
  }
  jump(item) {
    if (item != "") {
      this.navCtrl.push(item);
    } else {
      //err
    }
  }
  openMenu() {
    this.menuCtrl.open();
  }
  errorMsg(msg) {
    //错误提示
    let prompt = this.alertCtrl.create({
      title: "提示",
      message: msg,
      buttons: [
        {
          text: "OK",
          handler: data => {},
        },
      ],
    });
    prompt.present();
  }
  doRefresh(refresher) {
    // refresher.complete();
    setTimeout(() => {
      this.onlyGetTokens(); //刷新通证资产
      refresher.complete();
    }, 1000);
  }
  doRefresh1(refresher) {
    // refresher.complete();
    setTimeout(() => {
      this.onlyGetTokens(); //刷新收藏品资产
      refresher.complete();
    }, 1000);
  }
  ionViewDidEnter() {
    //进入显示TabBars

    // this.getPockets();//获取所有钱包
    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map(key => {
        elements[key].style.display = "flex";
      });
    }
  }

  toTrade(val) {
    //去往子链详情 充币提币页面
    this.navCtrl.push("TradePage", {
      info: this.subChainInfo,
      value: val,
    });
  }
  getResult(msg) {
    return super.getI18n(msg, this.translate);
  }

  addErc20() {
    const alert = this.alertCtrl.create({
      title: "新增Token",
      subTitle: "请输入ERC20合约地址。",
      inputs: [
        {
          name: "address",
          placeholder: "0x1234abcd......",
        },
      ],
      buttons: [
        {
          text: "取消",
          role: "cancel",
          handler: data => {},
        },
        {
          text: "添加",
          handler: (data: { address: string }) => {
            this.addErc20Handle(data.address);
          },
        },
      ],
    });
    alert.present();
  }

  addErc20Handle(address: string) {
    if (!this.checkAddress(address)) {
      this.showAlert("输入错误", "合约地址无效，请检查后重新输入。");
      return;
    }

    this.getContractInfo(address);
  }

  checkAddress(address: string) {
    const code = this.chain3.mc.getCode(address);
    if (code !== "0x") {
      return true;
    }
    return false;
  }

  async getContractInfo(contractAddress: string) {
    const loading = this.showLoading(this.loadingCtrl, "正在获取合约信息......");

    const params = new HttpParams().set("contractadd", contractAddress);
    this.httpClient.get(this.getContractInfoApi, { params }).subscribe(
      async (data: {
        contractaddress: string;
        symbol: string;
        name: string;
        owner: {
          address: string;
          privatekey: string;
        };
        supply: number;
        decimals: number;
        rate: number;
        abi: {}[];
        logo: string;
      }) => {
        const { symbol, name, supply, decimals, logo } = data;
        const owner = data.owner.address;

        await this.storeContractInfo(owner, contractAddress, logo, {
          symbol,
          name,
          supply,
          decimals,
        });
        loading.dismiss();
        this.onlyGetTokens(); //刷新通证资产
        this.showToast(this.toastCtrl, "添加成功");
      },
      err => {
        console.log(err);
        loading.dismiss();
        this.showAlert("数据获取错误", "无法获取合约数据，请检查合约地址是否正确。");
      },
    );
  }

  async storeContractInfo(
    owner: string,
    contractAddress: string,
    logoUrl: string,
    params: { symbol: string; name: string; supply: number; decimals: number },
  ) {
    const { symbol, name, supply, decimals } = params;
    const value = {
      ...params,
      owner: { address: owner },
      contractAddress,
    };

    let erc20: {
      owner: { address: string };
      contractAddress: string;
      symbol: string;
      name: string;
      supply: number;
      decimals: number;
    }[] = await this.storage.get("erc20");

    if (!erc20) {
      erc20 = [value];
    } else {
      erc20.push(value);
    }
    this.storage.set("erc20", erc20);

    let tokens: {
      ERC20: {
        [symbol: string]: {
          flag: boolean;
          symbol: string;
          icon: string;
          address: string;
          decimals: number;
        };
      };
      ERC721: {
        [symbol: string]: {
          flag: boolean;
          symbol: string;
          icon: string;
          address: string;
          decimals: number;
        };
      };
      ERC20_ABI: {}[];
      ERC721_ABI: {}[];
    } = await this.storage.get("tokens");

    if (!tokens) {
      tokens = {
        ERC20: {
          [symbol]: {
            flag: true,
            symbol,
            icon: logoUrl,
            address: contractAddress,
            decimals,
          },
        },
        ERC721: null,
        ERC20_ABI: abi,
        ERC721_ABI: [],
      };
      this.storage.set("tokens", tokens);
      return;
    }

    let { ERC20, ERC721, ERC20_ABI, ERC721_ABI } = tokens;

    if (Object.keys(ERC20).length === 0) {
      ERC20 = {
        [symbol]: {
          flag: true,
          symbol,
          icon: logoUrl,
          address: contractAddress,
          decimals,
        },
      };
    } else {
      ERC20 = {
        ...ERC20,
        [symbol]: {
          flag: true,
          symbol,
          icon: logoUrl,
          address: contractAddress,
          decimals,
        },
      };
    }

    if (ERC20_ABI.length === 0) {
      ERC20_ABI = [...abi];
    }

    this.storage.set("tokens", { ERC20, ERC721, ERC20_ABI, ERC721_ABI });
  }

  // 显示弹窗
  private showAlert(title: string, subTitle: string) {
    const alert = this.alertCtrl.create({
      title,
      subTitle,
      buttons: [
        {
          text: "确定",
          handler: data => {},
        },
      ],
    });
    alert.present();
  }
}
