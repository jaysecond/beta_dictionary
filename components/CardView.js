import React from 'react';
import { TouchableOpacity, View, Text, StyleSheets, FlatList } from 'react-native';
import Highlighter from 'react-native-highlight-words';
import TibetanHighlight from './TibetanHighlight.js';

class CardView extends React.PureComponent {


  state = {
    title: this.props.title,
    sub: this.props.sub,
    // phonetic: this.props.phonetic,
    searchTerm: this.props.searchTerm,
    color: this.props.color,
  };

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  highlighter(col, str, key) {
    return <TibetanHighlight
              key={key}
              style={col}
              highlightStyle={{color: this.state.color}}
              searchWords={this.state.searchTerm}
              textToHighlight={str}
            />
  }

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={ containerStyle() }>

          { this.highlighter(titleTextStyle('#222222'), this.state.title, 0) }

          { this.state.sub.map((item, index) => {
              return this.highlighter(subTextStyle('#777777'), '' + item, index);
            })
          }
        
        </View>
      </TouchableOpacity>
    );
  }
}


titleTextStyle = function(myColor) {

  return {
      flex: 1,
      fontSize: 22,
      color: myColor,
      paddingBottom: 5,
      paddingLeft: 5,
      backgroundColor: '#ffffff',
    }
}


subTextStyle = function(myColor) {

  return {
      flex: 1,
      fontSize: 16,
      paddingTop: 5,
      paddingLeft: 5,
      color: myColor,
      backgroundColor: '#ffffff',
    }
}


containerStyle = function() {
  return {
    flexDirection: 'column',
    padding: 20,
  }
}

export default CardView