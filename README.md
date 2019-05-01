<div align="center">
	<img src="https://github.com/alumna/reflect/raw/master/reflect.svg?sanitize=true" alt="reflect" width="480" height="270" />
</div>

<div align="center">Reflect the contents of one directory to another. At the speed of light. :high_brightness:</div>

<br/>

## Features

* Asynchronous and lightning fast
* Extremely lightweight with **no dependencies** – 2.2kB!

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
	exclude: [ "skip-this-file.txt", "skip/this/directory" ]
	
});

if ( err )
	console.error( err )

else
	console.log( res ) // Directory "src/" reflected to "dest/"
```