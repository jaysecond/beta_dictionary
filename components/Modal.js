import React from 'react';
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { ScrollView, Linking, View, Text, StyleSheet } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';

class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      content: ''
    }
  }

  componentWillMount() {
    this.setState({title: this.props.title});
    this.setState({content: this.props.content});
  }

  renderBackComponent() {
    return (
      <Icon 
        name='arrow-back' 
        onPress={() => this.props.goBack}
        color='grey'
        underlayColor='#a9a9a9'
        containerStyle={styles.circle}
      />
    )
  }

  render() {
    let title = this.props.title;
    return (
    <View>
      <Header
        leftComponent={this.renderBackComponent()}
        centerComponent={{ text: this.props.title, style: {fontSize: 20} }}
        backgroundColor='#ffffff'
        goBack={this.props.goBack}
      />
      <ScrollView style={{ backgroundColor: '#fff', margin: 10, marginBottom: 130 }}>
        <Text style={{ alignSelf: 'flex-start', fontSize: 15 }}>{this.props.content}</Text>
      </ScrollView>
    </View>
    );
  }
}


const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    backgroundColor: 'transparent',
    margin: -10
  }
});


export default Modal