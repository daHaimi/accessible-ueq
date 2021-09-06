export default {
  plugins: [
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-proposal-decorators", {
      decoratorsBeforeExport: true
    }]
  ],
  presets: [
    ["@babel/preset-env", { targets: { node: 'current' }}],
  ],
}
