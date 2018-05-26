import Registry from '../component/registry';
import InviewComponent from '../inview/inviewcomponent';


const app = new Registry();
app.register('inview', InviewComponent, {
  inviewClass: 'inview--visible',
});
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
