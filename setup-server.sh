#!/bin/bash
# Deployment Script für Oracle Cloud

echo "🚀 Movie App Deployment Script"
echo "================================"

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funktion für farbigen Output
success() { echo -e "${GREEN}✓ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; }

# System Updates
echo ""
echo "📦 Schritt 1: System aktualisieren..."
sudo apt update && sudo apt upgrade -y
success "System aktualisiert"

# Docker Installation
echo ""
echo "🐳 Schritt 2: Docker installieren..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    success "Docker installiert"
else
    success "Docker bereits installiert"
fi

# Docker Compose Installation
echo ""
echo "🐳 Schritt 3: Docker Compose installieren..."
if ! command -v docker-compose &> /dev/null; then
    sudo apt install docker-compose -y
    success "Docker Compose installiert"
else
    success "Docker Compose bereits installiert"
fi

# Git Installation
echo ""
echo "📥 Schritt 4: Git installieren..."
if ! command -v git &> /dev/null; then
    sudo apt install git -y
    success "Git installiert"
else
    success "Git bereits installiert"
fi

# Firewall konfigurieren
echo ""
echo "🔥 Schritt 5: Firewall konfigurieren..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
success "Firewall Regeln hinzugefügt"

# Swap erstellen (wichtig für 1GB RAM)
echo ""
echo "💾 Schritt 6: Swap Space erstellen..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    success "2GB Swap erstellt"
else
    success "Swap bereits vorhanden"
fi

# App Verzeichnis erstellen
echo ""
echo "📁 Schritt 7: App Verzeichnis vorbereiten..."
mkdir -p ~/movie-app
cd ~/movie-app
success "Verzeichnis erstellt"

echo ""
success "✅ Server-Setup abgeschlossen!"
echo ""
warning "WICHTIG:"
echo "1. Logge dich neu ein: exit && ssh ..."
echo "2. Lade dein Projekt hoch (git clone oder scp)"
echo "3. Erstelle .env Datei mit deinen Credentials"
echo "4. Führe aus: docker-compose up -d"
echo ""
