const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development', 
    entry: './src/index.jsx',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: 'http://localhost:9004/'
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        port: 9004,
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
                exclude: /node_modules/, // Ignora o node_modules
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

        // webpack.config.js em Contact
        new ModuleFederationPlugin({
            name: "CarroApp",
            filename: "remoteEntry.js",
            exposes: {
            "./CarroPage": "./src/Carro",
          },
            shared: { react: { singleton: true }, "react-dom": { singleton: true } },
        })        
    ]
}