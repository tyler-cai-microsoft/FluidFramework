const path = require("path");
const merge = require("webpack-merge");

module.exports = env => {
    const isProduction = env === "production";

    return merge({
        entry: {
            main: "./src/index.tsx"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [ 'style-loader', 'css-loader' ]
                },
            ]
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            library: "[name]",
            // https://github.com/webpack/webpack/issues/5767
            // https://github.com/webpack/webpack/issues/7939            
            devtoolNamespace: "chaincode/counter",
            libraryTarget: "umd"
        },
        devServer: {
            publicPath: '/dist'
        }
    }, isProduction
        ? require("./webpack.prod")
        : require("./webpack.dev"));
};