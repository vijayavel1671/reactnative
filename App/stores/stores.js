/* @flow */

import { useStrict } from 'mobx';

/* Stores */
import UserStore from './user';
import ShopsStore from './partner';
import LocationStore from './location';
import HomeStore from './home';
import MiscStore from './misc';
import DesignerStore from './designer';
import BlogStore from './blog';

/**
  Enables MobX strict mode globally.
  In strict mode, it is not allowed to
  change any state outside of an action
 */
useStrict(true);

export default class Stores {
  user = new UserStore();
  partner = new ShopsStore();
  location = new LocationStore();
  home = new HomeStore();
  misc = new MiscStore();
  designer = new DesignerStore();
  blog = new BlogStore();
}
