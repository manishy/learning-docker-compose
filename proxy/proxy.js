const app = require('./app');
const handelerLib = require('./lib/handelers.js');
setInterval(handelerLib.updateActiveServer,5000);
const PORT=8080;
app.listen(PORT);

console.log(`listening at Port${PORT}`);