import esbuild from 'esbuild'
import fs from 'fs'

const buildConfig = [
	{ format: 'cjs', minify: false, suffix: '.cjs' },
	{ format: 'cjs', minify: true,  suffix: '.min.cjs' },
	{ format: 'esm', minify: true,  suffix: '.min.js' },
]

fs.readdirSync('.')
	.filter(file => file.endsWith('.js')
		&& !file.endsWith('.config.js')
		&& !file.endsWith('.min.js')
		&& !file.endsWith('.test.js')
	)
	.forEach(file => {
		buildConfig.forEach(config => {
			esbuild.build({
				entryPoints: [file],
				format: config.format,
				minify: config.minify,
				outfile: file.replace(/\.js$/, config.suffix)
			}).catch(() => process.exit(1))
		})
	})
