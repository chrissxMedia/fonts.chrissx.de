import 'dart:io';

final fonts = {
  'Impact': {
    eot('https://db.onlinewebfonts.com/t/6330ddc0d8e61db73c521dbe6288743b.eot?#iefix'),
    woff2(
        'https://db.onlinewebfonts.com/t/6330ddc0d8e61db73c521dbe6288743b.woff2'),
    ttf('https://db.onlinewebfonts.com/t/6330ddc0d8e61db73c521dbe6288743b.ttf'),
  },
  'Inter': {
    woff(
        'https://fonts.gstatic.com/s/inter/v3/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'),
  },
  'Ubuntu': {
    woff2(
        'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKfw72nU6AFw.woff2'),
  },
  'Unifont': {
    otf('fonts/unifont-14.0.03.otf'),
    ttf('fonts/unifont-14.0.03.ttf'),
  },
  'Minecraft': {
    woff(
        'https://db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.woff'),
  },
  'Woodcut': {
    ttf('fonts/Woodcut.ttf'),
  },
};

List<String> eot(String url) => [url, 'embedded-opentype'];
List<String> otf(String url) => [url, 'opentype'];
List<String> ttf(String url) => [url, 'truetype'];
List<String> woff(String url) => [url, 'woff'];
List<String> woff2(String url) => [url, 'woff2'];

String getCss(MapEntry<String, Set<List<String>>> font) {
  var css = '@font-face {';
  css += 'font-family: ' ' + font.key + ' '; ';
  css += 'src: local(' ' + font.key + ' ')';
  for (final file in font.value) {
    css += ', url(' + file[0] + ') format(' ' + file[1] + ' ')';
  }
  css += '; }';
  return css;
}

void main() {
  Directory('dist').createSync();
  File('dist/index')
      .writeAsString(fonts.entries.map(getCss).reduce((x, y) => '$x\n$y'));
  for (final font in fonts.entries)
    File('dist/${font.key.toLowerCase()}').writeAsString(getCss(font));
}
