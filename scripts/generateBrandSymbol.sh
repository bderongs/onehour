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
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .symbol {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      transform: scale(6);
    }
    .logo {
      height: 4rem;
      width: 4rem;
    }
    .logo svg {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="symbol">
    <div class="logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        fill="none"
        stroke="#312e81"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 4V1"/>
        <path d="M12 23v-3"/>
        <path d="M1 12h3"/>
        <path d="M20 12h3"/>
        <path d="M17.7 17.7 20 20"/>
        <path d="M12 12h.01"/>
        <path d="M17.7 6.3 20 4"/>
        <path d="M6.3 17.7 4 20"/>
        <path d="M6.3 6.3 4 4"/>
      </svg>
    </div>
  </div>
</body>
</html>
EOF

# Generate PNG using pageres with large dimensions for high quality
npx pageres temp.html 512x512 --crop --filename=brand-symbol --overwrite

# Move the file to the correct location
mv brand-symbol.png public/images/

# Clean up
rm temp.html 
