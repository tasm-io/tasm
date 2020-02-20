
import React from 'react';
import '../App.css';

const DeviceDisplayTabs: React.FC = () => (
  <div className="tabs">
    <button type="button" className="Tab Tab:active">RAM</button>
    <button type="button" className="Tab">Text Display</button>
    <button type="button" className="Tab">Virtual Keyboard</button>
    <button type="button" className="Tab">7 Segment Display</button>
    <button type="button" className="Tab">Traffic Lights</button>
  </div>
);


export default DeviceDisplayTabs;
