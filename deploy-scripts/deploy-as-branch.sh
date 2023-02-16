#!/bin/bash

if [ $# -lt 3 ]; then
    echo "Usage $0 <src branch> <target branch> <message>"
    echo ""
    echo "where:"
    echo "        <  srcbranch > exists on origin"
    echo "        <targetbranch> presumably exists on origin as a deployment target branch"
    echo "        <   message  > explains motivation for deployment"
    exit 1
fi

echo "--- let's do this ---"


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

# exits with or without an explicit message
function die() {
  echo "Exiting: ${1:-No explicit reason}"
  exit 1
}


# test if the branch is in the local repository.
# return 1 if the branch exists in the local, or 0 if not.
function missing_local_branch() {
    local existed_in_local
    existed_in_local=$(git branch --list "${1}")

    if [[ -z ${existed_in_local} ]]; then
        return 0
    fi
    return 1
}

# test if the branch is in the remote repository.
# return 1 if its remote branch exists, or 0 if not.
function missing_remote_branch() {
    local existed_in_remote
    existed_in_remote=$(git ls-remote --heads origin "${1}")

    if [[ -z ${existed_in_remote} ]]; then
       return 0
    fi
    return 1
}

function finish {
  echo "---- cleaning up ----"

  # first ensure that any temporary branch created is deleted
  if ! missing_local_branch "$L_SRC"; then
    echo "Deleting temporary branch $L_SRC..."
    git branch -D "$L_SRC" || echo "Could not delete temporary branch ${L_SRC}"
  fi

  # now ensure that having pushed a remote tag or not, we really don't need it here and now locally
  if ! [ -z "$TAG_NAME" ] ; then
      echo "Deleting local copy of tag $TAG_NAME..."
      git tag -d "${TAG_NAME}" || echo "Could not delete local copy of tag $TAG_NAME..."
  fi
  echo "-------- done -------"

}
trap finish EXIT

# ----- actual script logic starts here ----

if ! [ -d .git ]; then
  die "${0} requires that you run from the root of a git project"
fi;

#determine relative path of script from where script is running
#DIRSCRIPT=$( dirname -- "${BASH_SOURCE[0]}" )

#if [ "${DIRSCRIPT}" == "./deploy-scripts" ]; then
#  die "You may not run this script from inside ./deploy-scripts, but must run from the root"
#fi


if ! git ls-remote origin --quiet; then
  die "${0} requires that you have a *working* git remote called 'origin'"
fi

GIT_ORIGIN_REPONAME=$(basename $(git remote show -n origin | grep Fetch | cut -d: -f2-))


O_SRC=$1                       # first argument is a source branch (that must exist on origin)
O_TGT=$2                       # second argument is target branch, presumably one whose purpose is to act as deployment trigger
NNN=$(date +%s%N | cut -b1-13) # milliseconds type timestamp for temporary branch name
L_SRC="${O_SRC}-temp-${NNN}"   # name of local copy of origin source branch (so no impact on your current branch)

# A series of sanity checks, you cannot have src=dst, dst=master, target a branch not matching the naming convention deploy/*
if [ "${O_TGT}" == "main" ]; then
  die "deploying to branch 'main' is a no-no"
fi

if [ "${O_TGT}" == "${O_SRC}" ]; then
  die "deploying '${O_TGT}' to itself sounds just wrong"
fi

echo "For the present, ${0} has disabled requirement that target branch be named deploy/*"

#if [[ $O_TGT != deploy/* ]]; then
#  die "branch '${O_TGT}' doesn't match expected target branch pattern 'deploy/*'"
#fi


# you have to confirm this is what you want to do
confirm "Repo: '$GIT_ORIGIN_REPONAME' Set origin '${O_TGT}' to be identical to origin '${O_SRC}'?" || die


if missing_remote_branch "$O_SRC" ; then
  die "the remote branch you are using as a source (${O_SRC}) is missing"
fi

echo "Creating local branch '${L_SRC}'"
git fetch origin "${O_SRC}:${L_SRC}" || die  #update local branch as copy of origin branch

if missing_local_branch "$L_SRC" ; then
  die "temporary local branch '${L_SRC}' could not be created"
fi


COMMIT=$(git rev-parse "$L_SRC")  #get hash for tip of branch we are deploying

# check if the deployment is effectively a no-op (target already has this branch)
TGT_STAT=$(git ls-remote origin | egrep "refs/heads/${O_TGT}$") # find if target exists

read -r -d '' MSG_ALREADY_SET << EOM
  Your target branch '${O_TGT}' is already set to COMMIT ${COMMIT:0:6}

  Just to be clear, we aren't doing this, since it doesn't do anything
EOM

if [ "${TGT_STAT:0:10}" == "${COMMIT:0:10}" ]; then die $MSG_ALREADY_SET; fi

# get user name and email
MYNAME=$(git config -l | grep 'user.name')
MYNAME="${MYNAME##*=}"

MYEMAIL=$(git config -l | grep 'user.email')
MYEMAIL="${MYEMAIL##*=}"

ZONE=America/New_York  # we are using new york time for reporting (for now)
DT=$(date -u +"%Y-%m-%d %T")            #get the time just before pushing
TAG_DT=$(echo "${DT: -17}" |tr -d ':-'| tr ' ' '-')   #remove tag illegal characters for use in tag itself
TAG_NAME="d-${TAG_DT}-${O_TGT}-${COMMIT:0:6}"

ANNOTATION="${MYNAME} <${MYEMAIL}> deployed ${O_SRC}@${COMMIT:0:6} to ${O_TGT} ${3}"

read -r -d '' ANNOTATION << EOM
${COMMIT:0:6} has been "deployed" by resetting branch ${O_TGT}
-
  who: ${MYNAME} <${MYEMAIL}>
 when: ${DT} (UTC)
 what: "deployed" ${O_SRC}@${COMMIT:0:6}
where: to branch ${O_TGT}
  why: ${3}
  how: deploy-as-branch.sh pushed branch and tagged
EOM

echo "Pushing branch ${O_TGT} and assigning tag ${TAG_NAME}"
git tag -a "${TAG_NAME}" "${L_SRC}" --cleanup=verbatim -m "${ANNOTATION}" || die

#git branch --quiet --set-upstream-to origin/"${O_TGT}" "${L_SRC}"
git push --quiet --no-progress --force origin "${L_SRC}:${O_TGT}" >/dev/null|| die
git push --quiet origin "${TAG_NAME}" || echo "Could not push tag ${TAG_NAME}"

# trap finish should provide the exit messages, test this on git bash to see if it all works

