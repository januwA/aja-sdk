## require
```js
const sdk = require('aja-sdk')
console.log(sdk); // [Module] { htmlAst: [Getter], mobx: [Getter], utils: [Getter] }

const mobx = require('aja-sdk/mobx')
const ast = require('aja-sdk/htmlAst')
const utils = require('aja-sdk/utils')
```

ts暂时无法识别nodejs的exports特性: https://github.com/microsoft/TypeScript/issues/33079

## See also: