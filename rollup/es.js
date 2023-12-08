import terser from '@rollup/plugin-terser';

export default {
	input: 'src/index.js',

	external: [ 'fs', 'util' ],

	output: {
		file: 'dist/reflect.es.js',
		format: 'esm'
	},

	plugins: [ terser() ]
};