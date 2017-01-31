const gulp = require('gulp');
const babel = require('gulp-babel')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const connect = require('gulp-connect')
const open = require('gulp-open')

const config = {
  port: 8080,
  devBaseUrl: 'http:localhost',
  paths: {
    js: './src/**/*.js'
  }
}

gulp.task('connect', () => {
  connect.server({
    root: ['.'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  })
})

gulp.task('open', ['connect'], () => {
  gulp.src('./index.html')
  .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}))
})

gulp.task('js', () => {


  browserify('src/script.js', {debug: true})
    .transform(babelify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', () => {
  gulp.watch(config.paths.js, ['js'])
})

gulp.task('default', ['js', 'open', 'watch']);