const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql');
const {
  GraphQLJSON,
  GraphQLJSONObject
} = require('graphql-type-json');

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
  fullName: 'Jin Smith (default)',
  email: 'default-jine@gmail.com',
  birthDate: '1967-10-05', // YYYY-MM-DD
  ethnicIdentity: 'Hispanic/Latino/LatinX',
  smokerStatus: false,
  drinkerStatus: false
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

const UserProfileType = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    ethnicIdentity: { type: GraphQLString },
    smokerStatus: { type: GraphQLBoolean },
    drinkerStatus: { type: GraphQLBoolean }
  })
});

const UserProfileInputType = new GraphQLInputObjectType({
  name: 'UserProfileInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    ethnicIdentity: { type: GraphQLString },
    smokerStatus: { type: GraphQLBoolean },
    drinkerStatus: { type: GraphQLBoolean }
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

const SurveyAnswerType = new GraphQLObjectType({
  name: 'SurveyAnswer',
  fields: () => ({
    questionId: { type: new GraphQLNonNull(GraphQLID) },
    questionText: { type: GraphQLString },
    questionComment: { type: GraphQLString },
    value: { type: GraphQLJSON }
  })
});

const SurveyAnswerInputType = new GraphQLInputObjectType({
  name: 'SurveyAnswerInput',
  fields: () => ({
    questionId: { type:  new GraphQLNonNull(GraphQLID) },
    questionText: { type: GraphQLString },
    questionComment: { type: GraphQLString },
    value: { type: GraphQLJSON }
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
      type: UserProfileType,
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
      type: UserProfileType,
      args: {
        profile: { type: UserProfileInputType },
      },
      resolve(parent, { profile }, context, info) {
        const { id, fullName, email, birthDate, ethnicIdentity, smokerStatus, drinkerStatus } = profile;
        return {
          id: id,
          fullName: fullName || defaultProfile.name,
          email: email || defaultProfile.email,
          birthDate: birthDate || defaultProfile.birthDate,
          ethnicIdentity: ethnicIdentity || defaultProfile.ethnicIdentity,
          smokerStatus: smokerStatus || defaultProfile.smokerStatus,
          drinkerStatus: drinkerStatus || defaultProfile.drinkerStatus
        }
      }
    },
    setAnswers: {
      type:  new GraphQLList(SurveyAnswerType),
      args: {
        answers: { type: new GraphQLList(SurveyAnswerInputType) },
      },
      resolve(parent, args, context, info) {
        return args.answers;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
