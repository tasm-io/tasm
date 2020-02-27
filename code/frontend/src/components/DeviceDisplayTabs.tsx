
import React from 'react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { RootState } from '../redux/root';
// eslint-disable-next-line no-unused-vars
import { ChangeActiveDevice, CHANGE_ACTIVE_DEVICE } from '../redux/simulator';

function handleTabChange(deviceTab: number, dispatch: Function) {
  const action: ChangeActiveDevice = {
    type: CHANGE_ACTIVE_DEVICE,
    payload: deviceTab,
  };
  dispatch(action);
}

const DeviceDisplayTabs: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab: number = useSelector((state : RootState) => state.simulator.activeDevice);
  return (
    <div className="tabs" aria-label="Device Tab Menu">
      <button type="button" aria-expanded={activeTab === 0} className={`Tab ${activeTab === 0 ? 'ActiveTab' : ''}`} onClick={() => handleTabChange(0, dispatch)}>RAM</button>
      <button type="button" aria-expanded={activeTab === 1} className={`Tab ${activeTab === 1 ? 'ActiveTab' : ''}`} onClick={() => handleTabChange(1, dispatch)}>Text Display</button>
      <button type="button" aria-expanded={activeTab === 2} className={`Tab ${activeTab === 2 ? 'ActiveTab' : ''}`} onClick={() => handleTabChange(2, dispatch)}>Virtual Keyboard</button>
      <button type="button" aria-expanded={activeTab === 3} className={`Tab ${activeTab === 3 ? 'ActiveTab' : ''}`} onClick={() => handleTabChange(3, dispatch)}>7 Segment Display</button>
      <button type="button" aria-expanded={activeTab === 4} className={`Tab ${activeTab === 4 ? 'ActiveTab' : ''}`} onClick={() => handleTabChange(4, dispatch)}>Traffic Lights</button>
    </div>
  );
};

export default DeviceDisplayTabs;
