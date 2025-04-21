# Kuromoji Dictionary Files

This directory should contain the dictionary files required by Kuromoji.js for Japanese text analysis.

## How to get the dictionary files

1. Download the dictionary files from the Kuromoji.js repository:
   https://github.com/takuyaa/kuromoji.js/tree/master/dict

2. Place all the files directly in this directory (not in a subdirectory)

3. The required files include:
   - cc.dat.gz
   - check.dat.gz
   - tid.dat.gz
   - tid_map.dat.gz
   - tid_pos.dat.gz
   - unk.dat.gz
   - unk_char.dat.gz
   - unk_compat.dat.gz
   - unk_invoke.dat.gz
   - unk_map.dat.gz
   - unk_pos.dat.gz

## Troubleshooting

If you see errors like "Failed to load dictionary" or "Cannot read properties of undefined", make sure:

1. All dictionary files are present in this directory
2. The files are correctly copied to the build directory during deployment
3. The files are accessible via the correct URL path in your deployed application

For more information, refer to the Kuromoji.js documentation:
https://github.com/takuyaa/kuromoji.js
