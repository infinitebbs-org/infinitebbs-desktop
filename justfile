# https://just.systems

# Run the Tauri development server without file watching
dev:
    bun tauri dev --no-watch

# Push to remote repository
push:
    git push origin main
    git push bitbucket main
    git push sourcehut main

update:
    bun update
    cd frontend && bun update
    cd backend && cargo update

default:
    echo 'Hello, world!'
