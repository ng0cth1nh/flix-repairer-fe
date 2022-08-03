const config = {
  screens: {
    ProfileStackScreen: {
      screens: {
        DepositScreen: {
          path: 'deposit',
        },
      },
    },
  },
};

const linking = {
  prefixes: ['flix-repairer://profile/'],
  config,
};
export default linking;
