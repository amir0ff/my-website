const gulp = require('gulp');
const minimist = require('minimist');
const htmlclean = require('gulp-htmlclean');
const imagemin = require('gulp-imagemin');
const sizediff = require('gulp-sizediff');
const preprocess = require('gulp-preprocess');
const sass = require('gulp-sass')(require('node-sass'));
const pleeease = require('gulp-pleeease');
const stripdebug = require('gulp-strip-debug');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const browsersync = require('browser-sync');
const ncu = require('npm-check-updates');
const del = require('del');

/**
 Parses build task arguments
 "$ gulp build --prod" for production build
 "$ gulp build" for development build
 **/
const args = minimist(process.argv.slice(2));
const buildType = args.prod ? 'production' : 'development';
const buildMessage = buildType === 'production' ? 'Look at .github/workflows/node.js.yml for deployment build script.' : 'File changes will be watched and trigger a page reload.';

// Main build directories
const sourceDir = './source/';
const buildDir = './build/';

const npm_modules = {
  jquery: './node_modules/jquery/dist/jquery.js',
  bootstrap: './node_modules/bootstrap/dist/js/bootstrap.js',
  moment: './node_modules/moment/moment.js',
};
const images = {
  sourceDir: sourceDir + 'images/**/*.*',
  watchList: [sourceDir + 'images/**/*.*'],
  buildDir: buildDir + 'images/',
};

const css = {
  sourceDir: sourceDir + 'scss/**/*.scss',
  watchList: [sourceDir + 'scss/**/*.scss'],
  buildDir: buildDir + 'css/',
  sassOpts: {
    outputStyle: 'nested',
    precision: 3,
    errLogToConsole: true,
  },
  pleeeaseOpts: {
    out: 'main.min.css',
    autoprefixer: {
      browsers: ['last 2 versions', '> 2%'],
    },
    rem: ['16px'],
    pseudoElements: true,
    mqpacker: true,
    minifier: buildType === 'production',
  },
};

const js = {
  sourceDir: sourceDir + 'js/*.js',
  watchList: [sourceDir + 'js/**/*.js'],
  buildDir: buildDir + 'js/',
};

const php = {
  sourceDir: sourceDir + 'php/**/*.php',
  buildDir: buildDir + 'php/',
};

const browserSyncConfig = {
  server: {
    baseDir: buildDir,
    index: 'index.html',
  },
  open: false,
  notify: true,
};

const html = {
  sourceDir: sourceDir + '*.html',
  watchList: [sourceDir + '*.html'],
  buildDir: buildDir,
  context: {
    devBuild: buildType === 'development',
  },
};

// HTML Compression
gulp.task('html', () => {
  let page = gulp.src(html.sourceDir).pipe(preprocess({
    context: html.context,
  }));
  if (buildType === 'development') {
    return page.pipe(gulp.dest(html.buildDir));
  } else {
    return page
      .pipe(sizediff.start())
      .pipe(htmlclean())
      .pipe(sizediff.stop({
        title: 'HTML Minification',
      }))
      .pipe(gulp.dest(html.buildDir));
  }
});

// Images Compression
gulp.task('images', () => {
  return gulp.src(images.sourceDir)
    .pipe(sizediff.start())
    .pipe(imagemin())
    .pipe(sizediff.stop({
      title: 'Images Compression',
    }))
    .pipe(gulp.dest(images.buildDir));
});

// Build CSS Files
gulp.task('sass', () => {
  return gulp.src(css.sourceDir)
    .pipe(sizediff.start())
    .pipe(sass(css.sassOpts))
    .pipe(pleeease(css.pleeeaseOpts))
    .pipe(sizediff.stop({
      title: 'CSS Compression',
    }))
    .pipe(gulp.dest(css.buildDir));
});


// Just copy all php module files to build folder
gulp.task('php', () => {
  return gulp.src(php.sourceDir).pipe(gulp.dest(php.buildDir));
});

// Build JavaScript
gulp.task('js', () => {
  if (buildType === 'development') {
    return gulp.src(
      [
        npm_modules.jquery,
        npm_modules.bootstrap,
        npm_modules.moment,
        js.sourceDir,
        'source/js/smooth-scroll.js',
        'source/js/back-to-top.js',
      ])
      .pipe(concat('main.js'))
      .pipe(gulp.dest(js.buildDir));
  } else {
    return gulp.src(
      [
        npm_modules.jquery,
        npm_modules.bootstrap,
        npm_modules.moment,
        js.sourceDir,
        'source/js/smooth-scroll.js',
        'source/js/back-to-top.js',
      ])
      .pipe(concat('main.min.js'))
      .pipe(sizediff.start())
      .pipe(stripdebug())
      .pipe(terser())
      .pipe(sizediff.stop({
        title: 'JavaScript Compression',
      }))
      .pipe(gulp.dest(js.buildDir));
  }
});

// Clear build directory
gulp.task('beforeScript', (done) => {
  del([
    buildDir + '/**/*',
  ]);
  done();
});

// Runs after all gulp.js build scripts are done
gulp.task('afterScript', (done) => {
  if (buildType === 'development') {
    browsersync(browserSyncConfig);
    gulp.watch(html.watchList, gulp.series(['html', browsersync.reload]));
    gulp.watch(images.watchList, gulp.series(['images', browsersync.reload]));
    gulp.watch(css.watchList, gulp.series(['sass', browsersync.reload]));
    gulp.watch(js.watchList, gulp.series(['js', browsersync.reload]));
  }
  ncu.run({
    packageFile: 'package.json',
  })
    .then((upgraded) => {
      console.log('-- End of build --');
      console.log('This is a ' + buildType + ' build.');
      console.log('');
      console.log('Files generated and placed in the ' + buildDir + ' directory.');
      console.log(buildMessage);
      if (Object.keys(upgraded).length === 0) {
        console.log('All npm dependencies are up to date!');
      } else {
        console.log('The following npm dependencies need updates "ncu -a":', upgraded);
      }
    });
  done();
});

// Main build task
gulp.task('build', gulp.series('beforeScript', 'html', 'images', 'sass', 'js', 'php', 'afterScript'), (done) => {
  done();
});
