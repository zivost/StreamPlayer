'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _decorations = require('./decorations');

var _utils = require('./utils');

var _agora = require('./assets/agora.png');

var _agora2 = _interopRequireDefault(_agora);

var _speaker = require('./assets/speaker.png');

var _speaker2 = _interopRequireDefault(_speaker);

var _bg = require('./assets/bg.png');

var _bg2 = _interopRequireDefault(_bg);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = (_temp = _class = function (_Component) {
	_inherits(_default, _Component);

	function _default(props) {
		_classCallCheck(this, _default);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.startNetworkDetector = function () {
			_this.stopNetworkDetector();
			_this._networkDetector = setInterval(function () {
				var stream = _this.props.stream;
				stream.getStats(function (e) {
					if (stream.local) {
						// if local stream, use accessDelay
						var accessDelay = Number.parseInt(e.accessDelay, 10);
						if (isNaN(accessDelay)) {
							return;
						}
						if (accessDelay < 100) {
							_this.setState({
								networkStatus: 0
							});
						} else if (accessDelay < 200) {
							_this.setState({
								networkStatus: 1
							});
						} else {
							_this.setState({
								networkStatus: 2
							});
						}
					} else {
						// if remote stream, use endToEndDelay
						var endToEndDelay = Number.parseInt(e.endToEndDelay, 10);
						if (isNaN(endToEndDelay)) {
							return;
						}
						if (endToEndDelay < 200) {
							_this.setState({
								networkStatus: 0
							});
						} else if (endToEndDelay < 400) {
							_this.setState({
								networkStatus: 1
							});
						} else {
							_this.setState({
								networkStatus: 2
							});
						}
					}
				});
			}, 1500);
		};

		_this.stopNetworkDetector = function () {
			if (_this._networkDetector) {
				clearInterval(_this._networkDetector);
			}
		};

		_this._getSnapshot = function () {
			// init snapshot the first time we got it
			var stream = _this.props.stream;
			return {
				id: stream.getId(),
				hasVideo: stream.hasVideo() || stream.hasScreen(),
				hasAudio: stream.hasAudio(),
				videoOn: stream.isVideoOn(),
				audioOn: stream.isAudioOn(),
				playing: stream.isPlaying()
			};
		};

		_this._handleStreamSideEffects = function () {
			if (!_this.props.autoChange) {
				return;
			}
			// deal with side effect
			var $prev = _this._snapshot;
			var $stream = _this.props.stream;

			// check video
			if ((0, _utils.xor)($prev.videoOn, _this.props.video)) {
				if ($stream.hasVideo()) {
					_this.props.video ? $stream.enableVideo() : $stream.disableVideo();
				}
			}

			// check audio
			if ((0, _utils.xor)($prev.audioOn, _this.props.audio)) {
				if ($stream.hasAudio()) {
					_this.props.audio ? $stream.enableAudio() : $stream.disableAudio();
				}
			}
		};

		try {
			_this._snapshot = _this._getSnapshot();
		} catch (err) {
			throw new Error('The stream you passed is invalid!');
		}
		_this.state = {
			networkStatus: 0
		};
		return _this;
	}
	// _audioDetector: IntervalID


	_default.prototype.componentDidUpdate = function componentDidUpdate() {
		this._handleStreamSideEffects();

		// check detector
		if (this.props.networkDetect) {
			this.startNetworkDetector();
		} else {
			this.stopNetworkDetector();
		}

		this._snapshot = this._getSnapshot();
	};

	_default.prototype.componentDidMount = function componentDidMount() {
		this._handleStreamSideEffects();

		// check detector
		if (this.props.networkDetect) {
			this.startNetworkDetector();
		}

		// play stream
		var stream = this.props.stream;
		stream.play('agora--player__' + stream.getId());
	};

	_default.prototype.componentWillUnmount = function componentWillUnmount() {
		// check detecor
		this.stopNetworkDetector();

		// stop stream
		var stream = this.props.stream;
		if (stream && stream.isPlaying()) {
			stream.stop();
			// stream.local && stream.close();
		}
	};

	_default.prototype.render = function render() {
		var className = 'agora-player__box \n    ' + (this.props.fit === 'cover' ? 'cover' : 'contain') + ' \n    ' + (this.props.className || '') + ' ';

		var id = 'agora--player__' + this.props.stream.getId();

		var _props = this.props,
		    onClick = _props.onClick,
		    onDoubleClick = _props.onDoubleClick,
		    style = _props.style;

		return _react2.default.createElement(
			'div',
			{
				onClick: onClick,
				onDoubleClick: onDoubleClick,
				style: style,
				className: className,
				id: id
			},
			(!this.props.video || !(this._snapshot && this._snapshot.hasVideo)) && _react2.default.createElement(
				'div',
				{ className: 'agora-player__placeholder' },
				this.props.placeholder
			),
			_react2.default.createElement(
				'div',
				{ className: 'agora-player__decorations' },
				this.props.prependIcon,
				this.props.networkDetect && _react2.default.createElement(_decorations.SignalIcon, { level: this.state.networkStatus }),
				this.props.audioLevel > 0 && _react2.default.createElement(
					'div',
					{ className: 'agora-player__icon' },
					_react2.default.createElement('meter', { max: '10', min: '0.0', value: this.props.audioLevel, high: '7', low: '2.5', optimum: '0.5' })
				),
				this.props.appendIcon
			),
			this.props.label && _react2.default.createElement(
				'div',
				{
					className: 'agora-player__label ' + this.props.labelClass
				},
				this.props.label
			)
		);
	};

	return _default;
}(_react.Component), _class.defaultProps = {
	stream: undefined,
	video: true,
	audio: true,
	fit: 'cover',

	networkDetect: false,
	speaking: false,
	// audioDetect: false,
	autoChange: true,
	className: '',
	style: {}
}, _temp);

exports.default = _default;
module.exports = exports['default'];