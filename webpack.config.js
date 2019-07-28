const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("vue-html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./client/src/index.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "client/build")
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.scss$/,
                use: ["vue-style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin(),
        // Generate a html index file
        new HtmlWebpackPlugin({
            vue: true
        })
    ]
};
