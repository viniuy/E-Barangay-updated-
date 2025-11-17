#!/bin/bash

# Fix class-variance-authority imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/class-variance-authority@[0-9.]\+/class-variance-authority/g' {} +

# Fix @radix-ui imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/@radix-ui\/\([^@]*\)@[0-9.]\+/@radix-ui\/\1/g' {} +

# Fix lucide-react imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/lucide-react@[0-9.]\+/lucide-react/g' {} +

# Fix react-day-picker imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/react-day-picker@[0-9.]\+/react-day-picker/g' {} +

# Fix embla-carousel-react imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/embla-carousel-react@[0-9.]\+/embla-carousel-react/g' {} +

# Fix sonner imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/sonner@[0-9.]\+/sonner/g' {} +

# Fix vaul imports
find ./components -name "*.tsx" -type f -exec sed -i '' 's/vaul@[0-9.]\+/vaul/g' {} +

echo "Import fixes complete!"
