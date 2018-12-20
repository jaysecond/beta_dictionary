import React from 'react';
import { TouchableOpacity, View, Text, StyleSheets } from 'react-native';
import Search from 'react-native-search-box';

// reference for Search box: https://github.com/agiletechvn/react-native-search-box

const rowHeight = 60;  

class SearchHeader extends React.PureComponent {

  state = {
    searchTerm: '',
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  _onChangeText = (text) => {
    console.log("changedText: "+text);
  	this.setState({searchTerm:text});
  	// this.props.onChangeText(text);
    // try {
    //   this.props.onSearch(this.state.searchTerm);
    // } catch (e) {
    //     console.warn("error searching: "+e);
    // }
  };

  _onDelete = () => {
  	this.setState({searchTerm:''})
  };

  _onCancel = (text) => {
  	this.setState({searchTerm:''})
  };


  _onClear = () => {
  	this.props.onClear();
  }

  _onSubmitSearch = () => {
    try {
      // console.log("searched: "+this.state.searchTerm);
      this.props.onSearch(this.state.searchTerm);
    } catch (e) {
      console.warn("error searching: "+e);
    }
  }

    renderRow = (item, sectionId, index) => {
      return (
        <TouchableHightLight
          style={{
            height: rowHeight,
            justifyContent: 'center',
            alignItems: 'center'}}
        >
          <Text>{item.name}</Text>
        </TouchableHightLight>
      );
    }

    // Important: You must return a Promise
    beforeFocus = () => {
        return new Promise((resolve, reject) => {
            console.log('beforeFocus');
            resolve();
        });
    }

    // Important: You must return a Promise
    onFocus = (text) => {
        return new Promise((resolve, reject) => {
            console.log('onFocus', text);
            resolve();
        });
    }

    // Important: You must return a Promise
    afterFocus = () => {
        return new Promise((resolve, reject) => {
            console.log('afterFocus');
            resolve();
        });
    }

  render() {
    // suggestions list

    //  <View>
    //{!!this.state.searchTerm && 
    //   <Text style={{margin: 5}}>{this.state.searchTerm}</Text>}
    //{!!this.state.searchTerm && <Text style={{margin: 5}}>{this.state.filteredList}</Text>}
    //  </View>
        

    return (
      <View style={{ backgroundColor:'#eeeeee'}}>
        <Search
    			ref="search_box"
    			titleCancelColor = '#777777'
    			tintColorSearch = '#777777'
    			tintColorDelete = '#777777'
    			backgroundColor = '#fff'
          blurOnSubmit = {true}
    			onChangeText = {this._onChangeText}
    			onDelete = {this._onDelete}
    			onCancel = {this._onCancel}
          onSearch={this._onSubmitSearch}
    			searchIconCollapsedMargin = {35}
    			placeholderExpandedMargin = {35}
        />
        <View> 
        </View>
      </View>
    );
  }
}

export default SearchHeader