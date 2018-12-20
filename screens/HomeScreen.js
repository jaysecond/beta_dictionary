import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StatusBar, FlatList, ActivityIndicator, Picker } from 'react-native';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { Icon, Button } from 'react-native-elements';
import SearchHeader from '../components/SearchHeader.js';
import CardView from '../components/CardView.js';
import PopupMenu from '../components/PopupMenu.js';
import { queryForTerms, queryForTerm } from '../bus/QueryMethods.js';
import CreateDB from '../db/CreateDB';
// import DropDown, { Select, Option, OptionList, updatePosition } from 'react-native-dropdown';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searchTerm: 'ཀ',
      isSearching: false,
      themeColor: '#ff5050',
    };
    this.cancelSearchFlag = false;
    this.queryPromise = null;
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#dddddd",
        }}
      />
    );
  }

  sendQuery(term) {
    if (term==null || term.length<=0) {
      return;
    }
    console.log("sending query for "+term);

    if (this.queryPromise!=null) {
      this.queryPromise.cancel();
      console.log("canceled search");
    }

    this.setState({isSearching: true});
    this.queryPromise = queryForTerms(term);
    this.queryPromise
      .promise
      .then((response) => this.onResultsReceived(response.term, response.results))
      .catch((reason) => console.log('isCanceled', reason));

    /*
    try {
      if(term === this.state.searchTerm) {
        this.setState({isSearching: true});
        this.queryPromise = await queryForTerms(term);

        if(term === this.state.searchTerm && this.queryPromise!=null) {
          // this.setState({searchResults: this.queryPromise});
          console.log("------------ setting searchResults for  "+term+" results are : "+this.queryPromise.promise);
        }
        // console.log("searchlist: "+this.state.searchResults);
        this.setState({isSearching: false});
      } 
    }
    catch(e) {
        console.log("Error searching: "+e);
    }*/
  }

  onResultsReceived(term, results) {
    if(term === this.state.searchTerm) {
      this.setState({searchResults: results});
      console.log("------------ setting "+results.length+" searchResults for  "+term);  
      setTimeout(()=> {
 
        this.setState({isSearching: false});
 
      }, 10);
    }
  }

  cancelSearch() {
    this.cancelSearchFlag = true;
  }

  componentWillMount() {
    this.sendQuery(this.state.searchTerm);
  }

  async onSelectItem(lx) {
    console.log("onSelectItem "+lx)
    termData = await queryForTerm(lx);

    this.props.navigation.navigate('TermScreen', {
      termData: termData[0],
      searchTerm: this.state.searchTerm,
      color: this.state.themeColor,
    })
  }
  

  onSearch(text) {
    this.setState({searchTerm: text});
    this.sendQuery(text);
  }

  renderRow(item) {
    return ( 
      <CardView 
        title={item.lx} 
        color={this.state.themeColor} 
        sub={item.sub}
        searchTerm={this.state.searchTerm}
        onPressItem={this.onSelectItem.bind(this, item.lx)} 
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>

       <StatusBar
         backgroundColor="white"
         barStyle="dark-content"
       />

      {!!this.state.isSearching && 
        <ActivityIndicator style={styles.loading} size="small" color={this.state.themeColor} />
      }

       <SearchHeader
        ref={(ref) => this.searchBar = ref}
        clearIcon={{ color: 'red' }}
        searchIcon={false} // You could have passed `null` too
        onChangeText={(text) => console.log(text)}
        onClear={() => console.log("onClear")}
        placeholder='Search Here...'
        onSearch={(text) => this.onSearch(text)}/>

      {!!this.state.isSearching && !!(Object.keys(this.state.searchResults).length === 0) && 
          <Text style={{textAlign: 'center'}}>No Results Found</Text>
        
      }

      {!!!this.state.isSearching && 
        <FlatList
          style={{height:100}}

          data={ this.state.searchResults }

          ItemSeparatorComponent = {this.FlatListItemSeparator}

          keyExtractor={(item, index) => item.lx}

          renderItem={({item}) => this.renderRow(item)}

          initialNumToRender={5}
          />
      }
      </View>
    );
  }

  static navigationOptions = ({navigation, navigationOptions }) => {
    const { params } = navigation.state;
    const options = ['About'];
    // const options = ['About', 'Guide', 'Map']

    //Picker: https://facebook.github.io/react-native/docs/picker#itemstyle
    return {
    title: '首页',
    headerRight: (
      <Picker
        mode='dropdown'
        selectedValue={options[0]}
        style={{ height: 50, width: 100 }}
        onValueChange={(itemValue) => navigation.navigate('OptionsScreen', {title: itemValue})}>
        <Picker.Item label='About' value='About' />
      </Picker>
    ),
  };

};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center'
  },
});

export default HomeScreen