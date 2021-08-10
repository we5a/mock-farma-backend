const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLList,
  GraphQLInputObjectType
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

const defaultProfile = {
  id: 1,
  full_name: 'Jin Smith (default)',
  email: 'default-jine@gmail.com',
  birth_date: '1967-10-05', // YYYY-MM-DD
  ethnic_identity: 'Hispanic/Latino/LatinX',
  smoker_status: false,
  drinker_status: false
};

const defaultAuthPayload = {
  name: 'Jin Smith',
  token: '-=AAA123_authentication_token_from_backend=-',
  avatar_url: 'https://mpng.subpng.com/20180326/wzw/kisspng-computer-icons-user-profile-avatar-female-profile-5ab915f791e2c1.8067312315220792235976.jpg'
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    user_id: { type: GraphQLID },
    user_name: { type: GraphQLString },
    user_email: { type: GraphQLString },
    user_token: { type: GraphQLString }
  })
});

const UserProfile = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    id: { type: GraphQLID },
    full_name: { type: GraphQLString },
    email: { type: GraphQLString },
    birth_date: { type: GraphQLString },
    ethnic_identity: { type: GraphQLString },
    smoker_status: { type: GraphQLBoolean },
    drinker_status: { type: GraphQLBoolean }
  })
});

const AuthPayload = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: () => ({
    name: { type: GraphQLString },
    avatar_url: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

const UserSurveyAnswers = new GraphQLObjectType({
  name: 'UserSurveyAnswers',
  fields: () => ({
    user_id: { type: GraphQLID },
    user_name: { type: GraphQLString },
    date: { type: GraphQLString },
    answers: { type: [SurveyAnswerType] }
  })
});

const SurveyAnswerType = new GraphQLObjectType({
  name: 'SurveyAnswer',
  fields: () => ({
    question_id: { type: GraphQLString },
    question_text: { type: GraphQLString },
    question_comment: { type: GraphQLString },
    // value: { type: GraphQLString }
  })
});

const SurveyAnswerInputType = new GraphQLInputObjectType({
  name: 'SurveyAnswerInput',
  fields: () => ({
    question_id: { type: GraphQLString },
    question_text: { type: GraphQLString },
    question_comment: { type: GraphQLString },
    // value: { type: new GraphQLObjectType() }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return Promise.resolve(users);
      },
    },
    user: {
      type: UserType,
      args: {
        user_id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Promise.resolve(users.find(u => u.user_id === Number.parseInt(args.user_id)));
      }
    },
    profile: {
      type: UserProfile,
      resolve(parent, args) {
        // in real app: check token and get proper profile data to send
        return Promise.resolve(defaultProfile);
      }
    },
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    login: {
      type: AuthPayload,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args, context, info) {
        return Promise.resolve({
          name: defaultAuthPayload.name,
          email: args.email,
          avatar_url: defaultAuthPayload.avatar_url,
          token: defaultAuthPayload.token
        });
      }
    },
    signup: {
      type: AuthPayload,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args, context, info) {
        return Promise.resolve({
          email: args.email,
          token: defaultAuthPayload.token
        });
      }
    },
    profile: {
      type: UserProfile,
      args: {
        full_name: { type: GraphQLString },
        email: { type: GraphQLString },
        birth_date: { type: GraphQLString },
        ethnic_identity: { type: GraphQLString },
        smoker_status: { type: GraphQLBoolean },
        drinker_status: { type: GraphQLBoolean }
      },
      resolve(parent, args, context, info) {
        return Promise.resolve({
          full_name: args.full_name || defaultProfile.name,
          email: args.email || defaultProfile.email,
          birth_date: args.birth_dateh || defaultProfile.birth_date,
          ethnic_identity: args.ethnic_identity || defaultProfile.ethnic_identity,
          smoker_status: args.smoker_status || defaultProfile.smoker_status,
          drinker_status: args.drinker_status || defaultProfile.drinker_status
        });
      }
    },
    answers: {
      type:  new GraphQLList(SurveyAnswerType),
      args: {
        answers: { type: new GraphQLList(SurveyAnswerInputType) },
      },
      resolve(parent, args, context, info) {
        console.log('Args', args);
        return args.answers;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
