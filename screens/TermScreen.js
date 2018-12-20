import React from 'react';
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { ScrollView, Modal, Linking, View, Text, StyleSheet } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { queryForTerm } from '../bus/QueryMethods.js';
import Highlighter from 'react-native-highlight-words';
import TibetanHighlight from '../components/TibetanHighlight.js'

class TermScreen extends React.Component {

  constructor(props)
    {
      super(props);

      this.state = { 
          termData: {},
          lexeme: "",
          phonetics: "",
          defs: {},
          termAudio: "",
          searchTerm: '',
          color: '',
       }

       this.lightGrey = '#333333';
       this.midGrey = '#777777';
    }


  componentWillMount() {
      const { navigation } = this.props;

      //initial values
      const termData = navigation.getParam("termData", null);
      const searchTerm = navigation.getParam("searchTerm", '');
      const color = navigation.getParam("color", '#555555');
      console.log("searchTerm "+searchTerm);

      this.setState({
          termData: termData,
          lexeme: termData.lx,
          phonetics: termData.ph,
          defs: Object.values(termData.def),
          // related: termData.sm,
          termAudio: termData.sf2,
          searchTerm: searchTerm,
          color: color,
      })

      //NOTE: Android: Save your sound clip files under 
      // the directory android/app/src/main/res/raw. 
      // Note that files in this directory must be lowercase and 
      // underscored (e.g. my_file_name.mp3) and that subdirectories 
      // are not supported by Android.
  }

  renderExampleSentence = (example, i) => {
    console.log(example.sf);

    // Add extra space if audio file
    var space="";
    if (example.sf) {
      space="      ";
    }

    return (

       <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}} key={i}>
         <View style={{width: 1, backgroundColor: '#777777', marginLeft: 25, marginRight: 16 }}></View>

         <View style={{flexDirection: 'column', marginRight: 60}}>

            <View style={{flexDirection: 'row'}}>

              <View>
              { !!example.xv &&
                <TibetanHighlight
                  style={{ fontSize: 18 }}
                  highlightStyle={{color: this.state.color}}
                  searchWords={this.state.searchTerm}
                  textToHighlight={space+example.xv}
                />
              }
              { !!example.sf && 
                <Icon
                  name='volume-up'
                  onPress={() => this.playAudio(example.sf)}
                  containerStyle={{
                    marginTop: -2,
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                  }}
                />
              }
              </View>
              
            </View>

            { !!example.xn &&
              <Highlighter
                style={{ fontSize: 14, marginTop: 10, lineHeight:20}}
                highlightStyle={{color: this.state.color}}
                searchWords={[this.state.searchTerm]}
                textToHighlight={example.xn}
              />
            }

            { !!example.xe && 
              <Highlighter
                style={{ fontSize: 14, marginTop: 10}}
                highlightStyle={{color: this.state.color}}
                searchWords={[this.state.searchTerm]}
                textToHighlight={example.xe}
              />
            }

