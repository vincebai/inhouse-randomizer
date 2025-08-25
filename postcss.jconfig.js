// postcss.config.js
export default {
    plugins: {
        tailwindcss: {
            // You must still tell Tailwind which files to scan for classes
            content: [
                "./index.html",
                "./src/**/*.{js,jsx,ts,tsx}",
            ],
        },
        // Other PostCSS plugins
        autoprefixer: {},
    },
};