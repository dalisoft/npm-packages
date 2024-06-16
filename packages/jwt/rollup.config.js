import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';

export default  {
  input: './src/jwt.ts',
  output: {
    format: 'es',
    file: './dist/es/jwt.js',
    esModule: true
  },
  plugins: [
    del({
      targets: 'dist/*'
    }),
    typescript({
      abortOnError: false,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      }
    })
  ],
  external: ['jsonwebtoken', 'crypto', 'rand-token', 'typescript']
}
