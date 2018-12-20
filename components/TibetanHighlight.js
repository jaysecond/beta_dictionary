import React from 'react';
import { View, Text, } from 'react-native';
import Highlighter from 'react-native-highlight-words';

class TibetanHighlight extends React.PureComponent {

  state = {
    searchWords: this.props.searchWords,
    textToHighlight: this.props.textToHighlight,
    highlightStyle: this.props.highlightStyle,
    style: this.props.style,
  };


  adjustHighlightWord(term, textToHighlight) {
    // check for ུ ྲ ྒ ྱ ོ  ྟ ླ  ེ   ི
    let regex = new RegExp('[ེ ི]*'+term+'[ྟླུྲྒྱོ ི]*','g');

    let resultArray = textToHighlight.match(regex);
    if (resultArray==null) {
      return [term];
    } else {
    	return resultArray;
    }
  }

  render() {

    let highlightWords = this.adjustHighlightWord(this.state.searchWords, this.state.textToHighlight);

    return (
	    <Highlighter
	        style={this.state.style}
	        highlightStyle={this.state.highlightStyle}
	        searchWords={highlightWords}
	        textToHighlight={this.state.textToHighlight}
	    />
    );
  }
}


export default TibetanHighlight