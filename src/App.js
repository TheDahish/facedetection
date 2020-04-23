import React , {Component}from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation'; 
import Logo from './Components/Logo/Logo'; 
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'; 
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'; 
import Signin from './Components/signin/Signin.js'; 
import Rank from './Components/Rank/Rank'; 
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Register from './Components/Register/Register.js'; 

const app = new Clarifai.App({
 apiKey: '2ea0e946818a448ba3a6c6e2ff54d7bb'
});



const particlesoptions = {
      "particles": {
          "number": {
              "value": 300,
              density:{
                enable:true,
                value_area:800
              }
          },
          "size": {
              "value": 3
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "repulse"
              }
          }
      }
  }
class App extends Component {
  constructor()
  {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route:'signin'
    }
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
   // console.log(event.target.value);

  }
  displayFaceBox = (box) => {
    this.setState({box});
  }

  calculatelocation = (data) =>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image= document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width- (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }



  }
  onRouteChange =(data) =>{
    this.setState({route:data});
  }
  onSubmit = ()=>{
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then( response =>  this.setState({box: this.calculatelocation(response)})
      // do something with response
      //console.log(response);
     // this.setState({box: response.outputs[0].data.regions[0].region_info.bounding_box});
      //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    
     //this.displayFaceBox(this.calculatelocation(response));
    
  ).catch(err => console.log(err));
  }
  render(){
  return (

    <div className="App">

    <script src="https://cdn.rawgit.com/progers/pathseg/master/pathseg.js"></script>
      <Particles className = 'particles'
    params={particlesoptions} />

    <Navigation onRouteChange={this.onRouteChange} isSign = {this.state.route}/> 
    { this.state.route==='home'?
    <div>
    
    <Logo />
    <Rank />
    
           <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
           <FaceRecognition imageUrl={this.state.imageUrl } box={this.state.box} />
   </div>     
    
    
    : (
        this.state.route==='signin'? <Signin onRouteChange={this.onRouteChange} />
        : < Register onRouteChange={this.onRouteChange} />
      ) 
    }
    </div>
  );
}
}

export default App;
