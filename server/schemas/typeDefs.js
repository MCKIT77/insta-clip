const typeDefs = `
type User {
    _id: ID
    name: String
    email: String
    videos: [Video]
  }

  type Video {
    _id: ID
    uploadDate: String
    path: String
}

type Query {
    video(_id: ID!): Video
    videos: [Video]
    user: User
}

type Mutation {
    uploadVideo(path: String): Video
    addUser(name: String!, email: String!, password: String!): Auth
    updateUser(name: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
}

  type Auth {
    token: ID
    user: User
  }
`;

module.exports = typeDefs;