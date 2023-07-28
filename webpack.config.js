const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        port: 9121,
        host: '0.0.0.0', // localhost
        hot: true,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader', options: { presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]] } }
                ]
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({ template: path.resolve(__dirname, 'src/index.html') }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin(
            { patterns: [{ from: path.resolve(__dirname, 'public'), to: 'public' }] }
        )
    ]
}