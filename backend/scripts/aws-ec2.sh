#!/bin/bash

# Exit on any error
set -e


# Update the system
echo "Updating the system..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
sudo yum install -y docker

# Start and enable Docker
echo "Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker


# Add the ec2-user to the docker group to avoid using sudo for Docker commands
echo "Adding the current user to the docker group..."
sudo usermod -aG docker $(whoami)
sudo systemctl restart docker
newgrp docker



# Variables
DOMAIN=""
WWW_DOMAIN=""
DOCKER_APP_PORT="8080"  
GITHUB_USERNAME="emrecan-y"
GITHUB_PAK=""
GITHUB_REPOSITORY="webgame"
GITHUB_CONTAINER_NAME="backend"

# Install Nginx
echo "Installing Nginx..."
sudo yum install -y nginx

# Install Certbot and dependencies
echo "Installing Certbot..."
sudo yum install -y certbot python3-certbot-nginx

# Start and enable Nginx
echo "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Obtain SSL certificate using Certbot
echo "Obtaining SSL certificate for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN

# Set up auto-renewal for Certbot SSL certificates
echo "Setting up auto-renewal for SSL certificates..."
sudo systemctl enable certbot.timer

# Ensure that the required variables are set
echo "Configuring Nginx as a reverse proxy..."


# Generate the Nginx config with variables expanded
CONFIG_CONTENT=$(cat <<EOL
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;

    access_log off;
    error_log off;

    # Redirect HTTP to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN $WWW_DOMAIN;

    access_log off;
    error_log off;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    location /session {
        proxy_pass http://localhost:$DOCKER_APP_PORT;

        # WebSocket specific headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

    }

    location / {
        return 404;
    }
}
EOL
)

# Write the expanded config to the Nginx configuration file using sudo
echo "$CONFIG_CONTENT" | sudo tee /etc/nginx/conf.d/$DOMAIN.conf > /dev/null


# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx to apply changes
echo "Reloading Nginx..."
sudo systemctl reload nginx


# Restart Nginx to apply SSL configuration
echo "Restarting Nginx to apply SSL configuration..."
sudo systemctl restart nginx

# Pull and start your Docker container (replace with your Docker image)
echo "Pulling Docker image and running container..."
if [ $(docker ps -q -f name=$GITHUB_CONTAINER_NAME) ]; then
    echo "Stopping and removing existing container..."
    docker stop $GITHUB_CONTAINER_NAME
    docker rm $GITHUB_CONTAINER_NAME
else
    echo "No existing container to stop and remove."
fi

docker login ghcr.io -u $GITHUB_USERNAME -p $GITHUB_PAK
docker pull ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY/$GITHUB_CONTAINER_NAME
docker run -d -p $DOCKER_APP_PORT:$DOCKER_APP_PORT --name $GITHUB_CONTAINER_NAME ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY/$GITHUB_CONTAINER_NAME


# Verify installation
echo "Docker, Nginx, and SSL setup complete. Please verify the following:"
echo "- Docker is running and the container is exposed on port $DOCKER_APP_PORT"
echo "- Nginx is configured to reverse proxy to Docker on port $DOCKER_APP_PORT"
echo "- SSL is configured and should be accessible at https://$DOMAIN"

# Display Docker, Nginx, and Certbot status
echo "Docker status:"
docker ps

echo "Nginx status:"
sudo systemctl status nginx

echo "SSL certificate status:"
sudo certbot certificates
