const React = require('react');
const {Component} = React;
const styles = {
  play: {
    width: '100px',
    height: '50px',
  },
  playButton: {
    width: '80px',
    height: '26px',
    position: 'absolute',
    top: '0',
    left: '0',
    color: '#666',
    cursor: 'pointer',
    background: 'white',
    textDecoration: 'none',
    borderRadius: '3px',
    border: '2px solid #ccc',
    fontSize: '15px',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  autoRun: {
    fontSize: '13px',
    fontFamily: 'Arial',
    position: 'absolute',
    bottom: '2px',
    left: 0,
  }
};

/*
.play-button:hover {
  color: black;
  border: 2px solid black;
}
*/

export default class PlayRun extends Component {
  constructor(props) {
    super(props);
    this.state = {autoRun:true};
  }

  render() {
    return (
      <div style={{...styles.play, ...this.props.style}}>
              {!this.state.autoRun && <button
                onClick={_ => this.forceUpdate()}
                style={styles.playButton}>&#9658; Run</button>}
        <label style={styles.autoRun}>
          <input type="checkbox"
            onChange={e=>
              this.setState({autoRun:!this.state.autoRun})}
            checked={this.state.autoRun} /> Auto-Run
        </label>
      </div>
    );
  }
}
