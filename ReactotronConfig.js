import Reactotron from 'reactotron-react-native';

const reactotron = Reactotron.configure()
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .connect(); // let's connect!

export default reactotron;
