import React from 'react'
import Script from 'react-load-script'
import _ from 'lodash'
import { generateBeat, generateBeatWithSynth } from '../lib/beat-generator'

const scriptList = [
  'https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js',
  // Drums
  'https://surikov.github.io/webaudiofontdata/sound/12836_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12840_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12841_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12842_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12846_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12848_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12851_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12856_6_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/12877_6_JCLive_sf2_file.js',

  // Other Instruments
  'https://surikov.github.io/webaudiofontdata/sound/0390_Aspirin_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0480_Chaos_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0550_Chaos_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/0750_SBLive_sf2.js',
  'https://surikov.github.io/webaudiofontdata/sound/0140_JCLive_sf2_file.js',
  'https://surikov.github.io/webaudiofontdata/sound/1160_JCLive_sf2_file.js',
];

export default class WebAudioFont extends React.Component {

  constructor(props) {
    super(props);
    this.scriptLatch = scriptList.length;

    this.beat = {
      started: false,
      startTime: 0,
      bpm: 90
    }

    this.beat.N = 4 * 60 / this.beat.bpm;
    this.beat.pieceLen = 1 * this.beat.N;
    this.beat.len = 1/24 * this.beat.N;
    this.beat.volume = 0.4;

    this.bassEnabled = false;
    this.groove1Enabled = false;
    this.groove2Enabled = false;
    this.masterVolume = 1.0;

  }

