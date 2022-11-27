import { Image } from 'image-editor/image_editor';

let imgObj = (function () {
  let img;
  function createImgObj() {
    img = Image.new(0, 0, new Uint8Array(2));
    return img;
  }

  return {
    get_wasm_img: function () {
      if (!img) {
        img = createImgObj();
      }
      return img;
    },
    imgBuff: null,
  };
})();

export default imgObj;
