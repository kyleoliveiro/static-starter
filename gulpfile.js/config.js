const path = require('path');

// Project configuration
const project = {
  name: 'static-starter',
  url: 'https://github.com/watchtowerdigital/static-starter'
}

// Path to source and destination folders
const src  = 'src';
const dest = 'dist';

// Gulp configuration
const config = {

  // Write templates in 'pug' or regular 'html'
  templating: 'pug',

  // Minify generated html
  minifyHtml: false,

  // Generate sourcemaps
  sourcemaps: true,

  // Enable linting
  linting: {
    templates: true,
    styles: true,
    scripts: true,
  },

  // Path configuration
  path: {

    // Source paths
    src: {
      base      : src,      
      templates : src + '/templates',
      scss      : src + '/scss',
      js        : src + '/js',
      images    : src + '/img',
      fonts     : src + '/fonts',
      static    : src + '/static',

      // Stylesheet entry points
      styles: {
        main     : src + '/scss/style.scss',
        carapace : src + '/scss/carapace-modules.scss',
      },

      // Script entry points
      scripts: {
        main : src + '/js/main.js',
      },
    },

    // Destination paths
    dest: {
      base      : dest,
      templates : dest + '/',
      styles    : dest + '/assets/stylesheets',
      scripts   : dest + '/assets/scripts',
      images    : dest + '/assets/images',
      fonts     : dest + '/assets/fonts',
      static    : dest + '/',
    }
  },

  // Gulp plugin options
  options: {

    // Development server
    browserSync: () => {
      return {
        https: false,
        logPrefix: config.project.name,
        reloadDelay: 250,
        reloadDebounce: 250,
        server: {
          baseDir: config.path.dest.base,
          serveStaticOptions: {
            extensions: ['html']
          }
        },
        injectChanges: true
      }
    },

    // Compilers
    pug: () => {
      return {}
    },
    template: () => {
      return {}
    },
    sass: () => {
      return {
        outputStyle: 'expanded',
        includePaths: ['node_modules'],
      }
    },
    sassGlob: () => {
      return {}
    },
    autoprefixer: () => {
      return {
        browsers: ['last 2 version', '> 1%'],
      }
    },
    mqpacker: () => {
      return {
        sort: true,
      }
    },
    uncss: () => {
      return {
        html: path.join(config.path.dest.templates, '**/*.html'),
      }
    },
    rollup: () => {
      return {
        format: 'es'
      }
    },
    babel: () => {
      return {
        presets: ['env']
      }
    },

    // Minifiers
    htmlmin: () => {
      return {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: false,
        removeComments: true,
        removeRedundantAttributes: true,
      }
    },
    cssnano: () => {
      return {
        preset: 'default',
      }
    },
    uglify: () => {
      return {}
    },
    imagemin: () => {
      return {
        verbose: true,
      }
    },

    // Linters
    htmlLint: () => {
      return {}
    },
    stylelint: () => {
      return {
        reporters: [
          {formatter: 'string', console: true},
        ],
      }
    },
    jshint: () => {
      return {}
    },

    // Analyzers
    stylestats: () => {
      return {
        outfile: false,
      }
    },

    // Sitemap generator
    sitemap: () => {
      return {
        siteUrl: config.project.url,
      }
    },
  },

  // Inherit project config
  project
};

module.exports = config;
