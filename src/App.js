import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './style.css'

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

  // function to evaluate the operation and the result
  // parseFloat() analyze the string and returns a number

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
     computation = prev + current
     break

    case "-":
      computation = prev - current
      break

    case "*":
      computation = prev * current
      break

    case "÷":
      computation = prev / current
      break 
  }

  return computation.toString()
}

// format the number to american pattern (decimal number system)

const INTERGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTERGER_FORMATTER.format(integer)
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

 // Initial state = empty object 

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
        <button className="span-one" onClick={() => dispatch({type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>   
        <DigitButton digit="2" dispatch={dispatch}/>   
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <button className='dot-radius'>.</button>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
