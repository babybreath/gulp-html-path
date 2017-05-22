'use strict';

var path = require('path');
var gutil = require('gulp-util');
var Transform = require('readable-stream/transform');
var rs = require('replacestream');
var istextorbinary = require('istextorbinary');

var PLUGINNAME = 'gulp-path';
var REG_HTML = /([\s]href=|[\s]src=)['"][a-zA-Z_\-\d\.\/]+['"]|[\s:]url\(\s*['"]?[a-zA-Z_\-\d\.\/]+['"]?\s*\)/g;
var REG_SUB = /([\s]href=|[\s]src=)|['"]|[\s:]url\(\s*|\s*\)/g;
var MATCHED = 0;
var REPLACED = 0;

module.exports = function(options) {
    var base;
    options = options || {};
    if(options.hasOwnProperty('base')){
        base = options.base;
    }else{
        base = process.cwd();
    }
    console.log('\nbase => ' + base);
    var isLog = options.log || true;

    function log(msg){
        isLog && console.log(msg);
    }

    return new Transform({
        objectMode: true,
        transform: function(file, enc, callback) {
            if (file.isNull()) {
                return callback(null, file);
            }

            function doReplace() {
                if (file.isStream()) {
                    file.contents = file.contents.pipe(rs(search, replacement));
                    return callback(null, file);
                }

                if (file.isBuffer()) {
                    log('\nchecking file...' + file.history[0]);
                    var fileContent = file.contents.toString();
                    var filePath = path.dirname(file.history[0]);
                    log('filePath =>' + filePath)
                    var extname = path.extname(file.history[0]);
                    fileContent = fileContent.replace(REG_HTML, function(matchString){
                        MATCHED++;
                        var url = matchString.replace(REG_SUB, '');
                        log(matchString + ' => ' + url);
                        var absoluteUrl;
                        if(url.indexOf('/') === 0){
                            absoluteUrl = path.join(base, url);
                        }else{
                            absoluteUrl = path.resolve(base, url);
                        }
                        log('absoluteUrl => ' + absoluteUrl);
                        var relativeUrl = path.relative(filePath, absoluteUrl);
                        log('ralvativeUrl => ' + relativeUrl);
                        var result = matchString.split(url).join(relativeUrl);
                        log(matchString + ' => ' + result);
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
        }
    });
};
