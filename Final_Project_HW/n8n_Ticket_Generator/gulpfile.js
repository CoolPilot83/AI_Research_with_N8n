const { src, dest } = require('gulp');

function buildIcons() {
  return src('nodes/**/icon.svg').pipe(dest('dist/nodes'));
}

exports.build = buildIcons;
exports['build:icons'] = buildIcons;

