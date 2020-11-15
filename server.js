var express = require('express');
var url = require('url');
var app = express();
var send = require('./lib/send.js');
var credit = require('./lib/creditails.js');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + credit.user + ":" + credit.pass + "@cluster0.k9t4o.mongodb.net/" + credit.name + "?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run(ip) {
	try {
		await client.connect();
		const database = client.db('ip');
		const collection = database.collection('ip');
		if (ip == undefined) {ip = '127.0.0.1'}
		const query = { ip: ip };
		const go = await collection.insertOne(query);
		console.log(go);
	} finally {
		await client.close();
	}
}
//https://cloud.mongodb.com/v2/5fb14c5106ba022ad7f3c7e1#metrics/replicaSet/5fb14ff3ee0d9124820d521e/explorer/ip/ip/find
try {
	var handlebars = require('express-handlebars')
		.create({ defaultLayout:'main' });
	//порт для heroku нужен 5000
	var port = 5000;
	app.engine('handlebars', handlebars.engine);
	app.set('view engine', 'handlebars');

	app.set('port', process.env.PORT || port);

	app.use(express.static(__dirname + '/public'));

	//редирект с http на https
	app.all('*', function(req, res, next) {
		if (req.protocol == 'http' && req.get('host') != '127.0.0.1:' + port && req.get('host') != 'localhost:' + port) {
			res.redirect('https://' + req.headers.host + req.url);
		}
		var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		console.log("IP: " + ip + " URL: "  + fullUrl);
		//run(ip).catch(console.dir);
		next();
	});
	//домашняя страница
	app.get('/', function(req, res) {
		res.render('h1ome');
		//main.handlebars + home.handlebars
	});
	// INFO страницы
	app.get('/info', function(req, res) {
		let url = req.protocol + '://' + req.get('host');
		if (url == undefined) {url = '/'}
		res.json({port: port, url: url, ipUser: ip});
	});
	// INFO страницы
	app.get('/params/:text', function(req, res) {
		res.json(req.params.text);
	});

	// 404 catch-all
	app.use(function(req, res, next){
		res.status(404);
		res.render('404');
	});

	// 500 error
	app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
		send('500 error, please, check logs!', 'kreepmeister@yandex.ru');
	});

	app.listen(app.get('port'), function(){
		console.log( 'Express server started on http://localhost:' + 
			app.get('port') + '; press Ctrl-C to stop.' );
	});
} catch(ex) {
	send.send(ex, 'kreepmeister@yandex.ru');
}
