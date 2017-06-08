'use strict';

const PROJECT = 'outline'; // Give this project a name, used for the build folder
const PATHS = new function() {
  this.root = './',
    this.dist = `${this.root}_dist/`,
    this.assets = `${this.root}assets`,
    this.css = `${this.assets}/css`,
    this.js = `${this.assets}/js`,
    this.fonts = `${this.assets}/fonts`,
    this.images = `${this.assets}/images`,
    this.videos = `${this.assets}/video`,
    this.sass = `${this.assets}/sass`;
};
const SOURCES = {
  html: [
    `${PATHS.root}*.html`,
    `${PATHS.root}**/*.html`
  ],
  css: [
    `${PATHS.css}/*.css`,
    `!${PATHS.css}/*.min.css`
  ],
  sass: [
    `${PATHS.sass}/**/*.scss`
  ],
  js: [
    `${PATHS.js}/**/*.js`
  ],
  images: [
    `${PATHS.images}/**/*.{jpg,png,gif,svg}`
  ],
  videos: [
    `${PATHS.videos}/**/*.mp4`
  ],
  concat: [ // Set the order for JS concatenation
    `${PATHS.js}/accordion.js`,
    `${PATHS.js}/main.js`
  ]
};
const OPTIONS = { // Set options for the Gulp plugins
  sass: {
    outputStyle: 'compact'
  },
  autoprefixer: {
    browsers: [
      '> 5%',
      'last 3 versions',
      'Safari > 7',
      'IE > 9'
    ]
  },
  browsersync: {
    server: true,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    browser: [
      'google chrome'
    ],
    reloadOnRestart: true,
    injectChanges: true
  },
  cssnano: {
    autoprefixer: false,
    calc: {
      mediaQueries: true
    },
    colormin: false,
    convertValues: {
      precision: 0
    },
    discardComments: {
      removeAll: true
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    svgo: {
      encode: true
    },
    zindex: false
  },
  imagemin: {
    interlaced: true,
    progressive: true
  },
  loadplugins: {
    lazy: true
  },
  stylelint: {
    reporters: [
      {
        formatter: 'string',
        console: true
      }
    ]
  }
};

// Include gulp and plugins not targeted by gulp-load-plugins
import gulp from 'gulp';
import del from 'del';
import postscss from 'postcss-scss';
import reporter from 'postcss-reporter';

const BROWSERSYNC = require('browser-sync').create();
const $           = require('gulp-load-plugins')(OPTIONS.loadplugins);

/* -------------------------------------------------------------------------------------------------
  # Utility Tasks
------------------------------------------------------------------------------------------------- */
// Delete the generated CSS folder
gulp.task('clean:css', () => {
  del(`${PATHS.css}`);
});

// Delete the generated project JS file and sourcemap
gulp.task('clean:js', () => {
  del([
    `${PATHS.js}/outline.js`,
    `${PATHS.js}/outline.js.map`
  ]);
});

// Delete the generated project distribution folder
gulp.task('clean:dist', () => {
  del(`${PATHS.dist}`);
});

/* -------------------------------------------------------------------------------------------------
  # Server Tasks
------------------------------------------------------------------------------------------------- */
// Launch a development server
gulp.task('server', () => {
  if (!BROWSERSYNC.active) {
    BROWSERSYNC.init(OPTIONS.browsersync);
  }
});

/* -------------------------------------------------------------------------------------------------
  # Sass/CSS Tasks
------------------------------------------------------------------------------------------------- */
// Lint Sass/CSS
gulp.task('sass:lint', () => {
  return gulp
    .src(SOURCES.sass)
    .pipe($.plumber())
    .pipe($.stylelint(OPTIONS.stylelint));
});

// Compile Sass
gulp.task('sass', ['clean:css'], () => {
  return gulp
    .src(SOURCES.sass)
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.sass(OPTIONS.sass)
      .on('error', $.sass.logError))
    .on('error', $.notify.onError('Error compiling Sass!'))
    .pipe($.autoprefixer(OPTIONS.autoprefixer))
    .pipe($.sourcemaps.write('/'))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(PATHS.css))
    .pipe(BROWSERSYNC.stream());
});

