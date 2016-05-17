'use strict';
	
var http = require('http');
const Url = require('url');
const readline = require('readline');

const Index = require('./Index.js');
const CHaserOnline003 = require('./CHaserOnline003.js');

// argsのurlにgetする非同期関数
const request = (path) => {

	return new Promise( (resolve, reject) => {

		const domain = 'www7019ug.sakura.ne.jp';

		var options = {
			hostname: domain,
			method: 'GET',
			port: 80,
			path: '/CHaserOnline003/user/'
		};

		let req = http.request(options , (res) => {

			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});
			res.on('end', () => {
				console.log('request end')
				console.log(body);
				resolve(body);
			});
		}).on('error', (e) => {
			reject(new Error(e.message));
		}).end();
	});
};

const Dispatcher = class {

	constructor(u, m, h, b, p) {
		this.url = u;
		this.method = m;
		this.headers = h;
		this.body = b;
		this.params = p;
		console.log(u);
		console.log(m);
		console.log(h);
		console.log(b);
		console.log(p);
	}

	run() {
		return new Promise( (resolve, reject) => {

			request('CHaserOnline003/user/').then((value) => {
				console.log(' comp request')
				console.log(value)
				console.log('end value')

				// この時点でvalueにresponse html が格納されている
				// したがって、ここでurlに応じて、jsonデータにフォーマットしてそのjsonをresolveに渡す

				resolve();
			});

			let array_url = this.url.split('/')
			let controller_url = array_url[1];
			let action_url = array_url[2];

			let controller;

			switch(controller_url) {

				case '' : 
					controller = new Index();
				break;

				case 'CHaserOnline003' :
					controller = new CHaserOnline003();
				break;
			}

			//controller.run().then(() => {
			//	resolve();
			//});
		});
	}
}

var server = http.createServer();

server.on('request', (request, response) => {

	let url = request.url;
	let method = request.method;
	let headers = request.headers;
	let params = Url.parse( request.url, true );
	let body = [];

	request
	.on('data', (chunk) => {
		body.push(chunk);
	})
	.on('end', () => {
		body = Buffer.concat(body).toString();

		main();
	});

	let main = () => {

		let dispatcher = new Dispatcher(url, method, headers, body, params);

		dispatcher.run().then((value) => {

			// このvalueはjsonに整形されたchaser serverからのresponse
			// これをresponse.write

			console.log('fnit');
			response.write('fnit');
			response.end();
		});
	}
});

server.listen(8080);