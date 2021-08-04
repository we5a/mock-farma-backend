const express = require('express');
const schema = require('./schema');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const path = require('path');
const exp = require('constants');

const app = express();

app.use(cors());


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // some tool, visual documentation
}));

app.use(express.static('public')); // need to add public folder with builded application there


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 6001;
console.log("port", PORT);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});