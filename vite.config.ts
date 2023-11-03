import { defineConfig, HttpProxy } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://stackoverflow.com/a/72677376/13815107
const htmlImport = {
  name: 'htmlImport',
  /**
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path.
   * @returns {{code: string}}
   */
  transform(code: string, id) {
    if (/^.*\.html$/g.test(id)) {
      // A few files have ${{someAngular}} which needs to be escaped because of template literals
      code = code.replace(/\${/g, '\\${');
      code = `export default \`${code}\``;
    }
    return { code };
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), htmlImport],
  rollupOptions: {
    input: {
      // angular: resolve(__dirname, 'index.html'),
      react: resolve(__dirname, 'react/index.html'),
    },
  },
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1',
      },
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // TODO can I somehow get import.meta.env.VITE_API_URL here?
        target: 'http://localhost:80',
        // changeOrigin: false,
        // secure: false,
        // followRedirects: true,
        configure: (proxy: HttpProxy.Server, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url, req.headers);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
