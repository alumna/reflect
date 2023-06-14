import * as fs 				from 'fs';
import { promisify } 		from 'util';

const copy 	 	 = promisify( fs.copyFile )
const mkdir 	 = promisify( fs.mkdir )
const readdir 	 = promisify( fs.readdir )
const rmdir 	 = promisify( fs.rmdir )
const stat 		 = promisify( fs.stat )
const unlink 	 = promisify( fs.unlink )
const utimes 	 = promisify( fs.utimes )

class Reflect {

	constructor ( recursive, remove, modified_within, only_newer ) {

		this.cache     = {}
		this.exclude   = {}
		this.recursive = recursive
		this.delete    = remove
		this.modified_within = modified_within !== null ? (Date.now() / 1000) - modified_within : false
		this.only_newer = only_newer

	}

	async start ( src, dest, exclude ) {

		// src and dest must be informed
		if ( !src || !dest ) return { res: false, err: "Parameters 'src' and 'dest' must be defined" };

		// src and dest must be string
		if ( typeof src !== 'string' || typeof dest !== 'string' )
			return { res: false, err: "Parameters 'src' and 'dest' must be string paths" };

		// Fix slashes on "src" and "dest"
		src = this.fix( src ); dest = this.fix( dest )

		// Fix slashes, validate and prepare "src" and "dest"
		if ( ! await this.prepare( src, 'src' ) || ! await this.prepare( dest, 'dest' )  )
			return { res: false, err: "Parameters 'src' and 'dest' must be a directory" };

		// Build the index with the paths on "exclude"
		exclude.forEach( path => this.exclude[ src + '/' + path ] = true )

		await this.walk( src, dest );

		return { res: 'Directory "' + src + '" reflected to "' + dest + '"', err: false }

	}

	async prepare ( path, place ) {

		// It's a directory. Validated. Fine
		if ( await this.is_dir( path ) ) return true;

		// It doesn't exist:
		if ( ! await this.read( path ) ) {

			// Return "false" if "src"
			if ( place == 'src' ) return false;

			// Create it, if "dest", and add it to cache
			this.cache[ path ] = true;
			await mkdir( path );

			return true;

		}

		// It's a file: problem. Return false.
		return false;

	}

	async walk ( src, dest ) {

		const promises = []

		// Read all files in both src and dest
		const files_src  = await readdir( src )
		const files_dest = await readdir( dest )

		// For delete = true
		// we must read the dest directory and delete
		// the files that doesn't exist on src anymore
		if ( this.delete && files_dest.length ) {

			// Index all 'src' files for improved performance on comparisons
			const index_src = {};
			files_src.forEach( file => index_src[ file ] = true )

			// Identify the files to delete
			const files = files_dest.filter( file => !index_src[ file ] && !this.exclude[ dest + '/' + file ] )

			// We don't need to wait for the exclusions on dest to finish,
			// so lets them run lonely and assynchronously
			files.forEach( path => promises.push( this.remove( dest + '/' + path ) ) )

		}

		files_src.forEach( path => promises.push( this.sync( src + '/' + path, dest + '/' + path ) ) )

		return Promise.all( promises )

	}

	async sync ( src, dest ) {

		// Skip path if in "exclude" index
		if ( this.exclude[ src ] ) return true;

		/* DIRECTORY */
		// If it's a directory and "recursive = true", reflect it again!
		// Also, with "is_dir", we already have cached the path stats. Performance!
		if ( await this.is_dir( src ) ) {

			if ( !this.recursive ) return true;

			// Prepare dest directory
			await this.prepare( dest, 'dest' )

			return this.walk( src, dest );

		}

		/* DIFFERENT FILES */
		// If file doesn't exist on dest, just copy it
		// Or, if file is different, overwrite it
		if ( ! await this.read( dest ) || this.is_different( src, dest ) ) {

			await copy( src, dest, fs.constants.COPYFILE_FICLONE );
			return utimes( dest, this.cache[ src ].atime, this.cache[ src ].mtime )

		}

		/* EQUAL FILES */
		return true;

	}

	/* return false if doesn't exist */
	/* return stat cache on 'cache' if exists */
	async read ( path ) {

		if ( this.cache[ path ] === undefined ) {

			try {

				return this.cache[ path ] = await stat( path )

			} catch ( e ) {

				// stat throws an error if path doesn't exist
				this.cache[ path ] = false;

				return false;
		    }

		}

		return this.cache[ path ];

	}

	async remove ( path ) {

		// Delete file
		if ( ! await this.is_dir( path ) ) {

			// Update cache
			this.cache[ path ] = false;

			return unlink( path )
		}

		// Delete directory
		const content = await readdir( path )

		await Promise.all( content.map( content_path => this.remove( path + '/' + content_path ) ) )

		// Update cache
		this.cache[ path ] = false;

		return rmdir( path )

	}

	async is_dir ( path ) {

		return ( await this.read( path ) ) ? this.cache[ path ].isDirectory() : false;

	}

	is_different ( src, dest ) {
		const src_mtime = this.cache[ src ].mtime.getTime() / 1000
		const dest_mtime = this.cache[ dest ].mtime.getTime() / 1000

		if ( this.only_newer ) {
			return src_mtime > dest_mtime
		}
		else if ( modified_within !== false ) {
			return src_mtime >= this.modified_within && src_mtime !== dest_mtime
		}

		return ( this.cache[ src ].size != this.cache[ dest ].size ) || src_mtime !== dest_mtime
	}

	fix ( path ) {

		// Fix possible slashes on paths
		const end = path.slice( -1 )

		return ( end == '/' || end == '\\' ) ? path.slice( 0,-1 ) : path
	}

}

export default function ( { src, dest, recursive = true, delete: remove = true, exclude = [], modified_within = null, only_newer = false } ) {

	return ( new Reflect( recursive, remove, modified_within, only_newer ) ).start( src, dest, exclude )

};