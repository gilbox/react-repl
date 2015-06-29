// modified version of https://raw.githubusercontent.com/securingsincity/react-ace/master/src/ace.jsx

const React = require('react');
const {Component, PropTypes} = React;
const ace = require('brace');

export default class Ace extends Component {
  static displayName = 'Ace'

  static propTypes = {
    mode : PropTypes.string,
    theme: PropTypes.string,
    name: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
    fontSize: PropTypes.number,
    showGutter: PropTypes.bool,
    handleChange: PropTypes.func,
    value: PropTypes.string,
    onLoad: PropTypes.func,
    maxLines: PropTypes.number,
    readOnly: PropTypes.bool,
    highlightActiveLine: PropTypes.bool,
    showPrintMargin: PropTypes.bool
  }

  static defaultProps = {
    name: 'brace-editor',
    mode: '',
    theme: '',
    height: '100%',
    width: '100%',
    value: '',
    fontSize: 12,
    showGutter: true,
    handleChange: null,
    onLoad: null,
    maxLines: null,
    readOnly: false,
    highlightActiveLine: true,
    showPrintMargin: true
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {props} = this;

    this.editor = ace.edit(props.name);
    if (props.mode) this.editor.getSession().setMode('ace/mode/'+props.mode);
    if (props.theme) this.editor.setTheme('ace/theme/'+props.theme);
    this.editor.setFontSize(props.fontSize);
    this.editor.on('change', ::this.handleChange);
    this.editor.setValue(props.value);
    this.editor.renderer.setShowGutter(props.showGutter);
    this.editor.setOption('maxLines', props.maxLines);
    this.editor.setOption('readOnly', props.readOnly);
    this.editor.setOption('highlightActiveLine', props.highlightActiveLine);
    this.editor.setShowPrintMargin(props.setShowPrintMargin);

    if (props.onLoad) {
      props.onLoad(this.editor);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  handleChange() {
    if (this.props.onChange) {
      this.props.onChange(this.editor.getValue());
    }
  }

  componentWillReceiveProps(nextProps) {
    this.editor = ace.edit(nextProps.name);
    if (nextProps.mode) this.editor.getSession().setMode('ace/mode/'+nextProps.mode);
    if (nextProps.theme) this.editor.setTheme('ace/theme/'+nextProps.theme);
    this.editor.setFontSize(nextProps.fontSize);
    this.editor.setOption('maxLines', nextProps.maxLines);
    this.editor.setOption('readOnly', nextProps.readOnly);
    this.editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
    this.editor.setShowPrintMargin(nextProps.setShowPrintMargin);
    // if (this.editor.getValue() !== nextProps.value) {
    //   this.editor.setValue(nextProps.value);
    // }
    this.editor.renderer.setShowGutter(nextProps.showGutter);
    if (nextProps.onLoad) {
      nextProps.onLoad(this.editor);
    }
  }

  render() {
    var divStyle = {
      width: this.props.width,
      height: this.props.height
    };
    return (<div id={this.props.name} onChange={::this.handleChange} style={divStyle}></div>);
  }
}
