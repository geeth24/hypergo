# HyperGo

A lightweight, self-hosted URL shortening service designed for internal team use. Create memorable shortcuts to frequently accessed resources within your organization.

## Key Features:
- Create custom short links (e.g., go/firebase) for any URL
- Track usage with built-in click analytics
- RESTful API for easy integration
- Real-time shortcut management (create, update, view stats)
- Persistent storage of shortcuts and analytics
- Automatic port management for reliable deployment
- CORS-enabled for cross-origin requests

## Technical Highlights:
- Built with Express.js and TypeScript for reliability and type safety
- JSON-based storage for simple deployment and maintenance
- Health monitoring endpoint
- Automatic fallback port selection if default port is in use
- Static file serving for web interface

## Use Cases:
- Simplify access to internal documentation
- Create memorable links for frequently used tools and resources
- Track which resources are most accessed by your team
- Streamline sharing of long URLs in your organization
