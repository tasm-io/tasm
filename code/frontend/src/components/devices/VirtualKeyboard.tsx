import React from 'react';
import '../../App.css';

const VirtualKeyboard: React.FC = () => {
  const test: any[] = 'hello world I am a string and I have grown since youve seen me'.split('');
  let dummy: any[] = test.concat(new Array<any>((16 * 4) - test.length).fill(<i>&nbsp;</i>));
  dummy = dummy.map((item) => (item === ' ' ? <i>&nbsp;</i> : item));
  return (
    <div className="Device VirtualKeyboard">
      <input placeholder="Type Here" />
    </div>
  );
};

export default VirtualKeyboard;
