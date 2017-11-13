import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const PianoPadContainer = styled.div `
  text-align: center;
  background-color: black;
  padding: 10px 0px;
`;

const PianoWhiteKey = styled.button`
  appearance: none;
  display: inline-block;
  background-color: white;
  border: 2px solid bold;
  height: 200px;
  width: 6.25%;
  vertical-align: top;
  z-index: 1;
  border-radius: 4px;
  outline: 0;
`;

const PianoBlackKey = styled.button`
  appearance: none;
  display: inline-block;
  background-color: black;
  border: 2px solid bold;
  height: 100px;
  width: 6.25%;
  margin: 0 -3.125%;
  vertical-align: top;
  z-index: 2;
  border-radius: 4px;
  outline: 0;
`;

const blackKeys = [1, 3, 6, 8, 10];
const keyboardMapping = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j','k','o','l','p',';','[','\''];

export default class PianoPad extends React.Component {

  constructor(props) {
    super(props);
    // numOctaves
    // startingOctave
  }

  onPianoKeyPushed(note) {
    console.log(note);
    if(this.props.onNotePushed) {
      this.props.onNotePushed(note);
    }
  }

  onKeyDown(e) {
    const startingOctave = this.props.startingOctave || 3;
    const keyIndex = keyboardMapping.indexOf(e.key);
    if (keyIndex > -1){
      const note = startingOctave * 12 + keyIndex;
      if(this.props.onNotePushed) {
        this.props.onNotePushed(note);
      }
    }
    
  }

  componentDidMount(){
    if (window) {
      window.document.addEventListener("keydown", (e) => (this.onKeyDown(e)));
    }
  }

  componentWillUnmount() {
    if (window) {
      window.document.removeEventListener("keydown", (e) => (this.onKeyDown(e)));
    }
  }

  render() {
    const numOctaves = this.props.numOctaves || 2;
    const startingOctave = this.props.startingOctave || 3;
    const keys = _.range(12 * startingOctave, 12 * (startingOctave + numOctaves));

    return (
      <PianoPadContainer>
        {_.map(keys, k => (
          _.indexOf(blackKeys, k % 12) > -1 ?
            <PianoBlackKey onClick={this.onPianoKeyPushed.bind(this, k)} key={k}></PianoBlackKey>:
            <PianoWhiteKey onClick={this.onPianoKeyPushed.bind(this, k)} key={k}></PianoWhiteKey>
        ))}
      </PianoPadContainer>
    );
  }

}