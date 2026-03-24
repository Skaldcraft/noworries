import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/',
	plugins: [
		react()
	],
	server: {
		cors: true,
		headers: { 'Cross-Origin-Embedder-Policy': 'credentialless' },
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: [
			{ find: '@', replacement: '/src' }
		]
	},
	build: {
		rollupOptions: {
			external: ['@babel/parser', '@babel/traverse', '@babel/generator', '@babel/types']
		}
	}
});
