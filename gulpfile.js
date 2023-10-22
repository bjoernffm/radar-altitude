const { src, dest, series, watch } = require('gulp');
var spawn = require('child_process').spawn;
const ts = require('gulp-typescript');
const clean = require('gulp-clean');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function cleanFn() {
    return src('./dist', {read: false, allowEmpty: true}).pipe(clean({}));
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
    return src('./src/**/*.ts')
        .pipe(ts({
            "target": "es2016",
            "module": "commonjs",
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true
        }))
        .pipe(dest('./dist'));
}

function copyAssets() {
    return src('./src/frontend/*')
        .pipe(dest('./dist/frontend'));
}

function serve() {
    spawn('node', ['./dist/backend/index.js'], { stdio: 'inherit' });
}

exports.default = series(cleanFn, build, copyAssets);
exports.build_n_serve = series(build, serve);
