/*
 * innocation 自动化开发框架
 */

'use strict';
var q = require('q');
var gulp = require('gulp-param')(require('gulp'), process.argv, "cb");
var webpack = require('webpack-stream');
var header = require('gulp-header');
var rename = require('gulp-rename');
var md5 = require('gulp-md5-plus');
var rev = require('gulp-rev');
var revcollector = require('gulp-rev-collector');
var sass = require("gulp-sass");
var autoprefix = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var bs = require('browser-sync');
var reload = bs.reload;
var pkg = require('./package.json');
var banner = ['/*!',
  ' * <%= pkg.homepage %>',
  ' * copyright (c) 2016 <%= pkg.name %>',
  ' * author: <%= pkg.author %>',
  ' * update: <%= new Date() %>',
  ' */',
  ''
].join('\n');

var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');

gulp.task('sass', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/css/*.scss')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix({
      browsers: ['> 1%', 'last 3 version', 'ios >= 8', 'android >= 4'],
      remove: true
    }))
    // .pipe(gulp.dest('src/' + project + '/css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/' + distPname + '/css'))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('sass has been compiled');
    });
});
gulp.task('form-sass', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/form/css/*.scss')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix({
      browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      remove: true
    }))
    // .pipe(gulp.dest('src/' + project + '/form/css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/' + distPname + '/form/css'))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('form-sass has been compiled');
    });
});
gulp.task('html', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/form.html')
    .pipe(gulp.dest('dist/' + distPname))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('html has been compiled');
    });
});

gulp.task('js', function(project, env) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/js/*.js')
    .pipe(plumber())
    // .pipe(rev())
    // .pipe(md5(10, 'src/' + project + '/index.ejs'))
    .pipe(gulp.dest('dist/' + distPname + '/js'))
    // .pipe(rev.manifest()) //- 生成一个rev-manifest.json
    // .pipe(gulp.dest('dist/' + project + '/rev')) //- 生成一个rev-manifest.json
    .pipe(webpack((env && env == "prov") ? require('./config/webpack.config.prov.js') : require('./config/webpack.config.js')))
    .pipe(gulp.dest('dist/' + distPname + '/js'))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('js has been compiled');
    });
});

// gulp.task('rev', function(project){
//     return gulp.src('dist/' + project + '/*.js')
// });

gulp.task('content', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src(['src/' + project + '/*.js', 'src/' + project + '/*.json'])
    .pipe(plumber())
    .pipe(gulp.dest('dist/' + distPname))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('content has been compiled');
    });
});
gulp.task('image', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/image/*.{jpg,png,gif,swf}')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('dist/' + distPname + '/image'))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('image has been compiled');
    });
});

gulp.task('video', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/video/*.{mp4,ogg}')
    .pipe(gulp.dest('dist/' + distPname + '/video'))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('video has been copy');
    });
});

gulp.task('audio', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/audio/*.{mp3,wav}')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('dist/' + distPname + '/audio'))
    .pipe(reload({ stream: true }))
    .on("end", function() {
      console.log('audio has been copy');
    });
});

gulp.task('form', function(project) {
  let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/form/**/*')
    .pipe(gulp.dest('dist/' + distPname + '/form'))
    .on("end", function() {
      console.log('form has been copy');
    })
});

gulp.task('assets', function(project) {
	let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/assets/**/*')
    .pipe(gulp.dest('dist/' + distPname + '/assets'))
    .on("end", function() {
      console.log('assets has been copy');
    })
});


//record任务
gulp.task('record', function(project) {
	let distPname = project.replace("T_", "");
  return gulp.src('src/' + project + '/record/**/*')
    .pipe(gulp.dest('dist/' + distPname + '/record'))
    .on("end", function() {
      console.log('record has been copy');
    })
})



gulp.task('browser-sync', function(project) {
	let distPname = project.replace("T_", "");
  var deferred = q.defer();
  bs({
    port: 3000,
    server: {
      baseDir: '.',
      directory: true
    },
    // https:true,
    open: 'external',
    startPath: 'dist/' + distPname
  });
  deferred.resolve();
  return deferred.promise;
});
gulp.task('server', function() {
  var deferred = q.defer();
  bs({
    server: {
      baseDir: '.',
      directory: true
    },
    open: 'external',
    startPath: 'dist'
  });
  deferred.resolve();
  return deferred.promise;
});
// 编辑器任务
gulp.task('form-edit', function() {
  var webpackForm = require('./config/webpack.config.form.js');
  webpack(webpackForm, function(err) {
    console.log('==============start form dev===============');
  });
});
gulp.task('watch', ['browser-sync'], function(project) {
  gulp.watch(['src/' + project + '/*.html'], ['html']);
  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/' + project + '/image/*.{jpg,png,gif,swf}'], ['image']);
  gulp.watch(['src/' + project + '/audio/*.{mp3,wav}'], ['audio']);
  gulp.watch(['src/' + project + '/video/*.{mp4,ogg}'], ['video']);
  gulp.watch(['src/**/*'], ['js']);
  gulp.watch(['src/' + project + '/*.js'], ['content']);
  gulp.watch(['src/' + project + '/form/**/*'], ['form']);
  gulp.watch(['src/' + project + '/form/css/*.scss'], ['form-sass']);
  gulp.watch(['src/' + project + '/assets/**/*'], ['assets']);
  gulp.watch(['src/' + project + '/record/**/*'], ['record']);
});

gulp.task('clean', function(project) {
	let distPname = project.replace("T_", "");
  return gulp.src('dist/' + distPname)
    .pipe(clean())
    .on("end", function() {
      console.log('dist/' + distPname + ' has been clean');
    });
});
//清除编译目录指定项目的map文件
gulp.task("cleanmap", function(project) {
	let distPname = project.replace("T_", "");
  return gulp.src('dist/' + distPname + '/js/*.map')
    .pipe(clean())
    .on("end", function() {
      console.log('dist/' + distPname + '/js/*.map' + ' has been clean');
    })
});

gulp.task('compile', function(project, env, cb) {
  gulpSequence('clean', ['html', 'sass', 'image', 'audio', 'video', 'content', 'form', 'assets', 'record', 'form-sass'], 'js', 'watch', cb);

});

gulp.task('build', function(project, env, cb) {
  gulpSequence('clean', ['html', 'sass', 'image', 'audio', 'video', 'content', 'form', 'assets', 'record', 'form-sass'], 'js', cb);

});

gulp.task('publish', function(project, env, cb) {
  gulpSequence('clean', ['html', 'sass', 'image', 'audio', 'video', 'content', 'form', 'assets', 'record', 'form-sass'], 'js',  cb);

});