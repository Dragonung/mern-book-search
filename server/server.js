const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//additional libraries
const { typeDefs, resolvers } = require ('./schemas');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
//Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    //otherwise, show client/index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer();
