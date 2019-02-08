const app = require('./app');
app.initialize();
const PORT=8080;
app.listen(PORT);

console.log(`listening at Port${PORT}`);