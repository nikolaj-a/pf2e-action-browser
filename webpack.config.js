const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/typescript/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    "sass-loader"
                ],
            },
        ],
    },
    optimization: {
        minimize: false
    },
    output: {
        clean: true,
        filename: "scripts/pf2e-action-browser.mjs",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename:"styles/pf2e-action-browser.css",
        }),
        new CopyPlugin({
            patterns: [
                "module.json",
                { "from": "src/lang/en.json", "to": "lang/en.json" },
                { "context": "src/handlebars/", "from": "**/*.hbs", "to": "templates" }
            ],
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};
