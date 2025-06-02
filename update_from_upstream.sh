# filepath: update_from_upstream.sh
#!/bin/bash
# Script to update the local master branch from the upstream repository

# Ensure you are in the correct repository directory before running
# For example, cd /Users/Shared/Repos/cem-qr-sink

echo "Fetching changes from upstream..."
git fetch upstream

echo "Checking out master branch..."
git checkout master

echo "Merging changes from upstream/master..."
git merge upstream/master

# Check if the merge was successful before pushing
if [ $? -eq 0 ]; then
  echo "Merge successful. Pushing to origin/master..."
  git push origin master
  echo "Update complete."
else
  echo "Merge failed. Please resolve conflicts and then manually push."
  echo "To resolve conflicts: edit files, then 'git add .', then 'git commit'."
  echo "After resolving and committing, run 'git push origin master'."
fi