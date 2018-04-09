import * as WebpackDevServer from "webpack-dev-server";
// import * as TypeScript from "typescript";
import * as Webpack from "webpack";
import * as path from "path";

function rel(relativePath: string) {
    return path.join(__dirname, relativePath);
}

// const typescriptConfig: TypeScript.CompilerOptions = {};

const devServerConfig: WebpackDevServer.Configuration = {
    contentBase: rel("public/"),
    historyApiFallback: true,
    overlay: true
};

const config: Webpack.Configuration = {
    mode: "development",
    entry: rel("src/app.ts"),
    output: {
        path: rel("public/dist/"),
        filename: "bundle.js",
        publicPath: "public/"
    },
    module: {
        rules: [
            { test: /\.vue$/, loader: "vue-loader" },
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
            { test: /\.(png|jpg|gif|svg)$/, loader: "file-loader", options: { name: "[name].[ext]?[hash]" } }
        ]
    },
    resolve: {
        alias: { vue$: "vue/dist/vue.esm.js" },
        extensions: ["*", ".js", ".ts", ".vue", ".json"]
    },
    devServer: devServerConfig,
    devtool: "source-map"
};

export default config;
