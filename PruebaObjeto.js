
const clientId = '';
const clientSecret ='';

class queue {
    constructor() {
        this.items = [];
    }
    enqueue(cancion) {
        this.items.push(cancion);
    }
    dequeue() {
        return this.items.shift();
    }
    mostrar() {
        return this.items;
    }
}

class APIController {
    constructor() {
    }

    async getToken() {
       let token= await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: 'grant_type=client_credentials'+ '&client_id=' + clientId + '&client_secret=' + clientSecret,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
            }
            
        })
        .then(response => response.json())
        
        return token.access_token;
    }

    async getTopTracks(token, cola) {
        const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10';
        
        let track = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        })
        .then(response => response.json());
        
        let tracks = track.items;

        for (let i = 0; i < tracks.length; i++) {
            cola.enqueue(tracks[i].name
            + ' by ' + tracks[i].artists.map(artist => artist.name).join(', '));
        }
        return cola;}

}

const api = new APIController();
let cola = new queue();
let token = await api.getToken();
 cola = await api.getTopTracks(token, cola);

//REPRODUCCION DE LA COLA
for (let i = 0; i < cola.length; i++) {
    console.log('Reproduciendo: ' + cola.dequeue());
} await api.getTopTracks(token, cola);
