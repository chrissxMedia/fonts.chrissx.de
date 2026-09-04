#!/usr/bin/env node
import yaml from 'yaml';
import fs from 'fs';

const formatLut = {
    eot: 'embedded-opentype',
    otf: 'opentype',
    ttf: 'truetype',
};

function formatToCss([format, url]) {
    if (format === 'local') return `local(${url})`;
    return `url(${url})format(${formatLut[format] ?? format})`;
}

function getCss(font, formats) {
    let css = '@font-face{';
    css += `font-family:${font};`;
    css += `src:${formats.map(formatToCss).join(',')}`;
    css += '}';
    return css;
}

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");

const document = yaml.parseDocument(fs.readFileSync('fonts.yaml', 'utf8'), {
    uniqueKeys: false,
});
if (document.errors.length) throw document.errors[0];
const fonts = document.contents.items.map(({ key, value }) => [
    key.value,
    value.items.map(({ key, value }) => [key.value, value.value]),
]);
fs.writeFileSync('dist/index', fonts.map((f) => getCss(...f)).join(""));
for (const [font, formats] of fonts) {
    fs.writeFileSync('dist/' + font.toLowerCase(), getCss(font, formats));
}

fs.cpSync("fonts", "dist/fonts", { recursive: true });
