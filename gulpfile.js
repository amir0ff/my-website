// Include Gulp.js and Plugins
const gulp = require('gulp');
const newer = require('gulp-newer');
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
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
const packageFile = require('./package.json');

// Parses build task arguments
const args = minimist(process.argv.slice(2));
// "$ gulp build --prod" for production build
// "$ gulp build" for development build

// Main build directories
let sourceDir = 'source/';
let buildDir = 'build/';

let npm = {
  jquery: 'node_modules/jquery/dist/jquery.js',
  bootstrap: 'node_modules/bootstrap/dist/js/bootstrap.js',
  moment: 'node_modules/moment/moment.js',
};
let images = {
  src: sourceDir + 'images/**/*.*',
  bld: buildDir + 'images/',
};

let css = {
  src: sourceDir + 'scss/**/*.scss',
  watch: [sourceDir + 'scss/**/*'],
  bld: buildDir + 'css/',
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
    minifier: args.prod,
  },
};

let js = {
  src: sourceDir + 'js/main.js',
  bld: buildDir + 'js/',
};

let php = {
  src: sourceDir + 'php/*.php',
  bld: buildDir + 'php/',
};

let browserSyncConfig = {
  server: {
    baseDir: buildDir,
    index: 'index.html',
  },
  open: false,
  notify: true,
};

let html = {
  src: sourceDir + '*.html',
  watch: [sourceDir + '*.html'],
  bld: buildDir,
  context: {
    devBuild: !args.prod,
  },
};

// HTML Compression
gulp.task('html', () => {
  let page = gulp.src(html.src).pipe(preprocess({
    context: html.context,
  }));
  if (args.prod) {
    page = page
      .pipe(sizediff.start())
      .pipe(htmlclean())
      .pipe(sizediff.stop({
        title: 'HTML Minification',
      }));
  }
  return page.pipe(gulp.dest(html.bld));
});

// Images Compression
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.bld))
    .pipe(sizediff.start())
    .pipe(imagemin())
    .pipe(sizediff.stop({
      title: 'Images Compression',
    }))
    .pipe(gulp.dest(images.bld));
});

// Build CSS Files
gulp.task('sass', () => {
  return gulp.src(css.src)
    .pipe(sizediff.start())
    .pipe(sass(css.sassOpts))
    .pipe(pleeease(css.pleeeaseOpts))
    .pipe(sizediff.stop({
      title: 'CSS Compression',
    }))
    .pipe(gulp.dest(css.bld));
});


// Just copy all php module files to build folder
gulp.task('php', () => {
  return gulp.src(php.src).pipe(gulp.dest(php.bld));
});

// Build JavaScript
gulp.task('js', () => {
  if (!args.prod) {
    return gulp.src([npm.jquery,
      npm.bootstrap,
      npm.moment,
      js.src,
      'source/js/smooth-scroll.js',
      'source/js/back-to-top.js',
    ])
      .pipe(newer(js.bld))
      .pipe(concat('main.js'))
      .pipe(gulp.dest(js.bld));
  } else {
    del([
      buildDir + 'js/*',
    ]);
    return gulp.src(
      [
        npm.jquery,
        npm.bootstrap,
        npm.moment,
        js.src,
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
      .pipe(gulp.dest(js.bld));
  }
});

// Runs only on Travis CI
gulp.task('deploy', async (done) => {

  const config = {
    user: args.user,
    password: args.password,
    host: 'ftp.amiroff.me',
    port: 21,
    localRoot: __dirname + '/build',
    remoteRoot: '/amiroffme/',
    include: ['*', '**/*'],
    deleteRemote: false,
    forcePasv: true,
    sftp: false,
  };

  await ftpDeploy
    .deploy(config)
    .then(res => console.log('FTP connection successful: ', res))
    .catch(err => console.log('FTP error: ', err));
  done();
});

// Runs only for development build
gulp.task('development', () => {
  browsersync(browserSyncConfig);
  // Print build info
  console.log('Package Info: ', packageFile.name + ' "' + packageFile.description + '" v' + packageFile.version);
  console.log('This is a development build');
  console.log('File changes will be watched and trigger a page reload');
  ncu.run({
    packageFile: 'package.json',
  })
    .then((upgraded) => {
      if (Object.keys(upgraded).length === 0) {
        console.log('All npm dependencies are up to date!');
      } else {
        console.log('The following npm dependencies need updates "ncu -a":', upgraded);
      }
    });
  gulp.watch(html.watch, gulp.series(['html', browsersync.reload]));
  gulp.watch(images.src, gulp.series(['images', browsersync.reload]));
  gulp.watch(css.watch, gulp.series(['sass', browsersync.reload]));
  gulp.watch(js.src, gulp.series(['js', browsersync.reload]));
});

// Runs only for production build
gulp.task('production', (done) => {
  // Print build info
  console.log('Package Info: ', packageFile.name + ' "' + packageFile.description + '" v' + packageFile.version);
  console.log('This is a production build');
  console.log('Please run the following script for deployment:');
  console.log('$ gulp deploy --user $FTP_USER --password $FTP_PASSWORD');
  done();
});

// Main build task
gulp.task('build', gulp.series(gulp.parallel('html', 'images', 'sass', 'js', 'php', (args.prod ? 'production' : 'development'))), (done) => {
  done();
});
