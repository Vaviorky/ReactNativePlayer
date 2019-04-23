import {createStackNavigator, createAppContainer} from 'react-navigation';
import MainView from "./components/MainView";

const MainNavigator = createStackNavigator({
  MainView: {screen: MainView}
});

const App = createAppContainer(MainNavigator);

export default App;