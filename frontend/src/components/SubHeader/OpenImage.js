import React, { Component } from 'react';
import { BsCaretDownFill } from 'react-icons/bs'; // Import the down arrow icon
import Selfie from './Selfie';
import { Link } from 'react-router-dom';

export default class OpenImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      openCamera: false,
    };
  }

  toggleDropdown = () =>
    this.setState({ dropdownVisible: !this.state.dropdownVisible });
  hideDropdown = () => this.setState({ dropdownVisible: false });

  componentDidMount = () => {
    document.addEventListener('click', (evt) => {
      if (
        !evt.target.closest('.btn-to-open-dropdown') &&
        this.state.dropdownVisible
      ) {
        this.hideDropdown();
      }

      if (evt.target.classList.contains('test-image')) {
        this.props.loadImage(evt.target.id);
        this.hideDropdown();
      }
    });
  };

  onFileClick = (evt) => (evt.target.value = null);
  onFileChange = (evt) => {
    this.setState({ dropdownVisible: false });
    let file = evt.target.files[0];
    this.props.loadImage(file);
  };

  toggleCameraModal = () =>
    this.setState({
      openCamera: !this.state.openCamera,
      dropdownVisible: false,
    });

  onGoToURL = (evt) => {
    let url = evt.target.parentElement.querySelector('#img-url').value;
  };

  onKeyEnter = (evt) => {
    if (evt.key === 'Enter') {
      this.onGoToURL(evt);
    }
  };

  render() {
    return (
      <div className="relative btn-to-open-dropdown">
        <div className="relative inline-block text-left">
          <button
            onClick={this.toggleDropdown}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-gray-100 rounded-md shadow-sm bg-transparent text-sm font-medium text-gray-300 hover:text-gray-50 focus:outline-none"
          >
            Open
            <BsCaretDownFill className="w-5 h-5 ml-2 -mr-1" />{' '}
            {/* Down arrow icon */}
          </button>

          {this.state.dropdownVisible && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-400 ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <label className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                  Computer
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={this.onFileChange}
                    onClick={this.onFileClick}
                    className="hidden"
                  />
                </label>

                <div
                  className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                  onClick={this.toggleCameraModal}
                >
                  Camera
                </div>
                <div
                  className="test-image clickable block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                  id={`${URL_PATH}/img/temperature_demo.png`}
                  href="#"
                >
                  Demo temperature
                </div>
                <div
                  className="test-image clickable block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                  id={`${URL_PATH}/img/kitty.jpg`}
                  href="#"
                >
                  Demo contrast
                </div>
              </div>
            </div>
          )}
        </div>

        {this.state.openCamera ? (
          <Selfie
            loadImage={this.props.loadImage}
            toggleCameraModal={this.toggleCameraModal}
          />
        ) : null}
      </div>
    );
  }
}
