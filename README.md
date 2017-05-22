# gulp-html-path
rewrite path as absolute or relative
路径处理为绝对路径或相对路径

# Install

```
$ npm install --save-dev gulp-html-path
```
# Usage

```js
var gulp = require('gulp');
var gulpHtmlPath = require('gulp-html-path');

var srcHtml = '**/*.html';
var buildPath = 'dist';

gulp.task('replaceUrl',function(){
  return gulp.src(srcHtml)
    .pipe(gulpHtmlPath({base: './', mode: 'relative'}))
    .pipe(gulp.dest(buildPath))
});
```

# API
gulpHtmlPath(options)
## options
- `base`: base path of project (default: process.cwd())
- `mode`: build path mode ['absolute'|'relative'] (default: 'absolute')
- `isLog`: show detail logs (default: false)

# API
gulpHtmlPath(options)
## options
- `base`: 项目根目录 (默认: process.cwd())
- `mode`: 生成路径模式 ['absolute'|'relative'] (默认: 'absolute')
- `isLog`: 是否显示更多详细日志 (默认: false)
