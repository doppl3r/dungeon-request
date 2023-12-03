import { Peer } from 'peerjs';
import { MathUtils } from 'three';

class Network {
  constructor(prefix = '') {
    this.prefix = prefix;
    this.isHost = false;
    this.setTick(10);
  }

  open(id, callback = function(){}) {
    // Generate new id
    if (id == null) id = MathUtils.generateUUID();

    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(this.prefix + id); // Generate random ID
    this.peer.on('open', callback);
    this.peer.on('error', function(error){ console.log(error); }.bind());
  }

  host(id_host) {
    // Open connection and listen to guests
    this.open(id_host, function(id) {
      // Display peer id
      console.log(id);

      // Listen to guest connections
      this.peer.on('connection', function(conn) {
        this.isHost = true;

        // Add open listener
        conn.on('open', function() {
          console.log('Guest has connected', conn);
        }.bind(this));

        // Add disconnection listener
        conn.on('close', function() {
          console.log('Guest disconnected');
        }.bind(this));
    
        // Add inbound data listener
        conn.on('data', function(data) {
          console.log(data);
        }.bind(this));

        // Add connection error listener
        conn.on('error', function(error) {
          console.log(error);
        });
      });
    }.bind(this));
  }

  join(id_host) {
    // Open a connection and connect to a host
    this.open(null, function(id) {
      console.log(id);
      
      // Begin connection
      var conn = this.peer.connect(this.prefix + id_host);

      // Add open listener
      conn.on('open', function() {
        console.log('You are connected to the host', conn);
      }.bind(this));

      // Add disconnection listener
      conn.on('close', function() {
        console.log('Host disconnected');
      }.bind(this));
  
      // Add inbound data listener
      conn.on('data', function(data) {
        console.log(data);
      }.bind(this));

      // Add connection error listener
      conn.on('error', function(error) {
        console.log(error);
      });
    }.bind(this));
  }

  update(data) {
    //console.log(data);
  }

  setTick(tick = 10) {
    this.tick = tick;
  }
}

export { Network };