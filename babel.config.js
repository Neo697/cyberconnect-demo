module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@/components': './src/components',
          '@/pages': './src/pages',
          '@/svg': './src/svg',
          '@/utils': './src/utils',
          '@/hooks': './src/hooks',
          '@/graphql': './src/graphql',
          '@/context': './src/context',
        },
      },
      'react-native-reanimated/plugin',
    ],
  ],
};
