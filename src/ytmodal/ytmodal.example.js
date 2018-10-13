import Registry from '../component/registry';
import YTModalComponent from '../ytmodal/ytmodalcomponent';


const app = new Registry();
app.register('ytmodal', YTModalComponent, {});
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
