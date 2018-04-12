import * as WebpackDevServer from "webpack-dev-server";
import * as Webpack from "webpack";
import * as path from "path";

function rel(relativePath: string) {
    return path.join(__dirname, relativePath);
}

const devServerConfig: WebpackDevServer.Configuration = {
    contentBase: rel("public/"),
    historyApiFallback: true,
    stats: "minimal",
    overlay: true
};

const config: Webpack.Configuration = {
    mode: "development",
    entry: {
        index: rel("src/index.ts"),
        styles: rel("src/styles.ts")
    },
    output: {
        publicPath: "dist/",
        path: rel("public/dist/"),
        filename: "[name].js"
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.vue$/, loader: "vue-loader" },
            { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
            { test: /\.(png|jpg|gif|svg)$/, loader: "file-loader", options: { name: "[name].[ext]?[hash]" } },
            { test: /\.(ttf|woff|woff2|eot|otf)$/, loader: "file-loader", options: { name: "[name].[ext]?[hash]" } }
        ]
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js",
            "@": rel("src/")
        },
        extensions: ["*", ".js", ".ts", ".vue", ".json"]
    },
    devServer: devServerConfig,
    devtool: "eval"
};

export default config;
