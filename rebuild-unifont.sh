#!/usr/bin/env bash
set -euo pipefail
repo="$2"
version="$1"
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
work=$PWD

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

cmp "$otfdir/unifont.otf" "$repo/fonts/unifont-$version.otf"
echo "OTF matches; rebuilt fonts are in $work/unifont-$version/font"
