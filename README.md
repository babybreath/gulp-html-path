# gulp-html-path

rewrite path as absolute or relative

路径处理为绝对路径或相对路径

# Install

```
$ npm install --save-dev gulp-html-path
```
# Usage

```js
const gulp = require('gulp');
const gulpHtmlPath = require('gulp-html-path');

const sourcePath = 'source';
const src = ['source/**/*.html', 'source/**/*.js', 'source/**/*.css'];
const buildPath = 'dist';

gulp.task('replaceUrl', done => {
  gulp
    .src(src)
    .pipe(gulpHtmlPath({ base: sourcePath, mode: 'absolute' }))
    .pipe(gulp.dest(buildPath))
    .on('end', () => {
      done();
    });
});
```

## gulp v3
```js
const gulp = require('gulp');
const gulpHtmlPath = require('gulp-html-path');

const sourcePath = 'source';
const src = ['source/**/*.html', 'source/**/*.js', 'source/**/*.css'];
const buildPath = 'dist';

gulp.task('replaceUrl',function(){
  return gulp.src(src)
    .pipe(gulpHtmlPath({base: sourcePath, mode: 'absolute'}))
    .pipe(gulp.dest(buildPath))
});
```

# API
## gulpHtmlPath(options)

### options.base
Type: `string`

Default: `./`

base path of frontend source code

### options.mode
Type: `string`

Default: `absolute`

build path mode ['absolute'|'relative']

### options.prefix
Type: `string`

Default: ``

add the prefix string to each replacement

### options.isLog
Type: `boolean`

Default: `false`

show detail logs

## API
## gulpHtmlPath(options)

### options.base
Type: `string`

Default: `./`

前端源码目录

### options.mode
Type: `string`

Default: `absolute`

生成路径模式 ['absolute'|'relative']

### options.prefix
Type: `string`

Default: ``

添加前缀

### options.isLog
Type: `boolean`

Default: `false`

显示更多详细日志
