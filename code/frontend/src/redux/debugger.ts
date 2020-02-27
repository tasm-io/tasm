export const MODIFY_SPEED = 'MODIFY_SPEED';
export const SET_SIMULATOR_RUNNING = 'SET_SIMULATOR_RUNNING';
export const MODIFY_REGISTER_DISPLAY = 'MODIFY_REGISTER_DISPLAY';

/**
 * DebuggerInterface represents of the user's code in the redux central store.
 * @param speed represents the time between steps (in ms) when code the running.
 * @param running represents if the simulator is currently running
 * If the value is greater then equal it is a handle to a setInterval call
 * -1 represents it has stopped but has ran.
 * -2 is freshly assembled code that hasn't been ran yet.
 * @param registerDisplay represents the base of the register display (default binary)
 * stepping through instructions.
 */
export interface DebuggerInterface {
    speed: number,
    running: number,
    registerDisplay: number,
}

const defaultDebuggerState = {
  speed: Number(localStorage.getItem('debuggerSpeed')) || 1000,
  running: -2,
  registerDisplay: Number(localStorage.getItem('registerDisplay')) || 2,
};

export interface ModifyDebuggerSpeed {
  type: typeof MODIFY_SPEED
  payload: number
}

export interface SetSimulatorRunning {
  type: typeof SET_SIMULATOR_RUNNING
  payload: number
}

export interface ModifyRegisterDisplay {
  type: typeof MODIFY_REGISTER_DISPLAY
  payload: number
}

type DebuggerActions = ModifyDebuggerSpeed | SetSimulatorRunning | ModifyRegisterDisplay


export function debuggerReducer(
  state : DebuggerInterface = defaultDebuggerState,
  action: DebuggerActions,
) {
  switch (action.type) {
  case (MODIFY_SPEED): {
    let newSpeed = action.payload;
    if (newSpeed < 250) {
      newSpeed = 250;
    } else if (newSpeed > 5000) newSpeed = 5000;
    localStorage.setItem('debuggerSpeed', String(newSpeed));
    return { ...state, speed: newSpeed };
  }
  case (SET_SIMULATOR_RUNNING): {
    return { ...state, running: action.payload };
  }
  case (MODIFY_REGISTER_DISPLAY): {
    const valid: number[] = [2, 10, 16];
    if (valid.includes(action.payload) as boolean) {
      localStorage.setItem('registerDisplay', String(action.payload));
      return { ...state, registerDisplay: action.payload };
    }
    return { ...state, registerDisplay: 2 };
  }
  default:
    return state;
  }
}
