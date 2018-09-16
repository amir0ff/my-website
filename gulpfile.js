// Include Gulp.js and Plugins
const gulp = require('gulp');
const newer = require('gulp-newer');
const ftp = require('vinyl-ftp');
const minimist = require('minimist');
const htmlclean = require('gulp-htmlclean');
const imagemin = require('gulp-imagemin');
const sizediff = require('gulp-sizediff');
const preprocess = require('gulp-preprocess');
const sass = require('gulp-sass');
const pleeease = require('gulp-pleeease');
const stripdebug = require('gulp-strip-debug');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const browsersync = require('browser-sync');
const ncu = require('npm-check-updates');
const del = require('del');
const pkg = require('./package.json');

// Check build environment
const args = minimist(process.argv.slice(2));

// Main directories
const sourceDir = 'source/';
const buildDir = 'build/';

const npm = {
    jquery: 'node_modules/jquery/dist/jquery.js',
    bootstrap: 'node_modules/bootstrap/dist/js/bootstrap.js',
    moment: 'node_modules/moment/moment.js',
    modernizr: 'source/js/modernizr.js'
};
const images = {
    src: sourceDir + 'images/**/*.*',
    bld: buildDir + 'images/'
};

const css = {
    src: sourceDir + 'scss/**/*.scss',
    watch: [sourceDir + 'scss/**/*'],
    bld: buildDir + 'css/',
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
        minifier: args.prod
    }
};

const js = {
    src: sourceDir + 'js/main.js',
    bld: buildDir + 'js/',
};

const syncOpts = {
    server: {
        baseDir: buildDir,
        index: 'index.html'
    },
    open: false,
    notify: true
};

const html = {
    src: sourceDir + '*.html',
    watch: [sourceDir + '*.html'],
    bld: buildDir,
    context: {
        devBuild: !args.prod,
    }
};

// Cleanup build folder
gulp.task('cleanup', function () {
    del([
        buildDir + '*'
    ]);
});

// HTML compression
gulp.task('html', function () {
    let page = gulp.src(html.src).pipe(preprocess({
        context: html.context
    }));
    if (args.prod) {
        page = page
            .pipe(sizediff.start())
            .pipe(htmlclean())
            .pipe(sizediff.stop({
                title: 'HTML Minification'
            }));
    }
    return page.pipe(gulp.dest(html.bld));
});

// Images compression
gulp.task('images', function () {
    return gulp.src(images.src)
        .pipe(newer(images.bld))
        .pipe(sizediff.start())
        .pipe(imagemin())
        .pipe(sizediff.stop({
            title: 'Images Compression'
        }))
        .pipe(gulp.dest(images.bld));
});

// Build CSS files
gulp.task('sass', function () {
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
gulp.task('js', function () {
    if (!args.prod) {
        return gulp.src([npm.jquery,
            npm.modernizr,
            npm.bootstrap,
            npm.moment,
            js.src,
            'source/js/smooth-scroll.js',
            'source/js/back-to-top.js',
            'source/js/jquery-rss.js'
        ])
            .pipe(newer(js.bld))
            .pipe(concat('main.js'))
            .pipe(gulp.dest(js.bld));
    } else {
        del([
            buildDir + 'js/*'
        ]);
        return gulp.src([npm.jquery,
            npm.modernizr,
            npm.bootstrap,
            npm.moment,
            js.src,
            'source/js/smooth-scroll.js',
            'source/js/back-to-top.js',
            'source/js/jquery-rss.js'
        ])
            .pipe(concat('main.min.js'))
            .pipe(sizediff.start())
            .pipe(stripdebug())
            .pipe(terser())
            .pipe(sizediff.stop({
                title: 'JavaScript Compression'
            }))
            .pipe(gulp.dest(js.bld));
    }
});

gulp.task('browsersync', function () {
    browsersync(syncOpts);
});

// Runs only on Travis CI
gulp.task('deploy', function () {
    const remotePath = '/amiroffme/';
    const conn = ftp.create({
        host: 'ftp.amiroff.me',
        user: args.user,
        password: args.password
    });
    console.log('FTP connection successful!');
    gulp.src('build/**/*.*')
        .pipe(conn.dest(remotePath));
});

gulp.task('production', function () {
    console.log('This is a production build');
});

// Gulp build task
gulp.task('build', ['html', 'images', 'sass', 'js', (args.prod ? 'production' : 'browsersync')], function () {

    // Print build info
    console.log(pkg.name + ' "' + pkg.description + '" v' + pkg.version);

    // Run only in development environment
    if (!args.prod) {
        console.log('This is a development build');
        ncu.run({
            packageFile: 'package.json'
        }).then((upgraded) => {
            if (Object.keys(upgraded).length === 0) {
                console.log('All npm dependencies are up to date!');
            } else {
                console.log('The following npm dependencies need updates "ncu -a":', upgraded);
            }
        });
        gulp.watch(html.watch, ['html', browsersync.reload]);
        gulp.watch(images.src, ['images', browsersync.reload]);
        gulp.watch(css.watch, ['sass', browsersync.reload]);
        gulp.watch(js.src, ['js', browsersync.reload]);
    }
});
