import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack, { Configuration } from "webpack";
import { version } from "./package.json";

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const buildTime = new Date().toISOString();

//const frontendPort = parseInt(process.env.PORT || "8080");

type Environment = "development" | "production" | "none";
type WebpackPlugin = { apply(...args: unknown[]): void };

const environment = process.env.NODE_ENV
  ? (process.env.NODE_ENV as Environment)
  : "development";
const isProd = environment === "production";

const isTest = JSON.parse(process.env.TEST || "false");

const config: Configuration = {
  entry: {
    index: "./src/index.ts",
  },
  mode: environment,
  devtool: isProd || isTest ? undefined : "inline-source-map",

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_DATE: JSON.stringify(buildTime.split("T")[0]), // format: 2021-10-19
      BUILD_TIME: JSON.stringify(buildTime.split("T")[1].split(".")[0]), // format: 15:15:48
      BUILD_DATETIME: JSON.stringify(buildTime), // format: 2021-10-19T15:15:48.944Z
      COMMIT_HASH: JSON.stringify(process.env.COMMIT_HASH || "dev"),
      PRODUCTION: JSON.stringify(isProd),
      SEED: JSON.stringify(process.env.SEED),
      VERSION: JSON.stringify(process.env.VERSION || `v${version}` || "dev"),
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "Dungeon of slan",
      template: "src/static/index.html",
      favicon: "src/static/images/favicon.png",
      inject: true,
      minify: false,
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }) as WebpackPlugin,
  ],
  stats: !isTest,
  infrastructureLogging: {
    level: isTest ? "none" : "info",
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".js", ".ts", ".scss"],
  },
};

export default config;