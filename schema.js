const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLList
} = require('graphql');

const users = [
  {
    user_id: 1,
    user_name: 'Jane',
    user_email: 'solger.jane66@meta.ua',
    user_token: 'jane jwt token here',
  },
  {
    user_id: 2,
    user_name: 'Polly',
    user_email: 'modest.polly@rambler.ru',
    user_token: 'polly jwt token here'
  },
  {
    user_id: 3,
    user_name: 'Anna',
    user_email: 'bolein.anna@yahoo.com',
    user_token: 'anna jwt token here'
  }
];



const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    user_id: { type: GraphQLID },
    user_name: { type: GraphQLString },
    user_email: { type: GraphQLString },
    user_token: { type: GraphQLString }
  })
});

const SurveyAnswer = new GraphQLObjectType({
  name: 'SurveyAnswer',
  fields: () => ({
    question_id: { type: GraphQLString },
    question_text: { type: GraphQLString },
    value: { type: GraphQLScalarType }
  })
});

const UserSurveyAnswers = new GraphQLObjectType({
  name: 'UserSurveyAnswers',
  fields: () => ({
    user_id: { type: GraphQLID },
    user_name: { type: GraphQLString },
    date: { type: GraphQLString },
    answers: { type: [SurveyAnswer]}
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return Promise.resolve(users);
      }
    },
    user: {
      type: UserType,
      args: {
        user_id: {type: GraphQLID }
      },
      resolve(parent, args) {
        console.log('Nees', args.user_id);
        return Promise.resolve(users.find(u => u.user_id === Number.parseInt(args.user_id)));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
