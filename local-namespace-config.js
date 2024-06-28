const CL = './src/calendars';
const UT = './src/utils';

module.exports = {
  '@calendars/common': `${CL}/common/index`,
  '@calendars/month': `${CL}/month/index`,
  '@calendars/week': `${CL}/week/index`,
  '@calendars/week-month': `${CL}/week-month/index`,
  '@utils/string': `${UT}/string/index`,
  '@utils/array': `${UT}/array/index`,
  '@utils/react-hooks': `${UT}/react-hooks/index`,
  '@utils/react-native-reanimated': `${UT}/react-native-reanimated/index`,
  '@utils/day': `${UT}/day/index`,
  '@utils/event-emitter': `${UT}/event-emitter/index`,
  '@utils/react-native-gesture-handler': `${UT}/react-native-gesture-handler/index`,
};
