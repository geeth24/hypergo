#!/bin/bash
echo "Creating iOS configuration profile..."

# Create the mobileconfig file
cat > hypergo.mobileconfig << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<!-- Configuration content here -->
</plist>
EOF

echo "Configuration profile created as 'hypergo.mobileconfig'"
echo "Instructions:"
echo "1. Host this file on your server at https://go.geethg.com/hypergo.mobileconfig"
echo "2. Users can visit that URL on their iOS device to install the profile"
echo "3. Settings -> General -> VPN & Device Management to trust the profile" 