// Minify the compiled CSS - Not needed if you will use a plug-in that will minify CSS
gulp.task('sass:minify', () => {
  return gulp
    .src(`${PATHS.css}/theme-styles.css`)
    .pipe($.plumber())
    .pipe($.cssnano(OPTIONS.cssnano))
    .pipe($.rename({
      basename: PROJECT,
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest(PATHS.css))
    .pipe(BROWSERSYNC.stream());
});

/* -------------------------------------------------------------------------------------------------
  # JS Tasks
------------------------------------------------------------------------------------------------- */
// Lint JavaScript
gulp.task('js:lint', () => {
  return gulp
    .src(SOURCES.js)
    .pipe($.plumber())
    .pipe($.babel())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// Concatenate JavaScript
gulp.task('js', () => {
  return gulp
    .src(SOURCES.concat)
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.babel())
    .pipe($.print())
    .pipe($.concat(`${PROJECT}.js`))
    .pipe($.sourcemaps.write('/'))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(PATHS.js));
});

// Minify the generated JavaScript - Not needed if you will use a plug-in that will minify JS
gulp.task('js:minify', () => {
  return gulp
    .src(`${PATHS.js}/${PROJECT}.js`)
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.rename({
      basename: PROJECT,
      suffix: '.min',
      extname: '.js'
    }))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(PATHS.js))
    .pipe(BROWSERSYNC.stream());
});

/* -------------------------------------------------------------------------------------------------
  # Image Tasks
------------------------------------------------------------------------------------------------- */
// Optimize images
gulp.task('images', () => {
  return gulp
    .src(SOURCES.images)
    .pipe($.plumber())
    .pipe($.imagemin(OPTIONS.imagemin))
    .pipe($.print())
    .pipe(gulp.dest(PATHS.images));
});

/* -------------------------------------------------------------------------------------------------
  # Packaging Tasks
------------------------------------------------------------------------------------------------- */
// Copy all files except the development files to a distribution folder
gulp.task('package', ['clean:dist', 'sass', 'js', 'images'], () => {
  return gulp
    .src([
      `${PATHS.root}**/*`,
      `!${PATHS.root}.tmp`,
      `!${PATHS.root}.tmp/**/*`,
      `!${PATHS.root}node_modules`,
      `!${PATHS.root}node_modules/**/*`,
      `!${PATHS.dist}`,
      `!${PATHS.dist}/**/*`,
      `!${PATHS.sass}`,
      `!${PATHS.sass}/**/*`,
      `!${PATHS.css}/**/*.css.map`,
      `!${PATHS.js}/**/*.js.map`,
      `!${PATHS.js}/plugins`,
      `!${PATHS.js}/plugins/**/*`,
      `!${PATHS.root}.babelrc`,
      `!${PATHS.root}.editorconfig`,
      `!${PATHS.root}.eslintrc.json`,
      `!${PATHS.root}.gitignore`,
      `!${PATHS.root}.stylelintrc`,
      `!${PATHS.root}gulpfile.babel.js`,
      `!${PATHS.root}package.json`,
      `!${PATHS.root}README.md`
    ])
    .pipe(gulp.dest(PATHS.dist + `${PROJECT}`));
});

// Zip up the packaged folder into a .zip file
gulp.task('zip', ['package'], () => {
  return gulp
    .src(PATHS.dist + `${PROJECT}`)
    .pipe($.zip(`${PROJECT}.zip`))
    .pipe(gulp.dest(PATHS.dist));
});

/* -------------------------------------------------------------------------------------------------
  # Defaults
------------------------------------------------------------------------------------------------- */
// Default task
gulp.task('default', ['server', 'sass', 'js', 'watch']);

// Watch files for changes
gulp.task('watch', () => {
  gulp.watch(SOURCES.sass, ['sass']);
  gulp.watch(SOURCES.js, ['js']);
  gulp.watch(SOURCES.php, BROWSERSYNC.reload);
  gulp.watch(SOURCES.html, BROWSERSYNC.reload);
});
