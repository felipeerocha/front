const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development',
    entry: './src/index.jsx',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: 'http://localhost:9002/',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        port: 9002,
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/,
                options: {
                    presets: [require.resolve('@babel/preset-react')],
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // Add this rule for image files
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/', // Specify the output directory
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            title: 'HomeApp',
        }),
        new ModuleFederationPlugin({
            name: "HomeApp",
            filename: "remoteEntry.js",
            exposes: {
                "./HomePage": "./src/Home", 
            },
            shared: { react: { singleton: true }, "react-dom": { singleton: true } },
        }),        
    ],
};
