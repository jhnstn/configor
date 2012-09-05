/**
 * @author Jason Johnston
 * @copyright  Copyright (c) 2012 PromoJam (http://www.promojam.com)
 *
 */

var fs = require('fs')
  , path = require('path')



var configor = function Configor() {

  var package_data = {}
    , configor_data = {}
    , env_mapping = {}
    , config = this.config;

  // read in from json files
  var dir = path.dirname(module.parent.filename)
    , files = fs.readdirSync(dir);


  // read in package.json
  if (~files.indexOf('package.json')) {
    package_data = JSON.parse(fs.readFileSync(path.join(dir, 'package.json')).toString());
  }

  // read in configor.json
  if (~files.indexOf('configor.json')) {
    configor_data = JSON.parse(fs.readFileSync(path.join(dir, 'configor.json')).toString());
  }

  // merge any configor data from package.json into configor data
  config = mergeObjects(package_data, configor_data);


  config_keys = Object.keys(config);


  // let's do some env mapping
  var envars = process.env
  if (~config_keys.indexOf('env')) {
    env_mapping = config.env;

    (function get_env(env_el) {
      if ('string' === typeof env_el) {
        return envars[env_el] || null ;
        //return nconf.get(env_el);
      }
      for (env in env_el) {
        var val = get_env(env_el[env]);

        if (typeof env_el[env] !== 'undefined') {
          if (val) {
            env_el[env] = val;
          }
          else {
            delete env_el[env];
          }
        }
      }
    })(config.env)
  }


  //merge in environment variables
  config = mergeObjects(config, config.env)
  delete config.env;


  //now grab the argvs

  var argv = process.argv.slice(2);

  for(var arg in argv){

    // ignore non json cli args - suppress error
    try {
      var obj = JSON.parse(argv[arg])

      config = mergeObjects(config, obj);
    }
    catch(e){

      // runtime file?
      if('.json' == path.extname(argv[arg])){

        var cli_file = JSON.parse(fs.readFileSync(argv[arg]).toString());
        config = mergeObjects(config,cli_file)  ;
      }

    }
  }


  return config;

}




module.exports = new configor


/**
 *  merge configs.
 *  for any matching prop, obj2 wins
 * @param obj1
 * @param obj2
 */
function mergeObjects(obj1, obj2) {

  for (var prop in obj2) {
    if (typeof obj2[prop] == 'object') {
      obj1[prop] = mergeObjects(obj1.hasOwnProperty(prop) ? obj1[prop] : {}, obj2[prop]);
    }
    else {
      obj1[prop] = obj2[prop];
    }
  }

  return obj1;
}





