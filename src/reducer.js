import {evaluate} from './util';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION:'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

  // State = Current state  |  Payload = Dispatches the necessary data for the action

function reducer (state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:   // Case to add a digit
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      //"If" to not add more than one zero at the beginning

      if(payload.digit === "0" && state.currentOperand === "0") {   
         return state
      }

      //"If" to not add a dot at the beginning

      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state, 
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

      // Case for the action of choosing an operation

      case ACTIONS.CHOOSE_OPERATION:

        // "If" to not add a operation at the beginning

        if(state.currentOperand == null && state.previousOperand == null) {
          return state
        }

        // Change the current operation

        if(state.currentOperand == null) {    
          return {
            ...state,
            operation: payload.operation,
          }
        }

        // Transfer de currentOperand to previousOperand after click in a operation (and clear de currentOperand)

        if(state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }
       
        //  Exec the operation automatically on click (having currentOperation and previousOperation typed)

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        }
        
        // Case for clear button action

      case ACTIONS.CLEAR:
        return {}

        // Case for delete button action

      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null,
          }
        }

        if(state.currentOperand == null) return state
        if(state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null
          }
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        }

        // Case for evaluate action

      case ACTIONS.EVALUATE:
        if(state.operation == null || 
          state.currentOperand == null || 
          state.previousOperand == null) {
          return state
        }

        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
  }
}


export default reducer;