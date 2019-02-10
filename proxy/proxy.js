const app = require('./app');
const handlerLib = require('./lib/handelers.js');
setInterval(handlerLib.updateActiveServer,5000);
handlerLib.watchFile();
const PORT=8080;
app.listen(PORT);

console.log(`listening at Port${PORT}`);