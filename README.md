# fonts.chrissx.de

A simple font library.

## Licensing

The code (`deploy.js`) is [AGPLv3](LICENSE)-licensed. The produced CSS, i.e. the
files accessible at `fonts.chrissx.de/<font>`, shall be considered public domain
or [equivalent](https://opensource.org/license/unlicense).

### Fonts

Most fonts are hosted by third parties. Their websites shall be consulted for
licensing information:

- [Impact](https://www.onlinewebfonts.com/download/6330ddc0d8e61db73c521dbe6288743b)
- [Inter](https://fonts.google.com/specimen/Inter/license)
- [Mojangles](https://www.minecraftplot.com/fonts), aka. [Minecraft](https://www.onlinewebfonts.com/download/6ab539c6fc2b21ff0b149b3d06d7f97c)
- [Ubuntu](https://fonts.google.com/specimen/Ubuntu/license)

The following fonts are hosted by us at `fonts.chrissx.de/fonts/`:

- [Unifont](https://unifoundry.com/LICENSE.txt) (SIL Open Font License v1.1)
- [Woodcut](https://www.dafont.com/woodcut.font) (unclear licensing)

### Rebuild Unifont

Run this on Linux from the repository root. It needs `curl`, `sha256sum`, GCC,
Make, Perl, and FontForge. It checks the OTF byte for byte and builds
the TTF without comparing it.

```bash
set -euo pipefail
repo=$PWD
work=$(mktemp -d)
cd "$work"

curl -fsSLo unifont.tar.gz https://ftp.gnu.org/gnu/unifont/unifont-14.0.03/unifont-14.0.03.tar.gz
echo 'd4000ad1858a45b80980a3f6b91aa3cd73855d01e0f8bd4785f8c65206e49feb  unifont.tar.gz' | sha256sum -c -
tar xzf unifont.tar.gz

make -C unifont-14.0.03/src hex2otf
mkdir -p unifont-14.0.03/bin
install -m 755 unifont-14.0.03/src/{hex2otf,hex2sfd} unifont-14.0.03/bin/

cd unifont-14.0.03/font
LC_ALL=C sort plane00/{unifont-base,spaces,plane00-nonprinting,custom00}.hex > ttfsrc/unifont.hex
cat plane00/copyleft.hex >> ttfsrc/unifont.hex
cp plane00/plane00-combining.txt ttfsrc/combining.txt
make -C ttfsrc otf ttf

cmp ttfsrc/unifont.otf "$repo/fonts/unifont-14.0.03.otf"
echo "OTF matches; rebuilt fonts are in $work/unifont-14.0.03/font/ttfsrc"
```

The TTF is sensitive to FontForge's version and timestamps. FontForge 20201107
produces a different character map, while 20251009 changes the outlines.
FontForge 20220308 matches the font data, but an exact match also requires its
2022-03-08 build timestamp and the font's creation and modification timestamps
from 2022-05-10. To match the checked-in TTF, set `ModificationTime` in the
generated `.sfd` file to 2022-05-10 11:17:31 UTC, then export the TTF again.
