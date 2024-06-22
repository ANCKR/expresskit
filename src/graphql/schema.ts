import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    url: String!
  }
  type CheckResponse {
    message: String
    statusCode: Int
  }
  type User {
    id: ID!
    username: String!
    password: String!
    unique_id_key: String!
  }
  type Query {
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createUser(username: String!, password: String!): User
    updateUser(id: ID!, username: String, password: String): User
    deleteUser(id: ID!): Boolean
    signIn(username: String!, password: String!): CheckResponse
    uploadFile(file: Upload!): File!
  }
`;
export default typeDefs;
