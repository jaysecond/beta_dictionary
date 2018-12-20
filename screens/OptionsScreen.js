import React from 'react';
import Modal from '../components/Modal.js'; 
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Tabs from 'react-native-tabs';
import { Options, Titles } from '../bus/OptionsContent.js';
import { Header, Icon, Button } from 'react-native-elements';

class OptionsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      language:'English',
      title: '',
      content: ''
    };
  }

  componentWillMount() {
    this.switch_language(this.state.language);
  }

  switch_language(language) {
    const { navigation } = this.props;
    this.setState({language: language});

    let title = language + navigation.getParam("title", '');

    this.setState({title: Titles[title]});
    this.setState({content: Options[title]});
    this.props.navigation.setParams({otherParam: Titles[title]});
  }

  render() {
    let title = this.state.language + this.props.title;
    return (
      <View style={styles.container}>
        { !!this.state.title !== 'Map' ?
          <View>
            <ScrollView style={{ backgroundColor: '#fff', margin: 10, marginBottom: 130 }}>
              <Text style={{ alignSelf: 'flex-start', fontSize: 15 }}>{this.state.content}</Text>
            </ScrollView>
            <Tabs selected={this.state.language} style={{backgroundColor:'white'}}
                  selectedIconStyle={{borderTopWidth:2, borderTopColor:'red'}} onSelect={el=>this.switch_language(el.props.name)}>
                <Text name="English">English</Text>
                <Text name="Chinese">中文</Text>
                {/*<Text name="Tibetan">བོད་སྐད།</Text>*/}
            </Tabs>
          </View>
          : <View></View>
        }
      </View>
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('otherParam', 'title'),
      headerTitleStyle: { fontWeight: 'normal', alignSelf: 'center'},
    };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    margin: 0,
  }
});

export default OptionsScreen;