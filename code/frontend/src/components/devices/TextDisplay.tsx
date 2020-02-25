import React from 'react';
import '../../App.css';

function mapRow(row: string[]) {
  const res: any = [];
  row.map((s) => {
    res.push(
      <td>
        {s}
      </td>,
    );
    return undefined;
  });
  return res;
}

const TextDisplay: React.FC = () => {
  const test: any[] = 'hello world I am a string and I have grown since youve seen me'.split('');
  let dummy: any[] = test.concat(new Array<any>((16 * 4) - test.length).fill(<i>&nbsp;</i>));
  dummy = dummy.map((item) => (item === ' ' ? <i>&nbsp;</i> : item));
  return (
    <div className="Device">
      <table className="TextDisplay">
        <tbody>
          <tr>
            {mapRow(dummy.slice(0, 16))}
          </tr>
          <tr>
            {mapRow(dummy.slice(16, 32))}
          </tr>
          <tr>
            {mapRow(dummy.slice(32, 48))}
          </tr>
          <tr>
            {mapRow(dummy.slice(48, 64))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TextDisplay;
