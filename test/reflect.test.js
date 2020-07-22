import reflect from './../src/index';

import * as fs 				from 'fs';
import { promisify } 		from 'util';

const readdir 	 = promisify( fs.readdir )
const rmdir 	 = promisify( fs.rmdir )
const stat 		 = promisify( fs.stat )
const unlink 	 = promisify( fs.unlink )
const write 	 = promisify( fs.writeFile )

const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ) );

test('1. No "src" and no "dest" informed on "params"', async () => {

	const { res, err } = await reflect( {} )

	expect( err ).toBe( "Parameters 'src' and 'dest' must be defined" );

});

test('2. "src" or "dest" must be string', async () => {

	const { res, err } = await reflect( { src: 1, dest: 2 } )

	expect( err ).toBe( "Parameters 'src' and 'dest' must be string paths" );

});

test('3. Inexixtent "src"', async () => {

	const { res, err } = await reflect( { src: 'this', dest: 'that' } )

	expect( err ).toBe( "Parameters 'src' and 'dest' must be a directory" );

});

test('4. Parameter "src" cannot be a file', async () => {

	const { res, err } = await reflect( { src: 'test/04/file', dest: 'nothing' } )

	expect( err ).toBe( "Parameters 'src' and 'dest' must be a directory" );

});

test('5. Parameter "dest" cannot be a file', async () => {

	const { res, err } = await reflect( { src: 'test/05/src', dest: 'test/05/dest' } )

	expect( err ).toBe( "Parameters 'src' and 'dest' must be a directory" );

});

test('6. Directory "dest" is created automatically when it doesn\'t exists', async () => {

	const params = { src: 'test/06/src', dest: 'test/06/dest' }

	if ( fs.existsSync( params.dest + '/.gitkeep' ) )
		await unlink( params.dest + '/.gitkeep' )

	if ( fs.existsSync( params.dest ) )
		await rmdir( params.dest )

	expect( fs.existsSync( params.dest ) ).toBe( false )

	const { res, err } = await reflect( params )

	expect( fs.existsSync( params.dest ) ).toBe( true )

	await unlink( params.dest + '/.gitkeep' )
	await rmdir( params.dest )

	expect( fs.existsSync( params.dest ) ).toBe( false )

	expect( res ).toBe( 'Directory "' + params.src + '" reflected to "' + params.dest + '"' );

});

test('7. Reflect new file on src', async () => {

	const params = { src: 'test/07/src', dest: 'test/07/dest' }

	if ( fs.existsSync( params.dest + '/file' ) )
		await unlink( params.dest + '/file' )

	const { res, err } = await reflect( params )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( true )

	await unlink( params.dest + '/file' )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )

	expect( res ).toBe( 'Directory "' + params.src + '" reflected to "' + params.dest + '"' );

	// You konw, we need .gitkeep
	fs.closeSync( fs.openSync( params.dest + '/.gitkeep', 'w' ) );

});

test('8. Recursive reflection', async () => {

	const params = { src: 'test/08/src', dest: 'test/08/dest' }

	if ( fs.existsSync( params.dest + '/subfolder/subfile' ) )
		await unlink( params.dest + '/subfolder/subfile' )

	if ( fs.existsSync( params.dest + '/subfolder' ) )
		await rmdir( params.dest + '/subfolder' )

	if ( fs.existsSync( params.dest + '/file' ) )
		await unlink( params.dest + '/file' )

	const { res, err } = await reflect( params )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( true )
	expect( fs.existsSync( params.dest + '/subfolder' ) ).toBe( true )
	expect( fs.existsSync( params.dest + '/subfolder/subfile' ) ).toBe( true )

	await unlink( params.dest + '/subfolder/subfile' )
	await rmdir(  params.dest + '/subfolder' )
	await unlink( params.dest + '/file' )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/subfolder' ) ).toBe( false )

	expect( res ).toBe( 'Directory "' + params.src + '" reflected to "' + params.dest + '"' );

	// You konw, we need .gitkeep
	fs.closeSync( fs.openSync( params.dest + '/.gitkeep', 'w' ) );

});

test('9. Deleting files and directories that don\'t exist anymore', async () => {

	const params = { src: 'test/09/src', dest: 'test/09/dest' }

	if ( ! fs.existsSync( params.dest + '/file' ) )
		fs.closeSync( fs.openSync( params.dest + '/file', 'w' ) );

	if ( ! fs.existsSync( params.dest + '/dir' ) )
		fs.mkdirSync( params.dest + '/dir' )

	if ( ! fs.existsSync( params.dest + '/dir/file_in_dir' ) )
		fs.closeSync( fs.openSync( params.dest + '/dir/file_in_dir', 'w' ) );

	if ( ! fs.existsSync( params.dest + '/dir/subdir' ) )
		fs.mkdirSync( params.dest + '/dir/subdir' )

	if ( ! fs.existsSync( params.dest + '/dir/subdir/file_in_subdir' ) )
		fs.closeSync( fs.openSync( params.dest + '/dir/subdir/file_in_subdir', 'w' ) );

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( true )
	expect( fs.existsSync( params.dest + '/dir' ) ).toBe( true )
	expect( fs.existsSync( params.dest + '/dir/file_in_dir' ) ).toBe( true )
	expect( fs.existsSync( params.dest + '/dir/subdir' ) ).toBe( true )
	expect( fs.existsSync( params.dest + '/dir/subdir/file_in_subdir' ) ).toBe( true )

	const { res, err } = await reflect( params )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/dir' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/dir/file_in_dir' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/dir/subdir' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/dir/subdir/file_in_subdir' ) ).toBe( false )

	fs.closeSync( fs.openSync( params.dest + '/file', 'w' ) );
	fs.mkdirSync( params.dest + '/dir' )
	fs.closeSync( fs.openSync( params.dest + '/dir/file_in_dir', 'w' ) );
	fs.mkdirSync( params.dest + '/dir/subdir' )
	fs.closeSync( fs.openSync( params.dest + '/dir/subdir/file_in_subdir', 'w' ) );

	expect( res ).toBe( 'Directory "' + params.src + '" reflected to "' + params.dest + '"' );

});