  handleScriptLoad() {
    if(this.scriptLatch - 1 > 0) {
      this.scriptLatch -= 1;
    } else {
      if(window) {
        const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        this.player = new WebAudioFontPlayer();

        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_36_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_40_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_42_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0390_Aspirin_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0480_Chaos_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_46_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_48_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_51_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_56_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_drum_77_6_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0550_Chaos_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0750_SBLive_sf2');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0140_JCLive_sf2_file');
        this.player.loader.decodeAfterLoading(this.audioContext, '_tone_1160_JCLive_sf2_file');

        // 0090
        
        this.gainDrums = this.audioContext.createGain();
        this.gainDrums.connect(this.audioContext.destination);
        this.gainDrums.gain.value=0.5;

        this.gainSynth = this.audioContext.createGain();
        this.gainSynth.connect(this.audioContext.destination);
        this.gainSynth.gain.value=0.3;

        this.gainBass = this.audioContext.createGain();
        this.gainBass.connect(this.audioContext.destination);
        this.gainBass.gain.value=0.7;

        this.gainHit = this.audioContext.createGain();
        this.gainHit.connect(this.audioContext.destination);
        this.gainHit.gain.value=0.5;
        
        
        for(var i=0; i<_tone_0480_Chaos_sf2_file.zones.length; i++){
          _tone_0480_Chaos_sf2_file.zones[i].ahdsr=false;
        }

        this.beat.notes = generateBeat({
          orchestra: (pitch, duration) => {
            return { gain: this.gainHit, preset:_tone_0550_Chaos_sf2_file, pitch:pitch, duration: duration * this.beat.N };
          },
          synth: (pitch, duration) => {
            return {gain: this.gainSynth,preset:_tone_0480_Chaos_sf2_file,pitch:pitch,duration:duration * this.beat.N};
          },
          bass: (pitch, duration) => {
            return {
              gain: this.gainBass,
              preset:_tone_0390_Aspirin_sf2_file,
              pitch: pitch, 
              duration: duration * this.beat.N,
              volume: this.bassEnabled ? 1.0 : 0.0
              // volume: 0.0
            };
          },
          drum: () => {
            return {gain: this.gainDrums,preset:_drum_36_6_JCLive_sf2_file,pitch:36,duration:1};
          },
          snare: () => {
            return {gain: this.gainDrums,preset:_drum_40_6_JCLive_sf2_file,pitch:38,duration:1};
          },
          hihat: () => {
            return {gain: this.gainDrums,preset:_drum_42_6_JCLive_sf2_file,pitch:42,duration:1};
          },
          open: () => {
            return {gain: this.gainDrums,preset:_drum_46_6_JCLive_sf2_file,pitch:46,duration:1};
          },
          kitchenware1: (pitch, duration) => {
            return {
              gain: this.gainHit,preset:_tone_0140_JCLive_sf2_file,pitch:pitch,duration:duration * this.beat.N,
              // volume: this.bassEnabled ? 1.0 : 0.0
              volume: 0.0
            };
          },
          kitchenware2: () => {
            return {gain: this.gainHit,preset:_tone_1160_JCLive_sf2_file,pitch:36,duration: 0.3};
          },
          kitchenware3: () => {
            return {gain: this.gainHit,preset:_tone_0140_JCLive_sf2_file,pitch:97,duration:1};
          }
        });

        if (this.props.onSoundFontsLoaded) {
          this.props.onSoundFontsLoaded();
        }
        
      }
    }
  }

  startBeat() {    
    if (this.beat.started) {
      console.log('started already');
    } else {
      this.updateGains();
      this.beat.started = true;
      this.beat.startTime = this.audioContext.currentTime + 0.1;
      this.nextPiece();
      this.beat.startTime += this.beat.pieceLen;
      setInterval(() => {
        if (this.audioContext.currentTime > this.beat.startTime - 1 / 4 * this.beat.N) {
          this.nextPiece();
          console.log('nextPiece');
          this.beat.startTime += this.beat.pieceLen;
        }
      }, 20);
    }
  }

  stopBeat() {
    this.beat.notes = [];
  }

  nextPiece() {
    const notes = this.beat.notes;
    for (var n = 0; n < notes.length; n++) {
      const beat = notes[n];
      for (var i = 0; i < beat.length; i++) {
        if (beat[i]) {
          console.log(beat[i].volume)
          this.player.queueWaveTable(
            this.audioContext,
            beat[i].gain, beat[i].preset,
            this.beat.startTime + n * this.beat.len,
            beat[i].pitch, 
            beat[i].duration, 
            beat[i].volume || 1.0
          );
        }
      }
    }
  }

  playNote(pitch, volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _tone_0750_SBLive_sf2, 0, pitch, 0.75, vol);
  }

  playSnare(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_40_6_JCLive_sf2_file, 0, 35, 3, vol);
  }

  playHihat(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_46_6_JCLive_sf2_file, 0, 35, 3, vol);
  }

  playBassDrum(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_36_6_JCLive_sf2_file, 0, 36, 3, vol);
  }

  playTom(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_48_6_JCLive_sf2_file, 0, 35, 3, vol);
  }

  playRide(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_51_6_JCLive_sf2_file, 0, 51, 3, vol);
  }

  playCowbell(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_56_6_JCLive_sf2_file, 0, 56, 3, vol);
  }

  playWoodBlock(volume) {
    const vol = volume || 1.0;
    this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_77_6_JCLive_sf2_file, 0, 77, 3, vol);
  }

  playDrumsWithLabel(label, volume) {
    if(label === 'snare') this.playSnare(volume);
    else if(label === 'tom') this.playTom(volume);
    else if(label === 'hihat') this.playHihat(volume);
    else if(label === 'ride') this.playRide(volume);
    else if(label === 'bassdrum') this.playBassDrum(volume);
  }

  setBassEnabled(enabled) {
    this.bassEnabled = enabled
    this.updateGains();
  }

  setGroove1Enabled(enabled){
    this.groove1Enabled = enabled
    this.updateGains();
  }

  setGroove2Enabled(enabled){
    this.groove2Enabled = enabled
    this.updateGains();
  }

  setMasterVolume(volume) {
    this.masterVolume = volume;
    this.updateGains();
  }

  updateGains() {
    this.gainDrums.gain.value=0.5 * this.masterVolume;
    this.gainSynth.gain.value= (this.groove2Enabled ? 0.3: 0.0) * this.masterVolume;
    this.gainBass.gain.value= (this.bassEnabled ? 0.7: 0.0) * this.masterVolume;
    this.gainHit.gain.value= (this.groove1Enabled ? 0.5: 0.0) * this.masterVolume;
  }

  render() {
    return (
      <div>
        {_.map(scriptList, scr => (
          <Script url={scr} onLoad={this.handleScriptLoad.bind(this)} key={scr}/>
        ))}
      </div>
      );
  }

}