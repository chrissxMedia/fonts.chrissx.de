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

Run `npm run rebuild-unifont` on Linux to rebuild Unifont 18.0.01 and generate
its OTF, TTF and WOFF2 subsets using the ranges in `fonts.yaml`. It needs `curl`,
`sha256sum`, GCC, Make, Perl, FontForge, and `pyftsubset` from
`pip install 'fonttools[woff]==4.63.0' 'brotli==1.2.0'`.
The script checks the rebuilt OTF byte for byte and leaves the full fonts intact.
Use `npm run rebuild-unifont -- 14.0.03` to rebuild and subset version 14.

The TTF is sensitive to FontForge's version and timestamps. For 14.0.03,
FontForge 20201107 produces a different character map, while 20251009 changes
the outlines.
FontForge 20220308 matches the font data, but an exact match also requires its
2022-03-08 build timestamp and the font's creation and modification timestamps
from 2022-05-10. To match the checked-in TTF, set `ModificationTime` in the
generated `.sfd` file to 2022-05-10 11:17:31 UTC, then export the TTF again.
