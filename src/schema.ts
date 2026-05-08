export const typeDefs = `#graphql

type Query {
me: User
posts: [Post]

}

  type Mutation {
    signup(name: String!, email: String!, password: String!,bio:String):AuthPayload,
    signin(email: String!, password: String!):AuthPayload,
    addPost(title: String!, content: String!): PostPayload,
    updatePost(id: ID!, title: String, content: String, published: Boolean): Post,
    deletePost(id: ID!): Post

  }

  
 type Post{
  id: ID!
  title: String!
  content: String!
  author: User
  createdAt: String!
  published: Boolean!
 }

 type User{
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post]
 }
  type Profile{  
  id: ID!
  bio: String!
  createdAt: String!
  user: User
  }

  type AuthPayload{
  userError: String
  token: String

  }

  type PostPayload{
  useError: String
  post: Post
  }

`;
