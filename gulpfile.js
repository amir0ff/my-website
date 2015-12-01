// Include Gulp.js and Plugins
var gulp = require('gulp'),
  newer = require('gulp-newer'),
  htmlclean = require('gulp-htmlclean'),
  imagemin = require('gulp-imagemin'),
  sizediff = require('gulp-sizediff'),
  preprocess = require('gulp-preprocess'),
  sass = require('gulp-sass'),
  pleeease = require('gulp-pleeease'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  browsersync = require('browser-sync'),
  ncu = require('npm-check-updates'),
  del = require('del'),
  pkg = require('./package.json');


// Check Build Environment
var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),

  // Files Locations
  source = 'source/',
  build = 'build/',
  node_modules = 'node_modules/',

npm = {
    jquery: node_modules + 'jquery/dist/jquery.js',
    bootstrap: node_modules + 'bootstrap/dist/js/bootstrap.js',
    modernizr: 'source/js/modernizr.js'
  },
  images = {
    src: source + 'images/**/*.*',
    bld: build + 'images/'
  },

  css = {
    src: source + 'scss/**/*.scss',
    watch: [source + 'scss/**/*'],
    bld: build + 'css/',
    sassOpts: {
      outputStyle: 'nested',
      precision: 3,
      errLogToConsole: true
    },
    pleeeaseOpts: {
      out: 'main.min.css',
      autoprefixer: {
        browsers: ['last 2 versions', '> 2%']
      },
      rem: ['16px'],
      pseudoElements: true,
      mqpacker: true,
      minifier: !devBuild
    }
  },

  js = {
    src: source + 'js/main.js',
    bld: build + 'js/',
  },

  syncOpts = {
    server: {
      baseDir: build,
      index: 'index.html'
    },
    open: false,
    notify: true
  },

  html = {
    src: source + '*.html',
    watch: [source + '*.html', source + 'template/**/*'],
    bld: build,
    context: {
      devBuild: devBuild,
    }
  };

// Cleanup Build Folder
gulp.task('cleanup', function() {
  del([
    build + '*'
  ]);
});

// HTML Compression
gulp.task('html', function() {
  var page = gulp.src(html.src).pipe(preprocess({
    context: html.context
  }));
  if (!devBuild) {
    page = page
      .pipe(sizediff.start())
      .pipe(htmlclean())
      .pipe(sizediff.stop({
        title: 'HTML Minification'
      }));
  }
  return page.pipe(gulp.dest(html.bld));
});

// Images Compression
gulp.task('images', function() {
  return gulp.src(images.src)
    .pipe(newer(images.bld))
    .pipe(sizediff.start())
    .pipe(imagemin())
    .pipe(sizediff.stop({
      title: 'Images Compression'
    }))
    .pipe(gulp.dest(images.bld));
});

// Build CSS Files
gulp.task('sass', function() {
  return gulp.src(css.src)
    .pipe(sizediff.start())
    .pipe(sass(css.sassOpts))
    .pipe(pleeease(css.pleeeaseOpts))
    .pipe(sizediff.stop({
      title: 'CSS Compression'
    }))
    .pipe(gulp.dest(css.bld));
});

// Build JavaScript
gulp.task('js', function() {
  if (devBuild) {
    return gulp.src([npm.jquery,
        npm.modernizr,
        npm.bootstrap,
        js.src,
        'source/js/smooth-scroll.js',
        'source/js/back-to-top.js'
      ])
      .pipe(newer(js.bld))
      .pipe(concat('main.js'))
      .pipe(gulp.dest(js.bld));
  } else {
    del([
      build + 'js/*'
    ]);
    return gulp.src([npm.jquery,
        npm.modernizr,
        npm.bootstrap,
        js.src,
        'source/js/smooth-scroll.js',
        'source/js/back-to-top.js'
      ])
      .pipe(concat('main.min.js'))
      .pipe(sizediff.start())
      .pipe(stripdebug())
      .pipe(uglify())
      .pipe(sizediff.stop({
        title: 'JavaScript Compression'
      }))
      .pipe(gulp.dest(js.bld));
  }
});

// Browser Sync
gulp.task('browsersync', function() {
  browsersync(syncOpts);
});

// Default Gulp.js Task
gulp.task('default', ['html', 'images', 'sass', 'js', 'browsersync'], function() {

  // Print Build Type
  console.log(pkg.name + ' "' + pkg.description + '" v' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

  // Check Dependencies Versions
  ncu.run({
      packageFile: 'package.json'
    })
    .then(function(upgraded) {
      if (Object.keys(upgraded).length === 0) {
        console.log('All npm dependencies are up to date!');
      } else {
        console.log('The following npm dependencies need updates "ncu -a":', upgraded);
      }
    });

  // Watch HTML
  gulp.watch(html.watch, ['html', browsersync.reload]);

  // Watch Images
  gulp.watch(images.src, ['images', browsersync.reload]);

  // Watch Sass
  gulp.watch(css.watch, ['sass', browsersync.reload]);

  // Watch JavaScript
  gulp.watch(js.src, ['js', browsersync.reload]);

});
