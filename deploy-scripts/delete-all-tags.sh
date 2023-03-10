if ! git ls-remote origin --quiet; then
  echo "you do not have a working remote at origin"
  echo "doing nothing"
  exit
fi

function confirm() {
  # call with a prompt string or use a default
  read -r -p "${1:-Are you sure? [y/N]} " response
  case "$response" in
    [yY][eE][sS]|[yY])
        true
        ;;
    *)
        false
        ;;
  esac
}


confirm "Do you really want to delete all tags local and remote?" || exit
confirm "Do you really know exactly which repo you are in?" || exit
confirm "Do you value your job, are you sure you are sure?" || exit
confirm "Do you realize you have a family that needs your income?" || exit
confirm "Have I asked for enough confirmations, should I delete all tags?" || exit


git tag -d $(git tag -l)               # delete all local tags first
git fetch                              # get up to date tags from remote
git push origin --delete $(git tag -l) # push the deletion of the tags to remote
git tag -d $(git tag -l)               # now delete all local tags again

