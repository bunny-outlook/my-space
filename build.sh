eval "$(ssh-agent -s)"
ssh-add ~/.ssh/ankushkaudi_github_outlook

ng build && npx angular-cli-ghpages --dir=/dist/app/browser

# Ownership Update
