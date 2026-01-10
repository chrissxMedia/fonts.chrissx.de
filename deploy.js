#!/usr/bin/env node
import yaml from 'yaml';
import fs from 'fs';

const formatLut = {
    eot: 'embedded-opentype',
    otf: 'opentype',
    ttf: 'truetype',
};

function getCss(font, formats) {
    let css = '@font-face{';
    css += `font-family:${font};`;
    css += `src:local(${font})`;
    for (const [format, url] of Object.entries(formats)) {
        css += `,url(${url})format(${formatLut[format] ?? format})`;
    }
    css += '}';
    return css;
}

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");

const fonts = Object.entries(yaml.parse(fs.readFileSync('fonts.yaml', 'utf8')));
fs.writeFileSync('dist/index', fonts.map((f) => getCss(...f)).join(""));
for (const [font, formats] of fonts) {
    fs.writeFileSync('dist/' + font.toLowerCase(), getCss(font, formats));
}

fs.cpSync("fonts", "dist/fonts", { recursive: true });