         </View>
       </View>
    )
  }

  renderDefinition = (def, i) => {

    return (        
        <View style={{flexDirection: 'column', alignSelf: 'stretch', marginTop: 10}} key={i}>



        { !!def.de &&
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            { this.state.defs.length>1 ?
              <Text style={{ height:30, width: 20, backgroundColor: '#eeeeee', padding: 5}}>
              {i+1}
              </Text>
              :<View></View>
            }
            <Text style={{ fontSize: 18, color: '#777777'}}> {def.ps} </Text>
            <Highlighter
              style={{ flex: 1, fontSize: 18}}
              highlightStyle={{color: this.state.color}}
              searchWords={[this.state.searchTerm]}
              textToHighlight={def.de}
            />
          </View>
        }


         { !!def.gn &&
          <View style={{flexDirection: 'row', marginBottom: 10}}>

            { this.state.defs.length>1 ?
              <View style={{ width: 20, backgroundColor: '#fffff'}}></View>
              :<View></View>
            }

           <Text style={{ fontSize: 18, color: '#777777', paddingLeft: -2 }}> {def.pn} </Text>
            <Highlighter
              style={{ fontSize: 18, paddingRight: 20, marginTop: 2}}
              highlightStyle={{color: this.state.color}}
              searchWords={[this.state.searchTerm]}
              textToHighlight={def.gn}
            />
         </View>
         }

         { !!def.le &&
          <View style={{flexDirection: 'row', marginBottom: 10}}>
           <Text style={{ fontSize: 20, color: '#777777', paddingLeft: 2 }}> {'lit.'} </Text>
            <TibetanHighlight
              style={{ fontSize: 18, paddingRight: 20}}
              highlightStyle={{color: this.state.color}}
              searchWords={this.state.searchTerm}
              textToHighlight={def.le}
            />
         </View>
         }

         { !!Object.keys(def.ex).length>0 &&
            Object.values(def.ex).map(this.renderExampleSentence)
         }

         { !!def.sm &&
           <View style={{marginRight: 15, marginLeft: 2 }}>
             <View style={{flexDirection: 'row'}}>

                { this.state.defs.length>1 ?
                  <View style={{ width: 20, backgroundColor: '#fffff'}}></View>
                  :<View></View>
                }

                <Icon
                  name='arrow-forward'
                  onPress={() => this.getRelatedTerm(def.sm)}
                  color='#777777'
                  containerStyle={{
                    marginTop: -2,
                  }}
                />
               <Button 
                 title={def.sm} 
                 containerViewStyle={{ marginLeft: -8, marginBottom: 4 }} 
                 textStyle={{ fontSize: 18}} 
                 transparent={true} 
                 color='#777777'
                 onPress={() => this.getRelatedTerm(def.sm)}/>
             </View>
           </View>
         }

         { !!def.rt &&
           <View style={{marginRight: 15, marginLeft: 2}}>
             <View style={{flexDirection: 'row'}}>

                { this.state.defs.length>1 ?
                  <View style={{ width: 20, backgroundColor: '#fffff'}}></View>
                  :<View></View>
                }

                <Icon
                  name='arrow-forward'
                  onPress={() => this.getRelatedTerm(def.rt)}
                  color='#777777'
                  containerStyle={{
                    marginTop: -2,
                  }}
                />
               <Button 
                 title={def.rt} 
                 containerViewStyle={{ marginLeft: -8, marginBottom: 4 }} 
                 textStyle={{ fontSize: 18}} 
                 transparent={true} 
                 color='#777777'
                 onPress={() => this.getRelatedTerm(def.rt)}/>
             </View>
           </View>
         }

        </View>
    );
  }

  getChinesePS(partOfSpeech) {
    return '名';
  }

  async getRelatedTerm(related) {
    const termData = await queryForTerm(related);
    if(Object.keys(termData).length > 0){
      this.props.navigation.push('TermScreen', { 
        termData: termData[0],
        searchTerm: related,
        color: this.state.themeColor, 
      })
    }
  }

  render() {

    return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      <View style={styles.container}>
        <View style={styles.term}>

          <TibetanHighlight
            style={{ fontSize: 40, paddingLeft: 5}}
            highlightStyle={{color: this.state.color}}
            searchWords={this.state.searchTerm}
            textToHighlight={this.state.lexeme}
          />
          <Text style={{ fontSize: 20, color: '#777777', margin: 12 }}>{this.state.phonetics}</Text>
          { !!this.state.termAudio &&
            <Icon
              name='volume-up'
              onPress={() => this.playAudio(this.state.termAudio)}
            />
          }
        </View>

        { 
          !!this.state.defs.length>0 ? 
            this.state.defs.map(this.renderDefinition)
          : <View></View>
        }
      </View>
    </ScrollView>
    );
  }

  playAudio(file) {
    console.log('play audio '+file);
    // Import the react-native-sound module
    var Sound = require('react-native-sound');

    // Enable playback in silence mode
    Sound.setCategory('Playback');

    console.log('loading the file... '+file);
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var audioSample = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      // loaded successfully
      console.log('duration in seconds: ' + audioSample.getDuration() + 'number of channels: ' + audioSample.getNumberOfChannels());
      
      // Play the sound with an onEnd callback
      audioSample.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          audioSample.reset();
        }
      });
    });
  }
}



const styles = StyleSheet.create({
  term: {
    flexDirection: 'row', 
    marginBottom: 10, 
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },

  container: {
    flex:1,
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent: 'flex-start',
    padding:20,
    backgroundColor: '#ffffff',
    overflow: 'scroll'
  },

  lowerContainer: {
    flex:1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  text: {
    fontSize: 20,
    marginBottom: 10,
    justifyContent: 'flex-start',
  }
});


export default TermScreen