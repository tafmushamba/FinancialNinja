#!/bin/bash

# This script removes sensitive information from the .env file in Git history

git filter-branch --force --index-filter '
    git ls-files -z "*.env" | 
    xargs -0 -I{} sh -c "git show HEAD:{} | 
    sed \"s/GOOGLE_CLIENT_ID=\\\".*\\\"/GOOGLE_CLIENT_ID=\\\"REMOVED\\\"/g\" |
    sed \"s/GOOGLE_CLIENT_SECRET=\\\".*\\\"/GOOGLE_CLIENT_SECRET=\\\"REMOVED\\\"/g\" |
    sed \"s/MISTRAL_API_KEY=\\\".*\\\"/MISTRAL_API_KEY=\\\"REMOVED\\\"/g\" |
    git update-index --add --cacheinfo 100644,\$(git hash-object -w --stdin),{}"
' --tag-name-filter cat -- --all

# Clean up the repository
git for-each-ref --format="delete %(refname)" refs/original/ | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
