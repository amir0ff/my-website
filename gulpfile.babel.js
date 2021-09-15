import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import terser from 'gulp-terser';
import sizediff from 'gulp-sizediff';
import preprocess from 'gulp-preprocess';
import pleeease from 'gulp-pleeease';
import del from 'del';
import ncu from 'npm-check-updates';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import stripdebug from 'gulp-strip-debug';
import minimist from 'minimist';
import htmlclean from 'gulp-htmlclean';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';

const sass = gulpSass(nodeSass);

/**
 Parses build task arguments
 "$ gulp build --prod" for production build
 "$ gulp build" for development build
 **/
const args = minimist(process.argv.slice(2));

const buildType = args.prod ? 'production' : 'development';
const prodMessage = 'Look at .github/workflows/node.js.yml for deployment build script.';
const devMessage = 'File changes will be watched and trigger a page reload.';
const buildMessage = buildType === 'production' ? prodMessage : devMessage;

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
  sourceDir: sourceDir + 'js/**/*.js',
  watchList: [sourceDir + 'js/**/*.js'],
  buildDir: buildDir + 'js/',
};

const php = {
  sourceDir: sourceDir + 'php/**/*.php',
  watchList: [sourceDir + 'php/**/*.php'],
  buildDir: buildDir + 'php/',
};

const browserSyncConfig = {
  server: {
    baseDir: buildDir,
    index: 'index.html',
  },
  open: true,
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

// Build CSS
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

gulp.task('browserSyncReload', (done) => {
  browserSync.reload();
  done();
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
    browserSync(browserSyncConfig);
    gulp.watch(html.watchList, gulp.series('html', 'browserSyncReload'));
    gulp.watch(images.watchList, gulp.series('images', 'browserSyncReload'));
    gulp.watch(css.watchList, gulp.series('sass', 'browserSyncReload'));
    gulp.watch(js.watchList, gulp.series('js', 'browserSyncReload'));
    gulp.watch(php.watchList, gulp.series('php', 'browserSyncReload'));
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
        console.log('The following npm dependencies need updates "ncu -u":', upgraded);
      }
    });
  done();
});

// Main build task
gulp.task('build', gulp.series('beforeScript', 'html', 'images', 'sass', 'js', 'php', 'afterScript'), (done) => {
  done();
});
