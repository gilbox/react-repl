const React = require('react');

/*

.play {
  position: absolute;
  right: 10px;
  bottom: 0;
}

.play,
.play-button {
  height: 30px;
  width: 80px;
}
.play {
    height: 50px;
}
.play-button {
  position: absolute;
  top: 0;
  left: 0;
  color: #666;
  cursor: pointer;
  background: white;
  text-decoration: none;
  border-radius: 3px;
  border: 2px solid #ccc;
  font-size: 17px;
  text-align: center;
  font-family: Arial;
}
.play-button:hover {
  color: black;
  border: 2px solid black;
}
.auto-run {
  font-size: 13px;
  font-family: Arial;
  position: absolute;
  bottom: 2px;
  left: 3px;
}
 */

module.exports = React.createClass({
  displayName: 'PlayRun',

  getInitialState() {
    return {autoRun:true};
  },

  render() {
    return (
      <div className="play">
              {!this.state.autoRun && <button
                onClick={_ => this.forceUpdate()}
                className="play-button">&#9658; Run</button>}
        <label className="auto-run">
          <input type="checkbox"
            onChange={e=>
              this.setState({autoRun:!this.state.autoRun})}
            checked={this.state.autoRun} /> Auto-Run
        </label>
      </div>
    );
  }
});