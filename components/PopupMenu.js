// import React from 'react';
// import { Component, AppRegistry } from React;
// import { TouchableOpacity, View, Text, StyleSheet, StatusBar, FlatList, ActivityIndicator } from 'react-native';

// const DropDown = require('react-native-dropdown');
// const {
//   Select,
//   Option,
//   OptionList,
//   updatePosition
// } = DropDown;

// class PopupMenu extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       option: ''
//     };
//   }

//   componentDidMount() {
//     updatePosition(this.refs['SELECT1']);
//     updatePosition(this.refs['OPTIONLIST']);
//   }

//   _getOptionList() {
//     return this.refs['OPTIONLIST'];
//   }

  
//   _option(selected) {

//   this.setState({
//       ...this.state,
//       option: selected
//     });
//   }

//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Select
//             width={250}
//             ref="SELECT1"
//             optionListRef={this._getOptionList.bind(this)}
//             defaultValue="Select a selected in option ..."
//             onSelect={this._option.bind(this)}>
//           </Select>

//           <Text>Selected provicne of option: {this.state.option}</Text>
          
//           <OptionList ref="OPTIONLIST"/>
//       </View>
//     );
//   }
// }

// export default PopupMenu;