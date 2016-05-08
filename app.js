const http = require('http');
const readline = require('readline');

//var domain = 'www7019ug.sakura.ne.jp';
var domain = '127.0.0.1';
var path = '/CHaserOnline003';
var user = '';
var password = '';
var jsessionid ='';
var roomNumber;
var command2 = '';

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout

});

var log = (l) => console.log(l)

var UserCheck = () => {

	rl.question('user=', (u) => {
		user = u;

		rl.question('password=', (p) => {

			password = p;

			run();
		});
	});

	var run = () => {

		log(user);
		log(password);

		var options = {
			hostname: domain,
			path: path + '/user/UserCheck?user=' + user + '&pass=' + password,
			method: 'GET'
		}

		var req = http.request(options , (res) => {

			var body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				// 
				log(body)
				log(JSON.stringify(res.headers))
				//log(res.headers['set-cookie'])

				// cookieからJSESSIONIDを取り出す
				//var cookie = res.headers['set-cookie'][0]

				//jsessionid = cookie.slice(0, cookie.indexOf(';'));

				log(jsessionid);

				// 分岐 : userCheckに失敗した場合と成功した場合
				// 失敗した場合 (bodyにuser=とpass=が含まれている) => { もう一度userCheck }
				// 成功した場合 (bodyにroomNumber=が含まれている) => { roomを選ぶ処理へ}

				RoomNumberCheck();
			});

		}).on('error', (e) => {

			console.log(e.message);
		}).end();
	}
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