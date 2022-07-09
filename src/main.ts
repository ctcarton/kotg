import tko from '@tko/build.reference/dist/build.reference.es6';
window.ko = tko;

import './style.css'; // fancy vite auto CSS feature
import './views/main-app';

console.log('Applying Bindings');
tko.applyBindings().then(null, console.error);
console.log(` 🥊 TKO bindings applied`);
