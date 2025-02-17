import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src/',

    build: {
        outDir: '../dist', // folder wdd330_my-movie-app/dist
        emptyOutDir: true, // clean the dist folder before building
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                favorites: resolve(__dirname, './src/pages/favorites.html'),
                where_watch: resolve(__dirname, './src/pages/where_watch.html'),
            },
        },
    },
});
