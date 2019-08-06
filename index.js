'use strict';

const path = require('path');
const Transform = require('readable-stream/transform');
const rs = require('replacestream');
const istextorbinary = require('istextorbinary');

const PLUGINNAME = 'gulp-html-path';
const REG_HTML = /([\s]href=|[\s]src=)['"][a-zA-Z_\-\d\.\/]+['"]|[\s:]url\(\s*['"]?[a-zA-Z_\-\d\.\/]+['"]?\s*\)/g;
const REG_SUB = /([\s]href=|[\s]src=)|['"]|[\s:]url\(\s*|\s*\)/g;

module.exports = function(options) {
  options = options || {};
  const optionsBase = options.base || './';
  const base = path.join(process.cwd(), optionsBase, './');
  const prefix = options.prefix || '';
  const buildPathMode = options.mode || 'absolute';
  console.log(
    `\nPLUGINNAME=>${PLUGINNAME}  base=>${base}  mode=>${buildPathMode}`
  );
  const isLog = options.log || false;

  function log(msg) {
    isLog && console.log(msg);
  }

  return new Transform({
    objectMode: true,
    transform: function(file, enc, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }
      let MATCHED = 0;
      let REPLACED = 0;

      function doReplace() {
        if (file.isStream()) {
          file.contents = file.contents.pipe(rs(search, replacement));
          return callback(null, file);
        }

        if (file.isBuffer()) {
          console.log('\nchecking file...' + file.history[0]);
          let fileContent = file.contents.toString();
          const filePath = path.dirname(file.history[0]);
          log('filePath =>' + filePath);
          //   const extname = path.extname(file.history[0]);
          fileContent = fileContent.replace(REG_HTML, function(matchString) {
            MATCHED++;
            const url = matchString.replace(REG_SUB, '');
            log('\n' + matchString + ' => ' + url);
            let absoluteUrl;
            if (url.indexOf('/') === 0) {
              absoluteUrl = path.join(base, url);
            } else {
              absoluteUrl = path.resolve(base, filePath, url);
            }
            log('absoluteUrl => ' + absoluteUrl);
            const relativeUrl = path
              .relative(filePath, absoluteUrl)
              .split(path.sep)
              .join('/');
            log('ralvativeUrl => ' + relativeUrl);
            const absoluteUrlInHtml = absoluteUrl
              .replace(base, '')
              .split(path.sep)
              .join('/');

            log('absoluteUrlInHtml => ' + absoluteUrlInHtml);
            let result;
            if (options.mode == 'relative') {
              result = matchString.split(url).join(prefix + relativeUrl);
            } else {
              result = matchString.split(url).join(prefix + absoluteUrlInHtml);
            }
            log('result: ' + matchString + ' => ' + result);
            REPLACED++;
            return result;
          });
          file.contents = new Buffer(fileContent);
          return callback(null, file);
        }

        callback(null, file);
      }

      if (options && options.skipBinary) {
        istextorbinary.isText(file.path, file.contents, function(err, result) {
          if (err) {
            return callback(err, file);
          }

          if (!result) {
            callback(null, file);
          } else {
            doReplace();
          }
        });

        return;
      }

      doReplace();

      console.log('\nFOUND:' + MATCHED + ' REPLACED:' + REPLACED + '\n');
    },
  });
};