test('10. Do not reflect equal / previous reflected files', async () => {

	const params = { src: 'test/10/src', dest: 'test/10/dest' }

	if ( fs.existsSync( params.dest + '/file' ) )
		await unlink( params.dest + '/file' )

	// Reflect two times and check if it skip the file in the second run
	await reflect( params )

	const dest_stats = await stat( params.dest + '/file' )
	const src_stats = await stat( params.src + '/file' )

	expect( dest_stats.size ).toBe( src_stats.size )
	expect( dest_stats.mtime.getTime() ).toBe( src_stats.mtime.getTime() )

	await reflect( params )

	expect( dest_stats ).toEqual( await stat( params.dest + '/file' ) )

	await unlink( params.dest + '/file' )

	// You konw, we need .gitkeep
	fs.closeSync( fs.openSync( params.dest + '/.gitkeep', 'w' ) );

});

test('11. Remove slashes', async () => {

	const params = { src: 'test/11/src/', dest: 'test/11/dest\\' }

	const { res, err } = await reflect( params )

	expect( res ).toBe( 'Directory "test/11/src" reflected to "test/11/dest"' );

});

test('12. Reflect apparently equal files: same name and content, different modification time', async () => {

	const params = { src: 'test/12/src', dest: 'test/12/dest' }

	// Erase possible remaining files from failed tests
	if ( fs.existsSync( params.src + '/file' ) )
		await unlink( params.src + '/file' )

	if ( fs.existsSync( params.dest + '/file' ) )
		await unlink( params.dest + '/file' )

	expect( fs.existsSync( params.src + '/file' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )

	// Create files with same content, but **in different times**
	await write( params.dest + '/file', 'content' )
	await sleep( 1100 )
	await write( params.src + '/file', 'content' )

	const { res, err } = await reflect( params )

	expect( await stat( params.src + '/file' ).mtime ).toBe( await stat( params.dest + '/file' ).mtime )

	await unlink( params.src + '/file' )
	await unlink( params.dest + '/file' )

	expect( res ).toBe( 'Directory "' + params.src + '" reflected to "' + params.dest + '"' );

});

test('13. Reflect apparently equal files: same name but different content', async () => {

	const params = { src: 'test/13/src', dest: 'test/13/dest' }

	// Erase possible remaining files from failed tests
	if ( fs.existsSync( params.src + '/file' ) )
		await unlink( params.src + '/file' )

	if ( fs.existsSync( params.dest + '/file' ) )
		await unlink( params.dest + '/file' )

	expect( fs.existsSync( params.src + '/file' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )

	// Create files with same name, but different content
	await write( params.dest + '/file', 'content' )
	await write( params.src + '/file', 'different content' )

	const { res, err } = await reflect( params )

	expect( fs.readFileSync( params.src + '/file', { encoding: 'utf-8' } ) ).toBe( fs.readFileSync( params.dest + '/file', { encoding: 'utf-8' } ) )

	await unlink( params.src + '/file' )
	await unlink( params.dest + '/file' )

	expect( res ).toBe( 'Directory "' + params.src + '" reflected to "' + params.dest + '"' );

});

test('14. Do not reflect files informed on "exclude"', async () => {

	const params = { src: 'test/14/src', dest: 'test/14/dest', exclude: [ 'file', 'subdir' ] }

	if ( fs.existsSync( params.dest + '/subdir/subfile' ) )
		await unlink( params.dest + '/subdir/subfile' )

	if ( fs.existsSync( params.dest + '/subdir' ) )
		await rmdir( params.dest + '/subdir' )

	if ( fs.existsSync( params.dest + '/file' ) )
		await unlink( params.dest + '/file' )

	expect( fs.existsSync( params.src + '/file' ) ).toBe( true )
	expect( fs.existsSync( params.src + '/subdir' ) ).toBe( true )
	expect( fs.existsSync( params.src + '/subdir/subfile' ) ).toBe( true )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/subdir' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/subdir/subfile' ) ).toBe( false )

	await reflect( params )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/subdir' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/subdir/subfile' ) ).toBe( false )

	// You konw, we need .gitkeep
	fs.closeSync( fs.openSync( params.dest + '/.gitkeep', 'w' ) );

});

test('15. Do not remove orphan files on "dest" when "delete = false"', async () => {

	const params = { src: 'test/15/src', dest: 'test/15/dest', delete: false }

	if ( ! fs.existsSync( params.dest + '/file' ) )
		fs.closeSync( fs.openSync( params.dest + '/file', 'w' ) );

	await reflect( params )

	expect( fs.existsSync( params.dest + '/file' ) ).toBe( true )

});

test('16. Do not reflect subdirectories when "recursive = false"', async () => {

	const params = { src: 'test/16/src', dest: 'test/16/dest', recursive: false }

	if ( fs.existsSync( params.dest + '/subdir/subfile' ) )
		await unlink( params.dest + '/subdir/subfile' )

	if ( fs.existsSync( params.dest + '/subdir' ) )
		await rmdir( params.dest + '/subdir' )

	await reflect( params )

	expect( fs.existsSync( params.dest + '/subdir/subfile' ) ).toBe( false )
	expect( fs.existsSync( params.dest + '/subdir' ) ).toBe( false )

	// You konw, we need .gitkeep
	fs.closeSync( fs.openSync( params.dest + '/.gitkeep', 'w' ) );

});