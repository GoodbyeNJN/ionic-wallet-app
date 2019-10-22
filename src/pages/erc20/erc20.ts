import { BaseUI } from "../common/baseui";
import { Storage } from "@ionic/storage";
import { Component } from "@angular/core";
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
} from "ionic-angular";
import { FormBuilder, Validators, FormGroup, AbstractControl } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Crop } from "@ionic-native/crop";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
  FileUploadResult,
} from "@ionic-native/file-transfer";

import Chain3 from "chain3";
import { abi, bytecode } from "../../tokens/20/contract.js";

import { domain, api, rpcUrl } from "../../../config.js";

import { Md5 } from "ts-md5/dist/md5";
import { AppConfig } from "../../app/app.config";

/**
 * Generated class for the Erc20Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-erc20",
  templateUrl: "erc20.html",
})
export class Erc20Page extends BaseUI {
  public formGroup: FormGroup;
  public formData: {
    symbol: AbstractControl;
    name: AbstractControl;
    supply: AbstractControl;
    decimals: AbstractControl;
  };
  public logo: { url: string; fileUri: string; fileName: string };
  public user: { address: string; mnemonic: string; name: string; pwd: string; secret: string };

  public chain3: Chain3;

  public uploadLogoApi: string = domain + api.upload;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private crop: Crop,
    private fileTransfer: FileTransfer,
  ) {
    super();

    this.storage
      .get("user")
      .then(user => {
        this.user = user;
      })
      .catch(err => {
        console.log("getStorage: err", err);
      });

    this.chain3 = new Chain3(new Chain3.providers.HttpProvider(rpcUrl));

    this.formGroup = this.formBuilder.group({
      symbol: [
        "",
        Validators.compose([Validators.required, Validators.pattern("^[A-Z]+[A-Z0-9]$")]),
      ],
      name: [
        "",
        Validators.compose([Validators.required, Validators.pattern("^[A-Za-z]+[A-Za-z0-9]$")]),
      ],
      supply: ["", Validators.compose([Validators.required, Validators.pattern("^[1-9][0-9]*$")])],
      decimals: [
        "",
        Validators.compose([Validators.required, Validators.pattern("^[1-9][0-9]*$")]),
      ],
    });

    this.formData = {
      symbol: this.formGroup.controls["symbol"],
      name: this.formGroup.controls["name"],
      supply: this.formGroup.controls["supply"],
      decimals: this.formGroup.controls["decimals"],
    };
  }

  async uploadLogo(
    owner: string,
    contractAddress: string,
    params: { symbol: string; name: string; supply: number; decimals: number },
  ) {
    const value = {
      ...params,
      owner: { address: owner },
      contractAddress,
    };
    const options: FileUploadOptions = {
      fileKey: "file",
      fileName: this.logo.fileName,
      params: { info: JSON.stringify(value) },
    };

    const transfer: FileTransferObject = this.fileTransfer.create();
    return transfer.upload(this.logo.fileUri, this.uploadLogoApi, options);
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

  deployContract(
    address: string,
    privateKey: string,
    params: { symbol: string; name: string; supply: number; decimals: number },
  ) {
    const { symbol, name, supply, decimals } = params;

    const contract = this.chain3.mc.contract(abi);
    const data = contract.getData(symbol, name, supply, decimals, { data: "0x" + bytecode });
    const nonce = this.chain3.mc.getTransactionCount(address);
    const gasPrice = this.chain3.mc.gasPrice.toNumber();
    const gasLimit = 1500000;
    const chainId = this.chain3.version.network;

    const rawTx = {
      nonce: this.chain3.intToHex(nonce),
      gasPrice: this.chain3.intToHex(gasPrice),
      gasLimit: this.chain3.intToHex(gasLimit),
      from: address,
      data: data,
      chainId: this.chain3.intToHex(chainId),
    };

    let transactionHash: Promise<string>;
    try {
      const signedTx = this.chain3.signTransaction(rawTx, "0x" + privateKey);
      transactionHash = new Promise((resolve, reject) => {
        this.chain3.mc.sendRawTransaction(signedTx, (err: {}, hash: string) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(hash);
        });
      });
    } catch (err) {
      console.log("deployContract: err", err);
    }

    return transactionHash;
  }

  waitBlockNumber(blockInterval: number, timeout: number) {
    const blockNumber: number = this.chain3.mc.blockNumber;
    const now: number = Date.now();

    const filter = this.chain3.mc.filter("latest");
    const block = new Promise((resolve, reject) => {
      filter.watch((err: {}, hash: string) => {
        if (err) {
          return;
        }
        const currentBlockNumber: number = this.chain3.mc.blockNumber;
        const currentTime: number = Date.now();

        if (currentBlockNumber - blockNumber >= blockInterval) {
          resolve(currentBlockNumber);
          return;
        }

        if (currentTime - now >= timeout * 1000) {
          reject("Waitting timeout");
          return;
        }
      });
    });

    return block;
  }

  getContractAddress(transactionHash: string) {
    // let contractAddress: String;

    // try {
    //   const receipt = this.chain3.mc.getTransactionReceipt(transactionHash);
    //   contractAddress = receipt.contractAddress;
    // } catch (err) {
    //   console.log("getContractAddress: err", err);
    // }

    const receipt = this.chain3.mc.getTransactionReceipt(transactionHash);
    const contractAddress = receipt.contractAddress;

    return contractAddress;
  }

  checkContract(contractAddress: string) {
    let code: string;
    try {
      code = this.chain3.mc.getCode(contractAddress);
    } catch (err) {
      console.log("checkContract: err", err);
    }

    if (code === "0x") {
      return false;
    } else {
      return true;
    }
  }

  checkBalance(address: string, threshold: number) {
    const balance = this.chain3.mc.getBalance(address);
    if (balance > threshold) {
      return true;
    } else {
      return false;
    }
  }

  async chooseLogo() {
    const getOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      targetHeight: 140,
      targetWidth: 140,
    };

    try {
      const fileUri: string = await this.camera.getPicture(getOptions);
      console.log("fileUri", fileUri);

      // const croppedUri: string = await this.crop.crop(fileUri, {
      //   quality: 100,
      //   targetHeight: 140,
      //   targetWidth: 140,
      // });
      // console.log("cropped", croppedUri);

      let win: any = window; // hack compilator
      const fileUrl = win.Ionic.WebView.convertFileSrc(fileUri);
      console.log("url", fileUrl);

      const filePattern = fileUri.split("?")[0].split("/");
      const fileName = filePattern[filePattern.length - 1];
      console.log("fileName", fileName);

      this.logo = { url: fileUrl, fileUri: fileUri, fileName: fileName };
    } catch (err) {
      console.log("chooseLogo: err", err);
    }
  }

  submit(data: { symbol: string; name: string; supply: string; decimals: string }) {
    const address = this.user.address;
    const params = {
      symbol: data.symbol,
      name: data.name,
      supply: Number.parseInt(data.supply),
      decimals: Number.parseInt(data.decimals),
    };

    if (!this.checkBalance(address, 0.5)) {
      this.showAlert("余额不足", "钱包余额不足，无法部署ERC20合约，请增加余额至0.5MOAC以上。");
      return;
    }

    const alert = this.alertCtrl.create({
      title: "请输入密码",
      message: "",
      inputs: [
        {
          type: "password",
          name: "password",
          placeholder: "请输入密码",
        },
      ],
      buttons: [
        {
          text: "取消",
          handler: data => {},
        },
        {
          text: "确定",
          handler: data => {
            this.submitHandle(data, params);
          },
        },
      ],
    });
    alert.present();
  }

  async submitHandle(
    data: { password: string },
    params: { symbol: string; name: string; supply: number; decimals: number },
  ) {
    const { address, mnemonic, name, pwd, secret } = this.user;

    if (Md5.hashStr(data.password) !== pwd) {
      this.showAlert("输入错误", "密码输入错误。");
      return;
    }

    const privateKey = AppConfig.secretDec("moac", pwd, secret);
    const loading = this.showLoading(this.loadingCtrl, "正在部署ERC20合约......");

    let contractAddress: string;
    try {
      const transactionHash = await this.deployContract(address, privateKey, params);
      console.log("deploy complete: transactionHash", transactionHash);

      const blockNumber = await this.waitBlockNumber(5, 90);
      console.log("wait block number complete: blockNumber", blockNumber);

      contractAddress = this.getContractAddress(transactionHash);
      console.log("get contract address complete: contractAddress", contractAddress);
    } catch (err) {
      console.log("submitHandle: err1", err);
      loading.dismiss().catch();
      this.showAlert("部署失败", "ERC20合约部署失败，错误信息：" + err + "。");
      return;
    }

    if (!this.checkContract(contractAddress)) {
      loading.dismiss().catch();
      this.showAlert("部署失败", "ERC20合约部署失败，错误信息：合约信息查询错误。");
      return;
    }

    try {
      const res: FileUploadResult = await this.uploadLogo(address, contractAddress, params);
      const { data } = JSON.parse(res.response);
      console.log("upload logo complete: response data", data);

      await this.storeContractInfo(address, contractAddress, data.url, params);

      loading.dismiss().catch();
      this.showAlert("部署成功", "ERC20合约部署成功，合约地址为：" + contractAddress + "。");
      this.formGroup.reset();
    } catch (err) {
      console.log("submitHandle: err2", err);
      loading.dismiss().catch();
      this.showAlert("部署失败", "ERC20合约部署失败，错误信息：" + err + "。");
      return;
    }
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
