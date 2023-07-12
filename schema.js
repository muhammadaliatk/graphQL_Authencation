"use strict";
const { gql } = require("apollo-server");
exports.typeDefs = gql `

  type Query {
    userList: [User!]!
    getUser(id:ID!):User
  }
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Mutation {
    addUser (input: addUser!): User!
    updateUser (id : ID!, input:updateUserInput):User!
    deleteUser (id: ID!):User!
    login (input: login): String

  }
  input addUser {
    username: String!
    email: String!
    password: String!
  }
  input login {
    email: String!
    password: String!
  }
  input updateUserInput{
    username:String!
    email:String!
    password:String!
  }
`;
