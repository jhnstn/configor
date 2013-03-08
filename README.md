# configor.js

super simple configuration tool for node.js projects.


## features

* ability to add default configurations
* hierarchically cascading configurations
* add configurations to package.json file or to a configuration specific file - configor.json
* define env mapping.



## Usage

_TODO_ add more details but for now see ./configor.json

```
 var config = require('configor');
  ...
 var url = configor.myProject.url
     img = configor.myProject.img
```



### Hierarchy

1. package.json
2. configor.json
3. env mapping
4. ```configor``` object


