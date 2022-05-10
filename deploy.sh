#!/usr/bin/env sh

set -e

npm run build

cd dist

rm -rf .git
git init
git add .
git commit -m "New Deployment: `date`"
git push -f git@github.com:taufiknur/mapbox-vue-with-button.git master:gh-pages

cd -