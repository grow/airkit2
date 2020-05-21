import {Registry} from '..';
import {InviewComponent} from '../inview';


const app = new Registry();
app.register('inview', InviewComponent, {
  inviewClass: 'inview--visible',
});
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
