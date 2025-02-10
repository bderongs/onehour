#!/bin/bash

# Create a temporary HTML file
cat > temp.html << EOF
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 2rem;
      transform: scale(4);
    }
    .logo {
      height: 3.5rem;
      width: 3.5rem;
    }
    .name {
      font-weight: 600;
      font-size: 2.25rem;
      line-height: 1;
      color: rgb(49 46 129);
    }
  </style>
</head>
<body>
  <div class="brand">
    <img src="../public/favicon.svg" class="logo" />
    <span class="name">Sparkier</span>
  </div>
</body>
</html>
EOF

# Generate PNG using pageres with quadrupled dimensions
npx pageres temp.html 1280x528 --crop --filename=brand-logo --overwrite

# Move the file to the correct location
mv brand-logo.png ../public/images/

# Clean up
rm temp.html 
