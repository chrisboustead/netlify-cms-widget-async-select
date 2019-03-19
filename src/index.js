import Control from './Control';
import Preview from './Preview';

if (typeof window !== 'undefined') {
  window.AsyncSelectControl = Control;
  window.AsyncSelect = Preview;
}

export { Control, Preview };
