echo "== Static Syntax Check: Node.js =="
set -e
# Find all .js files and check syntax
find . -type f -name "*.js" -print0 | xargs -0 -n1 node --check
echo "All JS files passed syntax check."
