import React from 'react';
import './App.css';

let TOKEN = process.env.REACT_APP_TOKEN;
let CHANNEL = process.env.REACT_APP_CHANNEL;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {imgUrl: "testPic.jpg",
      token: TOKEN,
      tempToken: "",
      userName: "jermm",
      userMsg: "yo yo yo"};
    this.updateTempToken = this.updateTempToken.bind(this);
    this.saveTempToken = this.saveTempToken.bind(this);

  }

  render() {
    if (!this.state.token) {
      return (
          <div className="background noToken">
            <p>sorry no token :(</p>
            <p>got a token?</p>
            <input value={this.state.tempToken} type="text" onChange={this.updateTempToken} />
            <button onClick={this.saveTempToken}>SAVE IT!</button>
          </div>

      )
    }
    return (
        <div className="darkness">
          <div className="background">
            <h1>rl filter</h1>
            <img className="imgs" src={this.state.imgUrl} alt="fancy img"/>
            <div className="comment">
              <h2>{this.state.userName}</h2>
              <p>{this.state.userMsg}</p>
            </div>
          </div>
        </div>
    );
  }

  updateTempToken(event) {
    this.setState({tempToken: event.target.value});
  }

  saveTempToken() {
    let that = this;
    this.setState({token: this.state.tempToken}, function () {
      that.componentDidMount();
    });
  }

  componentDidMount() {
    let that = this;
    if (this.state.token) {
      this.getLatestMsg(that);
      setInterval(function () {
        that.getLatestMsg(that)
      }, 15000)
    }
  }

  getLatestMsg(that) {
    fetch(`https://slack.com/api/conversations.history?token=${that.state.token}&channel=${CHANNEL}&limit=1`, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response) {
      return response.json();
    })
        .then(function(myJson) {
          let lastMsg = myJson.messages[0];
          if (lastMsg.files && lastMsg.files.length > 0) {
            that.setState({imgUrl: lastMsg.files[0].thumb_1024, userMsg: lastMsg.text});
            that.getUserInfo(that, lastMsg.user)
          }
        });
  }

  getUserInfo(that, userStr) {
    fetch(`https://slack.com/api/users.info?token=${that.state.token}&user=${userStr}`, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response) {
      return response.json();
    }).then(function (userInfo) {
      if (userInfo && userInfo.user && userInfo.user.profile) {
        that.setState({userName: userInfo.user.profile.real_name_normalized});
      }
    })
  }
}
export default App;
