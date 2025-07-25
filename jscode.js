let fontScale = 1;

function adjustFontSize(factor) {
  fontScale += factor;
  const newSize = fontScale * 16; // base is 16px
  document.documentElement.style.fontSize = newSize + "px";
}

function setFontType(fontFamily) {
  document.body.style.fontFamily = fontFamily;
}
