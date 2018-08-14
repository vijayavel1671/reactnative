import {
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge';
import Config from './Config';

const gaTracker = new GoogleAnalyticsTracker(Config.Google.AnalyticsId)

export default gaTracker;