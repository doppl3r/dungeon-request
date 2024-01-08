# Notes
These notes are designed to help brainstorm the game architecture and ideas.

## Multiplayer
- Requirements
  - Peer-to-peer
  - Authoritative (1 host, multiple guests)
  - Seamless (if you disconnect, you resume session)
- Classes
  - Server.js
    - Peer.js
    - Session.js