declare var startApp;
import { Component } from '@angular/core';
import {
	IonicPage, NavController, NavParams,
	AlertController, ToastController, Platform
} from 'ionic-angular';
import { WalletProvider } from "../../providers/wallet";
import { Storage } from "@ionic/storage";
import { Md5 } from "ts-md5/dist/md5";
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { AppAvailability } from '@ionic-native/app-availability';

const NodeRSA = require('node-rsa');
/**
 * Generated class for the PayforzojunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-payforzojun',
	templateUrl: 'payforzojun.html',
})
export class PayforzojunPage {
	pwd: any = ""; //密码 string;
	value: any; //余额
	amount: any; //支付数量
	toAddr: string; //接收方地址
	user: any;
	b_public_key_data: any = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZDDgxi/8JsgWSOqAhTJtqz27bdFQgzdYN37rqkmuZJYKbLp/C7vT6x1IwC8N4sFNb8Eq1NZRWOpVQWkazIi/DndubJb12ahc6QIUI7fWcJfjAUAuCrCLgAlte69S0mTEx8RLZo3ZnUwS9VyKGLzNGAqrseaJYqRp7bcc/e2VkewIDAQAB-----END PUBLIC KEY-----';
	b_private_key_data: any = '-----BEGIN PRIVATE KEY-----MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJkMODGL/wmyBZI6oCFMm2rPbtt0VCDN1g3fuuqSa5klgpsun8Lu9PrHUjALw3iwU1vwSrU1lFY6lVBaRrMiL8Od25slvXZqFzpAhQjt9Zwl+MBQC4KsIuACW17r1LSZMTHxEtmjdmdTBL1XIoYvM0YCqux5olipGnttxz97ZWR7AgMBAAECgYAaQD9POE0Jc7CC8W1P6NzriCLin2RisAucG5jq7Sxpe0aYqXmbrPL2JMQTG6FujQfvSBr4U/VaiPfdbW6dASsh5UaZw5YvdWeVGbjvWZPQfQJ57YyvypI2YnG4lULLvkVYEmzXPQp0EemXO1nm/dvcbqnj5RC6QexliKgMRD0jgQJBANeDSr2hdv4fnfhmdunJ0Uhe7kw4SS5Y+M1ccNNyuB+rcMQR8uuFPPja3OxfhJAvxRgZ6KoKVZau9cB3vyMsvjsCQQC1zMc8aFtv5/nl07YZ3ugcdRCelOhjWSa1RzDMz4z+3GanwZM1tLLTvNrz4Sx8oO6bCHkwHh6RXnCKrmDu3E7BAkAbvba9Oi+K/p7i/q2H4oah/jZGcWhaIvHD3YZYcYfp67OUSYsvbfMvRVzywEjcFooUVCFy4emqf9L6d2+PI49JAkEAp4IcXXOGNJEYt4OfuSyiz32pp4Rqrwd42/TRaRUfw8COManxmr15PBE56RYjqF2cHGrtRsGpxqWuqolLtSp2wQJAIqeq5pHT3nZcih0nhk6b8suk6uqsOXjAGIRvFKxq1TA8M2dAEkJeDVxiOPduviz/Usbp/KhQVAL7cq1rSYoDnQ==-----END PRIVATE KEY-----';

	a_public_key_data: any = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2/fxN1X/ArB/EDDU2eu2bwH4f8ly7x4vXb7eQYqEPRKGZrj5zXoX0LUO+N8NS520X9kehW6GzlWEJDQf/5W+X391YZArKgycDyHyWqb4LNeP6H8eRWyOZqOT2eZIuh7rqYMSIWSHFzs0IKy/xeNqvTM66Nb+YOSiEO42NMRxGPQIDAQAB-----END PUBLIC KEY-----';
	a_private_key_data: any = '-----BEGIN PRIVATE KEY-----MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALb9/E3Vf8CsH8QMNTZ67ZvAfh/yXLvHi9dvt5BioQ9EoZmuPnNehfQtQ743w1LnbRf2R6FbobOVYQkNB//lb5ff3VhkCsqDJwPIfJapvgs14/ofx5FbI5mo5PZ5ki6HuupgxIhZIcXOzQgrL/F42q9Mzro1v5g5KIQ7jY0xHEY9AgMBAAECgYBEUzUfgrX+pMX/l2dO/js1ynvNRdsmKe2m9QmfGZR1dPS5wvuCbCqr7zK6FWwSymJLbiN0thf8S6w9iuYPwAUYGFXQQDuge8XyjpIKyeuOv1um9SBvxaS66KlmShGSX+yxj//KtepNL4lokwSlw9sT5jlCWdsCaS6vS6UDvM3HKQJBANone/wfAvkDZiKdsqcwwgchcu3ZOwa8Yncht2CTUZxFUy//rObHEq9mY+uQCU6rEUbymhiOXQREs5vIMF95VU8CQQDWvOf0jLdUgeo5CnXTqJWLTPnj1GHxAswtOBLkRQPdIu1IpkfKxEob4Ss+NcDdc07AMXIfcBU6cbFXBDPaOGCzAkEAqA9y/LAHYj60GEbUsuhlEYk7OPD5AB9w28Ylt0jGvlTJ2VhmowMJ6gY/Q+IayXgQP0/2VqSWFAu5MnHukh6vEQJAMvX30jiG1X5TWKAb4FQ00S8+aowfhjPUwrJ5AUVDqno8d65GgV9d+wnP2l6lW6ieusvBOqa90vXiUTVFHPeeMwJAAPEsulihaWlNZBG2yDNXvs2VvASJcUUsAkOPxLM64fNf59DnXBfit7Z+q3TUXDp3tUff/4ufxerdQjSfYd83aQ==-----END PRIVATE KEY-----';
	parameter: any;//存在本地的中君的请求参数 解密的
	checkorderdetails: any = {};//订单校验返回的收款地址 截止时间 appName
	notifyOrderPay: string = '';//回调通知的接口名称
	info: any = {
		MicroChain: "0xac7c54e2b6bae6768bbc90afc51b022e9200a4dc",
		ScsCount: 8,
		balance: 5000000000000,
		blockReward: 469639600302410,
		dapp_base_address: "0x7eb9624edd7171e154cda4516742be3987a5d459",
		describe: "区块链上的新能源汽车子链",
		erc20_address: "0x383811667cE9646E8bCE8aff8Ca049751dbeC64B",
		erc20_symbol: "CKT",
		icon: "http://trusting.halobtc.com/90b6fd38-3499-4af2-9c87-039bec9727b9.png",
		id: 1,
		is_token: 1,
		main_account: "",
		monitor_ip: "47.110.129.12:50068",
		name: "卡巴子链",
		proportion: "1:1",
		rpc: "",
		sender: "0x19dcff83384184a779a7abb2a9b4645af3e6e646",
		subchain_address: "0xac7c54e2b6bae6768bbc90afc51b022e9200a4dc",
		token_icon: "http://trusting.halobtc.com/90b6fd38-3499-4af2-9c87-039bec9727b9.png",
		txReward: 93927920435,
		updatedAt: 1560138262967,
		viaReward: 9392792006040992,
		vnode_ip: "",
		vnode_protocol_address: "",
	};
	constructor(public navCtrl: NavController,
		private storage: Storage,
		private http: HttpClient,
		public walletProvider: WalletProvider,
		private toastCtrl: ToastController,
		private platform: Platform,
		public appAvailability: AppAvailability,
		public alertCtrl: AlertController,
		public navParams: NavParams) {
		this.storage.get("user").then(user => {
			this.user = user;
		});
		this.getSubChainBalance();
		this.storage.get("parameter").then(parameter => {
			parameter = "cYYIrImC9vEElGBkeziaM4yIJnaRHPtal3fJ6Q8KWGr6TXQstgYiej8VTf6BRMBQa5HXB2ZOZREotHpCgoIhp3SQFGGHctLwANvQRe/SOhgfAtr03vE0hUr2E3w1pwlQAFxkoAQXms5FUpMT8lgXTWBKhpfrp0D6IaMhrDaAl9wGVy8WcwiBszIITG2/rgteD6z+CGusoSFEnj+ZcYBMykQp3LaC67tmZdIwq5EJEhKimWDZN/h5da6EQSnGCk3iY9dTchf62KaZaD5AIlfgPCcpLH9ABFlm1LkyFoh6Pf/ZARMZPeAbQhPAlXxEyX+3A3QJvhBtzbzgd5UdoPwhgHXTdXqY/zYsC67VEKdJTASs6XP1N38pMX3qEiGpT51NvCW3CxPHEFb5v/Y4gXIpWhek3OIi1notVP6XdgKHemEfmgsNnWB1TJakoMAPw9OFebiGOoODXr+Tye8v7qKnpVv/05EaY0wp2Z7ZwZv0tEjboiIJZsih+9LWyxu19435Hd8BPp9RcY3oEKs/hmQ/Zdb4Awyn3dIUTBq5SloDAUyaBlpNTI0jlweE7H7uFwxP10icNuOfvIY182yPyhbigDv6qNlObT0L6xPCc3+/7riKYoBmLeb4DApF3/8yus061NFw6NKKUaU6GxmTg3nIhNEiYoI+BypTmc+XgzQBS1o=";

			if (parameter) {

				// 生成 A 的公私钥对象 zo
				const a_public_key = new NodeRSA(this.a_public_key_data);
				a_public_key.setOptions({ encryptionScheme: 'pkcs1' });
				const a_private_key = new NodeRSA(this.a_private_key_data);
				a_private_key.setOptions({ encryptionScheme: 'pkcs1' });

				// 生成 B 的公私钥对象 wo
				const b_public_key = new NodeRSA(this.b_public_key_data);
				b_public_key.setOptions({ encryptionScheme: 'pkcs1' });
				const b_private_key = new NodeRSA(this.b_private_key_data);
				b_private_key.setOptions({ encryptionScheme: 'pkcs1' });

				// // 加签并加密
				// const sign = a_private_key.sign(text, 'base64', 'utf8');
				// console.log('A 私钥加签:', sign);

				// const encrypted = b_public_key.encrypt(text, 'base64');
				// console.log('B 公钥加密:', encrypted);

				// 解密并验签
				const decrypted = b_private_key.decrypt(parameter, 'utf8');
				console.log('你的 私钥解密:', decrypted);

				// const verify = a_public_key.verify(decrypted, "HXD8OQEHzCwSKHOz0nSSvdOGUSrmyAfHFRmqp8V2+O46JmcQ1yqOavITGnJSVUfuHoOBrIurkzFviqQpMrdr0BR30WorlC608cDYMZWsnHp2EMrNEytAebJ4KK/Du8Ebba0TGzs7aDTfrxF2T1hp2/9DaSuQfp+IOV7tG4xEff8=", 'utf8', 'base64');
				// const verify = a_public_key.verify(decrypted, "Hliaaq1moSvCeDGQteRX0nfSdiZ5WP3g9/OYYPiyi1qXymhxNwIWaOMqeeX3e7RT PsZB2a9ihITc1pGo6s4cI4XYavKUYa6r/ZKDNJ2S6WkObiC854afh8TRoJOcYBSiVoWU7iPwnEv LYS2gbwlKd1kIlMuT072Yq15LyG3vqQQ=", 'utf8', 'base64');
				// console.log('你的 公钥验签:', verify);
				this.parameter = JSON.parse(decrypted);//先做解密 再赋值
				this.amount = this.parameter.orderAmount;
				this.checkOrder();
			}
		});

	}

	next() {
		let prompt = this.alertCtrl.create({
			title: "请输入密码",
			inputs: [
				{
					type: 'password',
					name: 'password',
					placeholder: "请输入密码",
				},
			],
			buttons: [
				{
					text: "取消",
					handler: data => {
					}
				},
				{
					text: "确定",
					handler: data => {
						this.pwd = data.password;
						this.Send();
					}
				}
			]
		});
		prompt.present();
	}
	async Send() {
		let secret = AppConfig.secretDec('moac', this.user.pwd, this.user.secret);
		if (Md5.hashStr(this.pwd) == this.user.pwd) {
			// if (this.value < this.amount) {
			// 	alert('可用余额不足');
			// 	return
			// }
			if (!this.toAddr) {
				alert('参数解析错误 请稍后再试');
				return
			}
			// let res = await this.walletProvider.SubChainSend(
			// 	secret,
			// 	this.toAddr,
			// 	this.amount,
			// 	this.info.MicroChain,
			// 	"http://" + this.info.monitor_ip + "/rpc"
			// );
			let res = true;
			console.log(res);
			if (res) {
				this.amount = "";
				this.toAddr = "";
				this.pwd = "";
				//像墨客数据库提交订单信息
				// this.http
				// 	.post("墨客存储订单信息接口", {})
				// 	.subscribe(
				// 		data => {
				// 			let res = JSON.stringify(data);
				// 			let res1 = JSON.parse(res);

				// 			return res1;
				// 		}
				// 	);
				this.presentToast("交易请求已经提交给区块链网络，请等待正式生效。");
				//获取回调地址
				this.checkOrderPay();
				//异步回调

				//同步回调
				// this.turnApp();


			} else {
				this.errorMsg("提交失败 请稍后再试");
			}
		} else {
			this.pwd = '';
			this.errorMsg("密码输入错误");
		}
	}
	checkOrder() {
		let timestamp = new Date();
		// 生成 A 的公私钥对象 zo
		const a_public_key = new NodeRSA(this.a_public_key_data);
		a_public_key.setOptions({ encryptionScheme: 'pkcs1' });
		const a_private_key = new NodeRSA(this.a_private_key_data);
		a_private_key.setOptions({ encryptionScheme: 'pkcs1' });

		// 生成 B 的公私钥对象 wo
		const b_public_key = new NodeRSA(this.b_public_key_data);
		b_public_key.setOptions({ encryptionScheme: 'pkcs1' });
		const b_private_key = new NodeRSA(this.b_private_key_data);
		b_private_key.setOptions({ encryptionScheme: 'pkcs1' });
		let p = {
			status: 0,
			orderNo: this.parameter.orderNo,
			orderAmount: this.parameter.orderAmount,
			currency: this.parameter.currency,
		}
		const encrypted = a_public_key.encrypt(p, 'base64');

		let data = {
			secret: encrypted,
			timestamp: this.datetolong(timestamp.valueOf()),
		}
		this.http
			.post("/zojunapi/checkOrder", this.transformRequest(data), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				}
			})
			.subscribe(
				data => {
					let res = JSON.stringify(data);
					let res1 = JSON.parse(res);
					if (res1.code == 0) {
						let result = b_private_key.decrypt(res1.data.secret, 'utf8')
						this.checkorderdetails = JSON.parse(result);
						console.log(this.checkorderdetails)
						this.toAddr = this.checkorderdetails.tokenAddress;
					}
				}
			);
	}
	checkOrderPay() {
		let timestamp = new Date();
		// 生成 A 的公私钥对象 zo
		const a_public_key = new NodeRSA(this.a_public_key_data);
		a_public_key.setOptions({ encryptionScheme: 'pkcs1' });
		const a_private_key = new NodeRSA(this.a_private_key_data);
		a_private_key.setOptions({ encryptionScheme: 'pkcs1' });

		// 生成 B 的公私钥对象 wo
		const b_public_key = new NodeRSA(this.b_public_key_data);
		b_public_key.setOptions({ encryptionScheme: 'pkcs1' });
		const b_private_key = new NodeRSA(this.b_private_key_data);
		b_private_key.setOptions({ encryptionScheme: 'pkcs1' });

		let p = {
			status: 0,
			orderNo: this.parameter.orderNo,
			orderAmount: this.parameter.orderAmount,
			currency: this.parameter.currency,
			tokenAddress: this.toAddr,
			usertokenAddress: this.user.address,
		}
		const encrypted = a_public_key.encrypt(p, 'base64');

		let data = {
			secret: encrypted,
			timestamp: this.datetolong(timestamp.valueOf()),
		}
		this.http
			.post("/zojunapi/checkOrderPay", this.transformRequest(data), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				}
			})
			.subscribe(
				data => {
					let res = JSON.stringify(data);
					let res1 = JSON.parse(res);
					if (res1.code == 0) {
						let result = b_private_key.decrypt(res1.data.secret, 'utf8')
						let url: any = JSON.parse(result).notify_url;
						this.notifyOrderPay = url.substring(url.lastIndexOf('/'))
						console.log('notifyOrderPay', this.notifyOrderPay);

						let hash = 'teststststststhash';
						this.postNotifyOrderPay(hash);
					}
				}
			);

	}

	postNotifyOrderPay(hash) {//回调通知
		let timestamp = new Date();
		// 生成 A 的公私钥对象 zo
		const a_public_key = new NodeRSA(this.a_public_key_data);
		a_public_key.setOptions({ encryptionScheme: 'pkcs1' });
		const a_private_key = new NodeRSA(this.a_private_key_data);
		a_private_key.setOptions({ encryptionScheme: 'pkcs1' });

		// 生成 B 的公私钥对象 wo
		const b_public_key = new NodeRSA(this.b_public_key_data);
		b_public_key.setOptions({ encryptionScheme: 'pkcs1' });
		const b_private_key = new NodeRSA(this.b_private_key_data);
		b_private_key.setOptions({ encryptionScheme: 'pkcs1' });

		let p = {
			status: 1,
			orderNo: this.parameter.orderNo,
			tradeHash: hash,
			hashContent: [],

		}
		const encrypted = a_public_key.encrypt(p, 'base64');

		let data = {
			secret: encrypted,
			timestamp: this.datetolong(timestamp.valueOf()),
		}
		this.http
			.post("/zojunapi" + this.notifyOrderPay, this.transformRequest(data), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				}
			})
			.subscribe(
				data => {
					let res = JSON.stringify(data);
					let res1 = JSON.parse(res);
					if (res1.code == 0) {
						

						console.log('result', '回调成功');
					}
				}
			);

	}
	datetolong(lo) {
		let date = new Date(lo)
		let y = date.getFullYear();
		let m: any = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d: any = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h: any = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let minute: any = date.getMinutes();
		let second: any = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + m + d + h + minute + second;
	}
	longtodate() { }
	transformRequest(data) {
		//格式化表单提交参数
		let ret = "";
		for (let it in data) {
			ret +=
				encodeURIComponent(
					it
				) +
				"=" +
				encodeURIComponent(
					data[it]
				) +
				"&";
		}
		return ret;
	}
	turnApp() {
		var app = '';
		// console.log('this.platform', this.platform)
		if (this.platform.is('ios')) {
			app = 'wallet.zojun://';      /* Scheme URL */
		} else if (this.platform.is('android')) {
			app = 'io.moac.mobao';     /* 安卓包名 */
		}
		try {
			this.appAvailability.check(app)     /* 检测是否已安装 */
				.then(
					(yes: boolean) => {
						console.log(1)
						// cordova.InAppBrowser.create(app, '_system');    /* 打开QQ */
						/*若是想要打开其他APP,则使用this.iab.create('Scheme URL','_system')*/
						let mobaoApp = startApp.set({
							"action": "ACTION_VIEW",
							"category": "CATEGORY_DEFAULT",
							"type": "text/css",
							"package": "io.moac.mobao",
							"uri": "wallet.zojun://to=dsfsafd&currency=cnt",
							"flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
							"intentstart": "startActivity",
						}, {
								"EXTRA_STREAM": "extraValue1",
								"extraKey2": "extraValue2"
							});
						mobaoApp.start(function () {
							console.log("sApp.start succeed");
						}, function (error) {
							alert("error---" + error);
						});
					},
					(no: boolean) => {
						alert("没有安装相应的app");
					}).catch(err => {
						console.log('err', err)
					});
		} catch (error) {
			console.log(error);
			cordova.InAppBrowser.create(app, '_system');
		}

	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad PayforzojunPage');
	}
	ionViewDidEnter() {
		//进入隐藏TabBars
		let elements = document.querySelectorAll(".tabbar");
		if (elements != null) {
			Object.keys(elements).map((key) => {
				elements[key].style.display = 'none';
			});
		}
	}
	errorMsg(msg) {
		//错误提示
		let prompt = this.alertCtrl.create({
			title: "提示",
			message: msg,
			buttons: [
				{
					text: "OK",
					handler: data => { }
				}
			]
		});
		prompt.present();
	}
	presentToast(msg) {
		//自动消失弹框
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 1000,
			position: "top",
			cssClass: "toast"
		});

		toast.onDidDismiss(() => {
			//   console.log('Dismissed toast');
		});

		toast.present();
	}
	//子链余额
	async getSubChainBalance() {
		this.user = await this.storage.get("user");
		let balance = await this.walletProvider.getSubChainBalance(
			this.user.address,
			this.info.subchain_address,
			"http://" + this.info.monitor_ip + "/rpc"
		);
		this.value = balance.result / 1000000000000000000;
	}
}
