#!/bin/bash
# Push schedule.html to GitHub API
CONTENT=$(cat /Users/hanasilva/Documents/Apps_Antigravity_Day1/schedule.html | base64)
SHA="d267c6cf3f27eabb916fa4d143f3e9a8b62ea1f9"

curl -X PUT \
  -H "Authorization: token $(cat /Users/hanasilva/.github_token 2>/dev/null || echo '')" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/teamvasta/day-one-academy/contents/schedule.html \
  -d "{
    \"message\": \"Update schedule: Mon/Wed 6:15AM to All Levels, Fri 6:15AM to NOGI All Levels\",
    \"content\": \"$(echo "$CONTENT" | tr -d '\n')\",
    \"sha\": \"$SHA\",
    \"branch\": \"Hana\"
  }"
