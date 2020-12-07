import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Imagelinkform from './Components/Imagelinkform/Imagelinkform';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import './App.css';
import Rank from './Components/Rank/Rank';


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user : {
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }  
 }   
      
 

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user : {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
      }  
    })
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

   displayFaceBox =(box) => {
    this.setState({box : box});
   } 
  
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    fetch('https://afternoon-ravine-42677.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               input: this.state.input
            })
    })     
    .then(response => response.json())
    .then(response => {
        if(response) {
           fetch('https://afternoon-ravine-42677.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries:count}))
             
           })
           .catch(err => console.log(err))
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      });  
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if(route === 'home') {
       this.setState({isSignedIn: true})
    }
    this.setState({route:route});
  }

  render() {
    const { isSignedIn, imageUrl, route,box} = this.state;
    return (
      <div className="App">
       <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home'
            ? <div>
               <Logo/>
               <Rank name={this.state.user.name} entries={this.state.user.entries}/>
               <Imagelinkform 
               onInputChange={this.onInputChange}
               onButtonSubmit={this.onButtonSubmit}
               />
               <FaceRecognition imageUrl={imageUrl} box={box}/> 
              </div>
            : (
                this.state.route === 'signin'
                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
             
          }
      </div>
    );
  }  
} 
export default App;
