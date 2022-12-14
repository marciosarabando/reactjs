# cleanup last version
rm -rf __deployme
mkdir __deployme

# build
sh scripts/build.sh

# minify js
minify bundle.js > __deployme/bundle.js

# minify css
minify bundle.css > __deployme/bundle.css

# copy html and images
cp index.html __deployme/index.html
cp -r images/ __deployme/images/

# done
date; echo;

