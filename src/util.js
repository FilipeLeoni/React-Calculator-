
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

      default: return
  }

  return computation.toString()
}
const INTERGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

// format the number to american pattern (decimal number system)

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTERGER_FORMATTER.format(integer)
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}

export {
  formatOperand,
  evaluate
};