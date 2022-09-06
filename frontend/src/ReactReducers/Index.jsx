
import { combineReducers } from 'redux';
import { ImgStatus } from './ImgStatus.jsx';
import { ShowCropHandlers } from './CropHandlerVisible.jsx';
import { PixelateHandlers } from './PixelateHandlers.jsx';
import { MiniHandlers } from './MiniHandlers.jsx';

const ReactReducers = combineReducers({
    ImgStatus,
  cropHandlersVisible: ShowCropHandlers,
  PixelateHandlers,
  MiniHandlers,
});

export default ReactReducers;
