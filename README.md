<div align="center">
	<img src="https://github.com/alumna/reflect/raw/master/reflect.svg?sanitize=true" alt="reflect" width="480" height="270" />
</div>

<div align="center">
	<a href="https://npmjs.org/package/@alumna/reflect">
		<img src="https://badgen.now.sh/npm/v/@alumna/reflect" alt="version" />
	</a>
	<a href="https://npmjs.org/package/@alumna/reflect">
		<img src="https://badgen.net/bundlephobia/min/@alumna/reflect" alt="size" />
	</a>
	<a href="https://travis-ci.org/alumna/reflect">
		<img src="https://travis-ci.org/alumna/reflect.svg?branch=master" alt="travis" />
	</a>
	<a href="https://codecov.io/gh/alumna/reflect">
		<img src="https://codecov.io/gh/alumna/reflect/branch/master/graph/badge.svg" />
	</a>
	<a href="https://npmjs.org/package/@alumna/reflect">
		<img src="https://badgen.now.sh/npm/dm/@alumna/reflect" alt="downloads" />
	</a>
</div>

<div align="center">Reflect the contents of one directory to another. At the speed of light. :zap:</div>

<br/>

## Features

* It **does not** depend on `rsync`
* Asynchronous and super fast with files' `stat` cache
* Extremely lightweight with **no dependencies** – 2.2kB!
* Fully tested on Linux, Mac and Windows
* Added copy-on-write support for file systems that support it (see [COPYFILE_FICLONE](https://nodejs.org/docs/latest-v17.x/api/fs.html#fscopyfilesrc-dest-mode-callback))

Additionally, this module is delivered as:

* **ES Module**: [`dist/reflect.es.js`](https://unpkg.com/@alumna/reflect/dist/reflect.es.js)
* **CommonJS**: [`dist/reflect.cjs.js`](https://unpkg.com/@alumna/reflect/dist/reflect.cjs.js)


## Install

```
$ npm install @alumna/reflect
```


## Usage

```js
import reflect from '@alumna/reflect';

let { res, err } = await reflect({

	src: 'src/',

	dest: 'dest/',

	// (OPTIONAL) Default to 'true'
	recursive: true,

	// (OPTIONAL) Default to 'true'
	// Delete in dest the non-existent files in src
	delete: true,

	// (OPTIONAL)
	// Array with files and folders not to reflect
	exclude: [ "skip-this-file.txt", "skip/this/directory" ],

	// (OPTIONAL)
	// Seconds of time to sync with (for example, 7200, only sync last 2 hours of changes)
	modified_within: null,

	// (OPTIONAL)
	// Only sync files that are newer in the source (ie, destination files that have been updated won't be overwritten)
	only_newer: false,

	// (OPTIONAL)
	// Disable COPYFILE_FICLONE if supported by file system, see more info:
	// https://nodejs.org/docs/latest-v17.x/api/fs.html#fscopyfilesrc-dest-mode-callback
	file_clone: true,

});

if ( err )
	console.error( err )

else
	console.log( res ) // Directory "src/" reflected to "dest/"
```
