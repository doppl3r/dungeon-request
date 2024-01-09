# Notes
These notes are designed to help brainstorm the game architecture and ideas.

## Multiplayer
- Requirements
  - Peer-to-peer
  - Authoritative (1 host, multiple guests)
  - Seamless (if you disconnect, you resume session)
- Classes
  - Network.js
    - Host.js
      - Session.js
    - Client.js