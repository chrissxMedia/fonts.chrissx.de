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

Run this on Linux from the repository root. Set `version` to either `14.0.03`
or `18.0.01`. It needs `curl`, `sha256sum`, GCC, Make, Perl, and FontForge.
The 14.0.03 OTF is checked byte for byte. The 18.0.01 build copies its OTF and
TTF into `fonts/`; neither TTF is compared byte for byte.

```bash
set -euo pipefail
repo=$PWD
version=18.0.01
case "$version" in
  14.0.03)
    sha256=d4000ad1858a45b80980a3f6b91aa3cd73855d01e0f8bd4785f8c65206e49feb
    otfdir=ttfsrc
    ;;
  18.0.01)
    sha256=eab60847aac34c8768765cecc7821faf50de2636187b452b9b5fa50a12b00bc3
    otfdir=otfsrc
    ;;
  *) echo "Unsupported Unifont version: $version" >&2; exit 1 ;;
esac
work=$(mktemp -d)
cd "$work"

curl -fsSLo unifont.tar.gz "https://ftp.gnu.org/gnu/unifont/unifont-$version/unifont-$version.tar.gz"
echo "$sha256  unifont.tar.gz" | sha256sum -c -
tar xzf unifont.tar.gz

make -C "unifont-$version/src" hex2otf
mkdir -p "unifont-$version/bin"
install -m 755 "unifont-$version/src/hex2otf" "unifont-$version/src/hex2sfd" "unifont-$version/bin/"

cd "unifont-$version/font"
LC_ALL=C sort plane00/{unifont-base,spaces,plane00-nonprinting,custom00}.hex > ttfsrc/unifont.hex
cat plane00/copyleft.hex >> ttfsrc/unifont.hex
cp plane00/plane00-combining.txt ttfsrc/combining.txt
if [ "$otfdir" != ttfsrc ]; then
  cp ttfsrc/{unifont.hex,combining.txt} "$otfdir/"
fi
make -C "$otfdir" otf
make -C ttfsrc ttf

if [ "$version" = 14.0.03 ]; then
  cmp "$otfdir/unifont.otf" "$repo/fonts/unifont-$version.otf"
else
  cp "$otfdir/unifont.otf" "$repo/fonts/unifont-$version.otf"
  cp ttfsrc/unifont.ttf "$repo/fonts/unifont-$version.ttf"
fi
echo "Built fonts are in $work/unifont-$version/font"
```

The TTF is sensitive to FontForge's version and timestamps. For 14.0.03,
FontForge 20201107 produces a different character map, while 20251009 changes
the outlines.
FontForge 20220308 matches the font data, but an exact match also requires its
2022-03-08 build timestamp and the font's creation and modification timestamps
from 2022-05-10. To match the checked-in TTF, set `ModificationTime` in the
generated `.sfd` file to 2022-05-10 11:17:31 UTC, then export the TTF again.
