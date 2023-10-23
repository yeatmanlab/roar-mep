const path = require("path");
const webpack = require("webpack");
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require("webpack-merge");
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { EsbuildPlugin } = require('esbuild-loader')

const commonConfig = {
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          },
          chunks: "all",
        },
      },
    },
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name][ext]",
        },
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              outputPath: "audio",
            },
          },
        ],
      },
      {
        test: /\.mp4$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "video",
            },
          },
        ],
      },
      {
        test: /\.csv$/,
        use: [
          {
            loader: "csv-loader",
            options: {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
            },
          },
        ],
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
};

const webConfig = merge(commonConfig, {
  entry: {
    index: path.resolve(__dirname, "serve", "serve.js"),
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: {
      keep: /\.git/,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "ROAR - MEP",
    }),
  ],
});

const productionConfig = merge(webConfig, {
  mode: "production",
});

const developmentConfig = merge(webConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
});

module.exports = async (env, args) => {
  const roarDB = env.dbmode === "production" ? "production" : "development";

  const envDependentConfig = {
    plugins: [
      new webpack.ids.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
      new webpack.DefinePlugin({
        ROAR_DB: JSON.stringify(roarDB),
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  };

  switch (args.mode) {
    case "development":
      return merge(developmentConfig, envDependentConfig);
    case "production":
      return merge(productionConfig, envDependentConfig);
    default:
      throw new Error("No matching configuration was found!");
  }
};
