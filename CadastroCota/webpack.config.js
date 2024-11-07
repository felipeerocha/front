const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development', 
    entry: './src/index.jsx',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: 'http://localhost:9006/'
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        port: 9006,
        historyApiFallback: true, 
    },
    resolve:{
        extensions: [".jsx", ".js", ".json"]
    },
    module: {
        rules:[
            {
                test: /\.jsx?$/,
                loader: require.resolve("babel-loader"),
                exclude: /node_modules/,
                options: {
                    presets: [require.resolve("@babel/preset-react")]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            title: 'App'
        }),

        new ModuleFederationPlugin({
            name: "CadastroApp",
            filename: "remoteEntry.js",
            exposes: {
                "./CadastroPage": "./src/Cadastro",
            },
            shared: {
                react: { singleton: true },
                "react-dom": { singleton: true },
                "react-router-dom": { singleton: true }, // Compartilhando o react-router-dom
            },
        })        
    ]
};
