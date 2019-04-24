import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ToastAndroid} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from "react-native-sound";
import ControlsButton from "./ControlsButton";

import cover from "./highoctane.jpg";
import Play from "./Icons/play.png";
import Pause from "./Icons/pause.png";
import FastForward from "./Icons/fast_forward.png"
import VolumeDown from "./Icons/Volume/volume_down.png";
import VolumeMute from "./Icons/Volume/volume_mute.png";
import VolumeOff from "./Icons/Volume/volume_off.png";
import VolumeUp from "./Icons/Volume/volume_up.png";

Sound.setCategory('Playback');
type Props = {};

export default class MainView extends Component<Props> {
  static navigationOptions = {
    title: 'Daniel Wawiórka - Odtwarzacz muzyki',
    headerStyle: {
      backgroundColor: '#5c5c5c',
    },
    headerTintColor: '#fff',
  };

  state = {
    duration: 255,
    elapsed: 0,
    isPlaying: false,
    volume: 100
  };

  music: Sound = null;

  componentDidMount(): void {
    this.music = new Sound('bensound_highoctane.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      this.setState({duration: this.music.getDuration()});
    });
  }

  onPlayPauseClick = () => {
    const {isPlaying} = this.state;

    if (isPlaying) {
      this.music.pause(() => {
        this.setState({isPlaying: false});
      })
    } else {
      this.music.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          this.setState({isPlaying: false})
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      this.setState({isPlaying: true});
      setTimeout(this.updateCurrentTime, 500);
    }
  };

  onFastForwardClick = () => {
    ToastAndroid.show('Ta funkcjonalność nie jest jeszcze wspierana', ToastAndroid.SHORT);
  };

  updateCurrentTime = () => {
    const {isPlaying} = this.state;
    if (!isPlaying) return;
    console.log("Interval!");
    this.music.getCurrentTime(seconds => {
      this.setState({elapsed: seconds});
      setTimeout(this.updateCurrentTime, 450);
    });
  };

  setCurrentTime = (newProgress) => {
    const {duration} = this.state;
    const newTime = newProgress * duration;
    this.setState({elapsed: newTime});
    this.music.setCurrentTime(newTime);
  };

  setVolume = (newProgress) => {
    const volume = newProgress * 100;
    this.setState({volume: volume});
    this.music.setVolume(newProgress);
  };

  getVolumeIcon = () => {
    const {volume} = this.state;

    if (volume === 0) {
      return VolumeOff;
    } else if (volume < 40) {
      return VolumeMute;
    } else if (volume < 75) {
      return VolumeDown;
    } else {
      return VolumeUp;
    }
  };

  render() {
    const {elapsed, duration, isPlaying, volume} = this.state;

    const durationTime = secondsToTime(duration);
    const elapsedTime = secondsToTime(elapsed);

    const volumeIcon = this.getVolumeIcon();

    return (
      <View style={styles.container}>
        <Image source={cover} style={{width: 300, height: 300, marginTop: 50}} />
        <Text style={{color: "#FFF", fontSize: 20, marginTop: 10}}>Bensound - High Octane</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.text}>{elapsedTime}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            value={elapsed / duration}
            maximumValue={1}
            minimumTrackTintColor="#FFF"
            maximumTrackTintColor="#000"
            onSlidingComplete={this.setCurrentTime}
          />
          <Text style={styles.text}>{durationTime}</Text>
        </View>
        <View style={styles.controlsContainer}>
          <ControlsButton icon={FastForward} onPress={this.onFastForwardClick}
                          customIconStyle={{transform: [{rotate: '180deg'}]}} />
          <ControlsButton icon={isPlaying ? Pause : Play} onPress={this.onPlayPauseClick} />
          <ControlsButton icon={FastForward} onPress={this.onFastForwardClick} />
        </View>
        <View style={styles.volumeContainer}>
          <Image source={volumeIcon} />
          <Slider
            style={styles.slider}
            minimumValue={0}
            value={15}
            maximumValue={1}
            minimumTrackTintColor="#FFF"
            maximumTrackTintColor="#000"
            onValueChange={this.setVolume}
          />
          <Text style={styles.volumeText}>{volume.toFixed(0)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#282828',
    alignItems: "center"
  },
  sliderContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: 'space-around',
  },
  slider: {
    width: "80%"
  },
  text: {
    color: "#FFF"
  },
  controlsContainer: {
    marginTop: 20,
    flexDirection: "row"
  },
  buttonOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  buttonInside: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    backgroundColor: "#282828",
    alignItems: "center"
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    width: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  volumeText: {
    color: "#FFF",
    fontSize: 20,
    textAlign: "left",
    width: 40
  }
});

function secondsToTime(secs) {
  secs = Math.round(secs);

  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);

  const secondsString = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${secondsString}`;
}