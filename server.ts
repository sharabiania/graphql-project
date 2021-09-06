import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const fakeForums = [
  {id: 'f1', name: 'forum1'}, 
  {id: 'f2', name: 'forum2'},
  {id: 'f3', name: 'forum3'},
  {id: 'f4', name: 'forum4'}
];

const fakeUsers = [
  {
    id: 'u1',
    name: 'user1',
    forums: ['f1', 'f3', 'f4']
  },
  {
    id: 'u2',
    name: 'user2',
    forums: ['f2', 'f3']
  }
];

const typeDefs = gql`
  type Query {    
    forums: [Forum],
    userForums(userId: ID!): [Forum]
  },

  type Forum {
    id: ID!,
    name: String
  },  
`;

const resolvers = {
  Query: {    
    forums: () => fakeForums,
    userForums: (_: any, args: any): any => {      
      const userForumIds = fakeUsers.find(x => x.id === args.userId)?.forums;      
      if(!userForumIds) return [];
      return fakeForums.filter(x => userForumIds.includes(x.id));
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);