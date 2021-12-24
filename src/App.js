import React, { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
	ADD_DIGIT: 'add-digit',
	NEGATE: 'negate',
	CHOOSE_OPERATION: 'choose-operation',
	CLEAR: 'clear',
	DELETE_DIGIT: 'delete-digit',
	EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.overwrite)
				return {
					...state,
					currentOperand: payload.digit,
					overwrite: false,
				};
			if (payload.digit === '0' && state.currentOperand === '0') return state;
			if (payload.digit === '.' && state.currentOperand.includes('.'))
				return state;
			return {
				...state,
				currentOperand: `${state.currentOperand}${payload.digit}`,
			};
		case ACTIONS.NEGATE:
			const curr = parseFloat(state.currentOperand);
			if (isNaN(curr)) return '';
			let computation = '';
			let sign = Math.sign(curr);
			if (sign === 1) computation = -Math.abs(curr);
			if (sign === -1) computation = Math.abs(curr);
			if (sign === 0) computation = 0;
			return {
				...state,
				currentOperand: computation.toString(),
			};
		case ACTIONS.CLEAR:
			return {
				...state,
				currentOperand: '0',
				previousOperand: null,
				operation: null,
			};
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperand === '0' && state.previousOperand == null)
				return state;

			if (state.currentOperand === '0')
				return {
					...state,
					operation: payload.operation,
				};
			if (state.previousOperand == null)
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentOperand,
					currentOperand: '0',
				};
			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operation,
				currentOperand: '0',
			};
		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite)
				return {
					...state,
					overwrite: false,
					currentOperand: '0',
				};
			if (state.currentOperand === '0') return state;
			if (
				state.currentOperand.length === 1 ||
				(state.currentOperand.length === 2 &&
					Math.sign(state.currentOperand) === -1)
			)
				return {
					...state,
					currentOperand: '0',
				};
			console.log(state.currentOperand);
			console.log(state.currentOperand.length);
			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1),
			};
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currentOperand === '0' ||
				state.previousOperand == null
			)
				return state;

			return {
				...state,
				overwrite: true,
				operation: null,
				currentOperand: evaluate(state),
				previousOperand: null,
			};
		default:
			return state;
	}
}

function evaluate({ currentOperand, previousOperand, operation }) {
	const prev = parseFloat(previousOperand);
	const curr = parseFloat(currentOperand);
	if (isNaN(prev) || isNaN(curr)) return '';
	let computation = '';
	switch (operation) {
		case '+':
			computation = prev + curr;
			break;
		case '-':
			computation = prev - curr;
			break;
		case 'x':
			computation = prev * curr;
			break;
		case '÷':
			computation = prev / curr;
			break;

		default:
			break;
	}
	return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('fr-ca', {
	maximumFractionDigits: 0,
});

function formatOperand(operand) {
	if (operand == null) return;
	const [integer, decimal] = operand.split('.');
	if (decimal == null) return INTEGER_FORMATTER.format(integer);
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
		reducer,
		{
			currentOperand: '0',
		}
	);

	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="previous-operand">
					{formatOperand(previousOperand)} {operation}
				</div>
				<div className="current-operand">{formatOperand(currentOperand)}</div>
			</div>
			<button onClick={() => dispatch({ type: ACTIONS.NEGATE })}>+/-</button>
			<button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
			<button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
				DEL
			</button>
			<OperationButton operation="÷" dispatch={dispatch}></OperationButton>
			<DigitButton digit="7" dispatch={dispatch}></DigitButton>
			<DigitButton digit="8" dispatch={dispatch}></DigitButton>
			<DigitButton digit="9" dispatch={dispatch}></DigitButton>
			<OperationButton operation="x" dispatch={dispatch}></OperationButton>
			<DigitButton digit="4" dispatch={dispatch}></DigitButton>
			<DigitButton digit="5" dispatch={dispatch}></DigitButton>
			<DigitButton digit="6" dispatch={dispatch}></DigitButton>
			<OperationButton operation="+" dispatch={dispatch}></OperationButton>
			<DigitButton digit="1" dispatch={dispatch}></DigitButton>
			<DigitButton digit="2" dispatch={dispatch}></DigitButton>
			<DigitButton digit="3" dispatch={dispatch}></DigitButton>
			<OperationButton operation="-" dispatch={dispatch}></OperationButton>
			<DigitButton digit="." dispatch={dispatch}></DigitButton>
			<DigitButton digit="0" dispatch={dispatch}></DigitButton>
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
			>
				=
			</button>
		</div>
	);
}

export default App;
