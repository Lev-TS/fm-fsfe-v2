const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Hey, root');
});

app.get('/custom', (req, res) => {
	res.set('X-timestamp', Date.now()).status(418).send('Hey, custom');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
