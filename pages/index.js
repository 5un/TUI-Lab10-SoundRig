import React from 'react'
import ReactDOM from 'react-dom'
import WebAudioFont from '../components/web-audio-font'
import globalCss from '../css/global.css.js'
import { Button, Score } from '../components/elements'
import _ from 'lodash'
const  scale = require('music-scale')
const noteToNumber = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

export default class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isFrontEnd: false,
      analogInput: 0,
      score: 0,
      triggeredKey: -1,
      useDancePad: false,
    }
    
    this.scaleNotes = [];
    const sc = scale('pentatonic', 'C')
    for(var i = 6; i < 7; i++) {
      this.scaleNotes = _.concat(this.scaleNotes, _.map(sc, n => (12 * i + noteToNumber[n])))
    }
  }

  componentDidMount() {
    this.setState({ isFrontEnd: true })
  }

  renderWS() {
    if(this.state.isFrontEnd) {
      const Websocket = require('react-websocket');
      return (<Websocket url='ws://localhost:8080/' onMessage={this.handleData.bind(this)}/>);
    }
  }

  handleData(data) {
    let result = JSON.parse(data);
    if(result.event ==='sensor' && this.webAudioFont) {
      if(result.pot1) {
        this.webAudioFont.setMasterVolume(result.pot1 / 1024);
      }
      if(result.fsr1) {
        const normalized = result.fsr1 / 1024
        this.webAudioFont.playNote(this.scaleNotes[Math.floor(normalized * this.scaleNotes.length)], 0.5);
      }
    }
  }

  handlePercussionClicked(e) {
    console.log (e.target.name);
    if(e.target.name === 'p1') {
      this.webAudioFont.playCowbell();
    } else if(e.target.name === 'p2') {
      this.webAudioFont.playWoodBlock();
    }
  }

  handleMouseMove(e) {
    // const triggeredKey = Math.floor(e.screenX * 5 / 1280.0);
    // this.setState({ triggeredKey })
  }

  handleStartButtonClicked() {
    this.webAudioFont.startBeat();
    // this.perspectiveTracks.startBeat();
    // this.setState({ gameState: GAME_STATE_STARTED })

  }

  handleControlsChanged(e) {
    if(e.target.name === 'bassOn') {
      this.webAudioFont.setBassEnabled(e.target.checked);
    } else if(e.target.name === 'masterVolume') {
      this.webAudioFont.setMasterVolume(e.target.value / 100)
    } else if(e.target.name === 'kitchenWare1On') {
      this.webAudioFont.setKitchenWareEnabled(e.target.checked)
    }
  }

  render() {
    const { analogInput, isFrontEnd, triggeredKey, gameState, score } = this.state;
    const fullscreenStyle = { position: 'absolute', left: 0, top: 0, width: '100vw' };
    return (
      <div onMouseMove={this.handleMouseMove.bind(this)}>
        <style jsx global>{globalCss}</style>
        <h1>Kitchen Tunes</h1>
        <div>
          <h2>Start beat</h2>
          <Button onClick={this.handleStartButtonClicked.bind(this)}>Start</Button>
        </div>
        <div>
          <h2>Controls</h2>
          <div>
            <input type="checkbox" onChange={this.handleControlsChanged.bind(this)} name="bassOn" value={true} /> <label>Bass</label> 
          </div>
          <div>
            <input type="checkbox" onChange={this.handleControlsChanged.bind(this)} name="kitchenWare1On" value={true} /> <label>Percussive Kitchenware Set 1</label> 
          </div>
          <div>
            <input type="checkbox" onChange={this.handleControlsChanged.bind(this)} name="kitchenWare2On" value={true} /> <label>Percussive Kitchenware Set 2</label> 
          </div>
          <div>
            Master Volume<br />
            <input type="range" min="0" max="100" class="slider" id="myRange" name="masterVolume" onChange={this.handleControlsChanged.bind(this)} />
          </div>
          <button onClick={this.handlePercussionClicked.bind(this)} name="p1" >Percussion 1</button>
          <button onClick={this.handlePercussionClicked.bind(this)} name="p2" >Percussion 2</button>
          <button onClick={this.handlePercussionClicked.bind(this)} name="p3" >Percussion 3</button>
          <h2></h2>
          
        </div>
        {this.renderWS()}
        <WebAudioFont ref={(ref) => {this.webAudioFont = ref}}/>
      </div>
    );
  }

}