import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = { 
      searchResults: [], 
      playlistName: 'New default playlist',
      playlistTracks: []
  };
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    //console.log("in remove track");
    let oldTracks = this.state.playlistTracks;
    //console.log("old list " + JSON.stringify(oldTracks));
    //console.log("atttempting to remove " + JSON.stringify(track) + " from " + JSON.stringify(oldTracks));
    let newTracks = oldTracks.filter(savedTrack => savedTrack.id !== track.id);
    //console.log("updated list " + JSON.stringify(newTracks));
    //let tracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({ playlistTracks: newTracks });
  }

  updatePlaylistName(newName) {
    console.log('changing the playlist name to ' + newName);
    this.setState( { playlistName : newName });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(jsonResponse => {
      console.log("Save successful! Clearing playlist- resposne" + JSON.stringify(jsonResponse));
      console.log("Playlist name before " + this.state.playlistName);
      console.log("Playlist tracks before " + JSON.stringify(this.state.playlistTracks));
      /*this.setState( {
        playlistName: 'New Playlist',
        playlistTracks: []
      });*/
      //this.setState( { playlistName: 'New Playlist' });
      this.updatePlaylistName('New Playlist');
      this.setState( { playlistTracks: [] });
      console.log("Playlist name is now " + this.state.playlistName);
      console.log("Playlist tracks is now " + JSON.stringify(this.state.playlistTracks));
      
    });
  }

  search(searchTerm) {
    console.log("User searched " + searchTerm);
    Spotify.search(searchTerm).then(results => {
      this.setState( { searchResults: results });
    });
  }

  render(){
    //console.log("In app - playlist " + JSON.stringify(this.state.playlistTracks));
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName} 
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
