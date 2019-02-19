const av = require('minimist')(process.argv.slice(2));
const delay = require('express-delay');
const importFresh = require('import-fresh');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(av.d);
const middlewares = [
	jsonServer.defaults(),
	[
		// refresh db aka --watch json-server CLI
		(req, res, next) => {
			router.db.assign(importFresh(av.d)).write();
			next();
		}
	]
]

if (av.l) {
	server.use(delay(av.l));
}

server.use(middlewares);
server.get('/tests-refresh', (req, res) => {
	router.db.assign(importFresh(av.d)).write();
	console.error("refresh!!", 0);

	res.sendStatus(200);
});
server.use(router);
server.listen(3000, () => {
	console.log('JSON Server is running');
	console.dir(av);
});
