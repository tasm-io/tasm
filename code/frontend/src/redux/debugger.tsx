export const MODIFY_SPEED = 'MODIFY_SPEED';
export const SET_SIMULATOR_RUNNING = 'SET_SIMULATOR_RUNNING';

/**
 * DebuggerInterface represents of the user's code in the redux central store.
 * @param speed represents the time between steps (in ms) when code the running.
 * @param running represents if the simulator is currently running and
 * stepping through instructions.
 */
export interface DebuggerInterface {
    speed: number,
    running: boolean,
}

const defaultDebuggerState = {
  speed: 1000,
  running: false,
};

export interface ModifyDebuggerSpeed {
  type: typeof MODIFY_SPEED
  payload: number
}

export interface SetSimulatorRunning {
  type: typeof SET_SIMULATOR_RUNNING
  payload: boolean
}

type DebuggerActions = ModifyDebuggerSpeed | SetSimulatorRunning


export default function debuggerReducer(
  state : DebuggerInterface = defaultDebuggerState,
  action: DebuggerActions,
) {
  switch (action.type) {
    case (MODIFY_SPEED): {
      let newSpeed = state.speed + action.payload;
      if (newSpeed < 100) {
        newSpeed = 100;
      } else if (newSpeed > 5000) newSpeed = 5000;
      return { ...state, speed: newSpeed };
    }
    case (SET_SIMULATOR_RUNNING): {
      return { ...state, running: action.payload };
    }
    default:
      return state;
  }
}
