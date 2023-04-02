import { deleteAsync } from 'del';
import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import livereload from 'gulp-livereload';
import { default as throught2 } from 'through2';
import NodeResolve from '@esbuild-plugins/node-resolve';
import gulpStylelint from '@ronilaukkarinen/gulp-stylelint';
import sveltePlugin from 'esbuild-svelte';
import { createGulpEsbuild } from 'gulp-esbuild';
import inject from 'gulp-inject-string';
// eslint-disable-next-line import/no-unresolved
import gulpEslint from 'gulp-eslint-new';

const { src, dest, watch, series, parallel } = gulp;
const noop = throught2.obj;

let gulpEsbuild = createGulpEsbuild({ incremental: false });

let isProd = false;
const setProd = (done) => { isProd = true; done(); };
const cleanup = () => deleteAsync([PATHS.DIST + '/*']);

const PATHS = {
	JS: {
		INPUT: 'src/index.js',
		OUT: 'index.js',
		ALL: 'src/**/*.{js,svelte}',
		LINT: ['src/**/*.{js,svelte}', '*.js']
	},
	CSS: {
		ALL: 'src/**/*.css',
		OUT: 'index.css',
	},
	DIST: 'dist/',
	OTHER: [
		'src/assets/*.{svg,png,ico,json}',
		'node_modules/@ionic/core/css/core.css',
		'node_modules/@ionic/core/css/core.css.map',
		'node_modules/@ionic/core/css/normalize.css',
		'node_modules/@ionic/core/css/normalize.css.map',
		'node_modules/@ionic/core/css/structure.css',
		'node_modules/@ionic/core/css/structure.css.map',
		'node_modules/@ionic/core/css/typography.css',
		'node_modules/@ionic/core/css/typography.css.map',
	]
};


export function html () {
	const comment = '<!-- scripts-go-here -->';
	const reloadScript = '<script src="http://localhost:35729/livereload.js?snipver=1"></script>';
	const script = isProd ? '' : reloadScript;
	return src('src/index.html')
		.pipe(inject.replace(comment, script))
		.pipe(dest(PATHS.DIST));
}


export function assets () {
	return src(PATHS.OTHER).pipe(dest(PATHS.DIST));
}


export function js () {
	const cfg = {
		outfile: PATHS.JS.OUT,
		mainFields: ['svelte', 'browser', 'module', 'main'],
		bundle: true,
		minify: isProd,
		sourcemap: !isProd,
		loader: { '.svg': 'text' },
		logLevel: 'warning',
		// https://esbuild.github.io/api/#log-override
		logOverride: { 'direct-eval': 'silent' },
		legalComments: 'none',
		format: 'esm',
		treeShaking: true,
		color: true,
		plugins: [
			sveltePlugin({
				compilerOptions: { dev: !isProd, css: false }
			}),
			NodeResolve.default({ extensions: ['.js', '.svelte'] }),
		],
	};
	return src(PATHS.JS.INPUT)
		.pipe(gulpEsbuild(cfg))
		.pipe(dest(PATHS.DIST))
		.pipe(livereload());
}


export function eslint () {
	return src(PATHS.JS.LINT)
		.pipe(gulpEslint({ fix: true }))   // Lint files, create fixes.
		.pipe(gulpEslint.fix())            // Fix files if necessary.
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.results(results => {
			if (results.errorCount) console.log('\x07'); // beep
		}));
}



export function css () {
	return src(PATHS.CSS.ALL, { sourcemaps: !isProd })
		.pipe(concat(PATHS.CSS.OUT))
		.pipe(isProd ? cleanCSS() : noop())
		.pipe(dest(PATHS.DIST, { sourcemaps: '.' }))
		.pipe(livereload());
}

export function stylelint () {
	return src(PATHS.CSS.ALL)
		.pipe(gulpStylelint({
			reporters: [{ formatter: 'string', console: true }]
		}))
		.on('error', function () {
			console.log('\x07');           // beep
			this.emit('end');
		});
}


function watchTask (done) {
	if (isProd) return done();
	livereload.listen();
	gulpEsbuild = createGulpEsbuild({ incremental: true });

	watch(PATHS.CSS.ALL, series(css, stylelint));
	watch(PATHS.JS.ALL, series(js, eslint));
	watch('src/index.html', html);

}


export const lint = parallel(eslint, stylelint);
export const build = series(cleanup, js, parallel(css, html, assets, lint));
export const dist = series(setProd, build);
export default series(build, watchTask);
