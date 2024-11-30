import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';

import Navbar from './components/Navbar';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

//main GraphQL API endpoint
const authLink = setContext((__, { headers }) => {
  //get auth token from local storage if it exists
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token
        ? `Bearer ${token}`
        : '',
    },
  };
});

const client = new ApolloClient({
  uri: '/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Outlet />
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
