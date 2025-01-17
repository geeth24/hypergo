#!/bin/bash
echo "Adding go to hosts file..."
sudo sh -c 'echo "192.168.1.71 go" >> /etc/hosts'
echo "Done! Try using http://go in your browser"