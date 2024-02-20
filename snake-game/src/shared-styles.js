const sheet = new CSSStyleSheet();
await sheet.replace(`@import url('https://cdn.tailwindcss.com/?version=3.0.0');`);
export default sheet;