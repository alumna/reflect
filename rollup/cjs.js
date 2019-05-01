import { terser } 		from 'rollup-plugin-terser';

export default {
	input: 'src/index.js',

	external: [ 'fs', 'util' ],

	output: {
		file: 'dist/reflect.cjs.js',
		format: 'cjs'
	},

	plugins: [ terser() ]
};