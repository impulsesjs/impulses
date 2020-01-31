set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read VERSION
else
  VERSION=$1
fi

echo "Release TAG : $RELEASE_TAG"

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  if [[ -z $SKIP_TESTS ]]; then
    npm run lint
    npm run test:cov
  fi

  # build
  VERSION=$VERSION npm run build && npm run build:norm

  # commit
  # TODO: update with required files
  git add -A
  git add -f lib/*.js
  git commit -m "build: build $VERSION"
  # generate release note
  npm run release:note -- $VERSION
  # tag version
  npm version $VERSION --message "build: release $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  if [[ -z $RELEASE_TAG ]]; then
    echo "Publishing NPM ..."
    npm publish
  else
    echo "Publishing NPM (tag=$RELEASE_TAG) ..."
    npm publish --tag $RELEASE_TAG
  fi
fi