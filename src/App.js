import React from 'react';
import './App.css';

let TOKEN = process.env.REACT_APP_TOKEN;
let CHANNEL = process.env.REACT_APP_CHANNEL;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {imgUrl: "testPic.jpg",
      userName: "jermm",
      userMsg: "yo yo yo"};
  }

  render() {
    if (!TOKEN) {
      return (
          <p>lol sorry no token :(</p>
      )
    }
    return (
        <div className="darkness">
          <div className="background">
            <img className="imgs" src={this.state.imgUrl} alt="fancy img"></img>
            <div className="comment">
              <h2>{this.state.userName}</h2>
              <p>{this.state.userMsg}</p>
            </div>
          </div>
        </div>
    );
  }

  componentDidMount() {
    let that = this;
    if (TOKEN) {
      this.getLatestMsg(that);
      setInterval(function () {
        that.getLatestMsg(that)
      }, 15000)
    }
  }

  getLatestMsg(that) {
    fetch(`https://slack.com/api/conversations.history?token=${TOKEN}
        &channel=${CHANNEL}&limit=1`, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response) {
      return response.json();
    })
        .then(function(myJson) {
          console.log(JSON.stringify(myJson));
          let lastMsg = myJson.messages[0];
          if (lastMsg.files && lastMsg.files.length > 0) {
            that.setState({imgUrl: lastMsg.files[0].thumb_1024, userMsg: lastMsg.text});
            that.getUserInfo(that, lastMsg.user)
          }
        });
  }

  getUserInfo(that, userStr) {
    fetch(`https://slack.com/api/users.info?token=${TOKEN}&user=${userStr}`, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(response) {
      return response.json();
    }).then(function (userInfo) {
      if (userInfo && userInfo.user && userInfo.user.profile) {
        that.setState({userName: userInfo.user.profile.real_name_normalized});
      }
    })
  }
}
export default App;
