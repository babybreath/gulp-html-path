# gulp-html-path
rewrite path in html or others. 路径处理。

# usage

~~~
var gulp = require('gulp');
var gulpHtmlPath = require('gulp');

var srcHtml = '**/*.html';
var buildPath = 'dist';

gulp.task('replaceUrl',function(){
  return gulp.src(srcHtml)
    .pipe(gulpHtmlPath({base: './', mode: 'relative'}))
    .pipe(gulp.dest(buildPath))
});
~~~

# API
gulpHtmlPath(options)
## options
- `base`: base path of project (default: process.cwd())
- `mode`: build path mode ['absolute'|'relative']
