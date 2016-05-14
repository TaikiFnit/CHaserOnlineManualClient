'use strict';

const http = require('http');
const readline = require('readline');

//const domain = 'www7019ug.sakura.ne.jp';
const domain = '127.0.0.1';
const path = '/CHaserOnline003';

var user = '';
var password = '';
var jsessionid ='';
var roomNumber;
var command2 = '';

var options = {
	hostname: domain,
	method: 'GET',
	port: 8080
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const log = (l) => console.log(l)

// argsのurlにgetする非同期関数
const request = (url) => {

	return new Promise( (resolve, reject) => {

		options['path'] = url;

		let req = http.request(options , (res) => {

			let body = '';
			res.on('data', (chunk) => {
				body += chunk;
			});
			res.on('end', () => {
				resolve(body);
			});
		}).on('error', (e) => {
			reject(new Error(e.message));
		}).end();
	});
};

// CLIから値を読み込む非同期関数
const prompt = (str) => {

	return new Promise( (resolve, reject) => {

		rl.question(str, (ans) => {
			resolve(ans);
		});
	});
};

const UserCheck = () => {

	const input = {
		user : ()=> {

			return new Promise( (resolve, reject) => {

				prompt('user=').then((u) => {
					resolve(u);
				});
			});
		},
		password : ()=> {

			return new Promise( (resolve, reject) => {

				prompt('password=').then((p) => {
					resolve(p);
				});
			});
		}
	};

	const inputAll = () => {

		return new Promise((resolve, reject) => {

			input.user().then((u) => {
				input.password().then((p) => {
					resolve({user: u, password : p});
				});
			});
		});
	};

	inputAll().then((values) => {

		log('values of inputAll');
		console.log(values);

		user = values.user;
		password = values.password;

		request(path + '/user/UserCheck?user=' + user + '&pass=' + password)

		.then((body) => {

			log(body);

			// cookieからJSESSIONIDを取り出す

			//let cookie = res.headers['set-cookie'][0]
			//jsessionid = cookie.slice(0, cookie.indexOf(';'));

			// 分岐 : userCheckに失敗した場合と成功した場合
			// 失敗した場合 (bodyにuser=とpass=が含まれている) => { もう一度userCheck }
			// 成功した場合 (bodyにroomNumber=が含まれている) => { roomを選ぶ処理へ}	


			RoomNumberCheck();
		})	

		.catch((e) => {
			console.log(e.message);

		});
	});
}


var RoomNumberCheck = () => {

	rl.question('roomNumber=', (r) => {
		roomNumber = r;

		run();
	});

	var run = () => {

		var options = {
			hostname: domain,
			path: path + '/user/RoomNumberCheck?roomNumber=' + roomNumber,
			method: 'GET',
			headers: {'Cookie': jsessionid}
		}

		var req = http.request(options, (res) => {
			log('in request');

			var body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				// 
				log('end');
				log(body)

				GetReadyCheck();
			});
		}).on('error', (e) => {

			console.log(e.message);
		}).end();
	};
};

var GetReadyCheck = () => {

	var run = () => {

		var options = {
			hostname: domain,
			path: path + '/user/GetReadyCheck?command1=gr',
			method: 'GET',
			headers: {'Cookie': jsessionid}
		}

		var req = http.request(options, (res) => {

			var body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				// 
				log('end');
				log(body)

				// getready の return code を取得
				var returncode ='';


				CommandCheck();
			});
		}).on('error', (e) => {

			console.log(e.message);
		}).end();
	}	

	run();
};

// CommandCheck?command2=wu
var CommandCheck = () => {

	rl.question('command2=', (a) => {

		command2 = a;

		run();
	});

	var run = () => {

		var options = {
			hostname: domain,
			path: path + '/user/CommandCheck?command2=' + command2,
			method: 'GET',
			headers: {'Cookie': jsessionid}
		}

		var req = http.request(options, (res) => {

			var body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				// 
				log('end');
				log(body)

				// action の return code を取得
				// Action ReturnCode=1,1,1,1,0,1 
				var returncode ='';

				EndCommandCheck();
			});
		}).on('error', (e) => {

			console.log(e.message);
		}).end();
	};
};

// EndCommandCheck?command3=%23
var EndCommandCheck = () => {

	var run = () => {

		var options = {
			hostname: domain,
			path: path + '/user/EndCommandCheck?command3=%23',
			method: 'GET',
			headers: {'Cookie': jsessionid}
		}

		var req = http.request(options, (res) => {

			var body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				// 
				log('end');
				log(body)

				GetReadyCheck();
			});
		}).on('error', (e) => {
			console.log(e.message);
		}).end();
	}	

	run();
}

UserCheck();