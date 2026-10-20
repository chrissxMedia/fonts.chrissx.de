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

function getCss(font, formats, unicodeRange) {
    let css = '@font-face{';
    css += `font-family:${font};`;
    css += `src:${formats.map(formatToCss).join(',')};`;
    if (unicodeRange) css += `unicode-range:${unicodeRange};`;
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
    (yaml.isSeq(value) ? value.items : [value]).map((face) =>
        face.items.map(({ key, value }) => [key.value, value.value]),
    ),
]);
let css = '';
for (const [font, faces] of fonts) {
    const fontCss = faces.map((formats) => getCss(
        font,
        formats.filter(([key]) => key !== 'unicode-range'),
        formats.find(([key]) => key === 'unicode-range')?.[1],
    )).join('');
    fs.writeFileSync('dist/' + font.toLowerCase(), fontCss);
    css += fontCss;
}
fs.writeFileSync('dist/index', css);

fs.cpSync("fonts", "dist/fonts", { recursive: true });
