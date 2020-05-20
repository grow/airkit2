import Registry from '../component/registry';
import YTModalComponent from '../ytmodal/ytmodalcomponent';


const app = new Registry();
const ytmodalOptions = {};
app.register('ytmodal', YTModalComponent, ytmodalOptions);
document.addEventListener('DOMContentLoaded', () => {
  app.run();
});
