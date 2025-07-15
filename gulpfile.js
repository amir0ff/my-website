import gulp from 'gulp';
import terser from 'gulp-terser';
import sizediff from 'gulp-sizediff';
import preprocess from 'gulp-preprocess';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { deleteAsync } from 'del';
import ncu from 'npm-check-updates';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import stripdebug from 'gulp-strip-debug';
import minimist from 'minimist';
import htmlclean from 'gulp-htmlclean';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';

const sassCompiler = gulpSass(sass);

/**
 * Parses build task arguments
 * "$ gulp build --prod" for production build
 * "$ gulp build" for development build
 */
const args = minimist(process.argv.slice(2));

const buildType = args.prod ? 'production' : 'development';
const prodMessage = 'Look at .github/workflows/node.js.yml for deployment build script.';
const devMessage = 'File changes will be watched and trigger a page reload.';
const buildMessage = buildType === 'production' ? prodMessage : devMessage;

//   Main build directories
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
    outputStyle: 'compressed',
  },
  plugins: [autoprefixer(), cssnano()],
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
  port: 8080,
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

//   Clear build directory
export const beforeScript = async () => {
  await deleteAsync([buildDir + '/**/*']);
};
beforeScript.displayName = 'beforeScript'; //   Explicitly name the task

//   HTML Compression
export const htmlTask = async () => {
  try {
    let page = gulp.src(html.sourceDir).pipe(
      preprocess({
        context: html.context,
      })
    );
    if (buildType === 'development') {
      await page.pipe(gulp.dest(html.buildDir));
    } else {
      await page
        .pipe(sizediff.start())
        .pipe(htmlclean())
        .pipe(
          sizediff.stop({
            title: 'HTML Minification',
          })
        )
        .pipe(gulp.dest(html.buildDir));
    }
  } catch (error) {
    console.error('Error during html task:', error);
    throw error; //   Re-throw the error to fail the task
  }
};
htmlTask.displayName = 'html';

//   Images Compression
export const imagesTask = async () => {
  try {
    const imagemin = (await import('gulp-imagemin')).default;
    const imageminPngquant = (await import('imagemin-pngquant')).default;
    const imageminSvgo = (await import('imagemin-svgo')).default;
    await gulp
      .src(images.sourceDir, { encoding: false })
      .pipe(sizediff.start())
      .pipe(imagemin([
        imageminPngquant(),
        imageminSvgo(),
      ]))
      .pipe(
        sizediff.stop({
          title: 'Images Compression',
        })
      )
      .pipe(gulp.dest(images.buildDir));
  } catch (error) {
    console.error('Error during images task:', error);
    throw error;
  }
};
imagesTask.displayName = 'images';

//   Build CSS
export const sassTask = async () => {
  try {
    const postcssPlugins = [];
    if (buildType === 'production') {
      postcssPlugins.push(...css.plugins);
    }

    await gulp
      .src(css.sourceDir)
      .pipe(sizediff.start())
      .pipe(sassCompiler(css.sassOpts).on('error', sassCompiler.logError))
      .pipe(postcss(postcssPlugins))
      .pipe(concat('main.min.css'))
      .pipe(
        sizediff.stop({
          title: 'CSS Compression',
        })
      )
      .pipe(gulp.dest(css.buildDir));
  } catch (error) {
    console.error('Error during sass task:', error);
    throw error;
  }
};
sassTask.displayName = 'sass';

//   Just copy all php module files to build folder
export const phpTask = async () => {
  try {
    await gulp.src(php.sourceDir).pipe(gulp.dest(php.buildDir));
  } catch (error) {
    console.error('Error during php task:', error);
    throw error;
  }
};
phpTask.displayName = 'php';

//   Build JavaScript
export const jsTask = async () => {
  try {
    if (buildType === 'development') {
      await gulp
        .src([npm_modules.jquery, npm_modules.bootstrap, npm_modules.moment, js.sourceDir])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(js.buildDir));
    } else {
      await gulp
        .src([npm_modules.jquery, npm_modules.bootstrap, npm_modules.moment, js.sourceDir])
        .pipe(concat('main.min.js'))
        .pipe(sizediff.start())
        .pipe(stripdebug())
        .pipe(terser({ format: { comments: false } }))
        .pipe(
          sizediff.stop({
            title: 'JavaScript Compression',
          })
        )
        .pipe(gulp.dest(js.buildDir));
    }
  } catch (error) {
    console.error('Error during js task:', error);
    throw error;
  }
};
jsTask.displayName = 'js';

export const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};
browserSyncReload.displayName = 'browserSyncReload';

//   Runs after all gulp.js build scripts are done
export const afterScript = (done) => {
  if (buildType === 'development') {
    browserSync(browserSyncConfig);
    gulp.watch(html.watchList, gulp.series(htmlTask, browserSyncReload));
    gulp.watch(images.watchList, gulp.series(imagesTask, browserSyncReload));
    gulp.watch(css.watchList, gulp.series(sassTask, browserSyncReload));
    gulp.watch(js.watchList, gulp.series(jsTask, browserSyncReload));
    gulp.watch(php.watchList, gulp.series(phpTask, browserSyncReload));
  }
  ncu.run({
    packageFile: 'package.json',
  }).then((upgraded) => {
    console.log('--- End of build ---');
    console.log('');
    console.log('This was a ' + buildType + ' build.');
    console.log('');
    console.log('Files are generated in the ' + buildDir + ' directory.');
    console.log(buildMessage);
    if (Object.keys(upgraded).length === 0) {
      console.log('All npm dependencies are up to date!');
    } else {
      console.log('The following npm dependencies have updates');
      console.log('To update npm dependencies, run the following command in your terminal:, `ncu -u`', upgraded);
    }
  });
  done();
};
afterScript.displayName = 'afterScript';

//   Main build task
export const build = gulp.series(beforeScript, htmlTask, imagesTask, sassTask, jsTask, phpTask, afterScript);

export default build;
