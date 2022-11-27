import React, { Component } from 'react';
class ModeSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // todo: we will add mode-toggler later
    return (
      <div className="heading-corner">
        {/**
      <div className="date-img">
      <img classNamer="head-img" src='../../../public/img/B-rem.png' src={`${URL_PATH}/img/B-rem.png`}
      </div>
    */}
        <div className="date-heading">🏞️ Image Editor</div>
      </div>
    );
  }
}

export default ModeSwitcher;
