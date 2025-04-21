var board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

var HUMAN = -1;
var COMP = +1;

function gameOver(state, player) {
	const win_state = [
		[state[0][0], state[0][1], state[0][2]],
		[state[1][0], state[1][1], state[1][2]],
		[state[2][0], state[2][1], state[2][2]],
		[state[0][0], state[1][0], state[2][0]],
		[state[0][1], state[1][1], state[2][1]],
		[state[0][2], state[1][2], state[2][2]],
		[state[0][0], state[1][1], state[2][2]],
		[state[2][0], state[1][1], state[0][2]],
	];
	for (let i = 0; i < win_state.length; i++) {
		if (win_state[i].every(cell => cell === player)) {
			return true;
		}
	}
	return false;
}

function gameOverAll(state) {
	return gameOver(state, HUMAN) || gameOver(state, COMP);
}

function emptyCells(state) {
	let cells = [];
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (state[x][y] === 0)
				cells.push([x, y]);
		}
	}
	return cells;
}

function validMove(x, y) {
	try {
		return board[x][y] === 0;
	} catch {
		return false;
	}
}

function setMove(x, y, player) {
	if (validMove(x, y)) {
		board[x][y] = player;
		return true;
	}
	return false;
}

function minimax(state, depth, player) {
	if (gameOver(state, COMP)) return [-1, -1, 10 - depth];
	if (gameOver(state, HUMAN)) return [-1, -1, depth - 10];
	if (emptyCells(state).length === 0) return [-1, -1, 0];

	let best = player === COMP ? [-1, -1, -Infinity] : [-1, -1, Infinity];

	emptyCells(state).forEach(([x, y]) => {
		state[x][y] = player;
		let [_, __, score] = minimax(state, depth + 1, -player);
		state[x][y] = 0;

		if (player === COMP) {
			if (score > best[2]) best = [x, y, score];
		} else {
			if (score < best[2]) best = [x, y, score];
		}
	});

	return best;
}

function aiTurn() {
	let x, y;
	if (emptyCells(board).length === 9) {
		x = Math.floor(Math.random() * 3);
		y = Math.floor(Math.random() * 3);
	} else {
		[x, y] = minimax(board, 0, COMP);
	}
	if (setMove(x, y, COMP)) {
		document.getElementById(`${x}${y}`).innerHTML = "O";
	}
}

function clickedCell(cell) {
	const button = document.getElementById("bnt-restart");
	button.disabled = true;

	if (!gameOverAll(board) && emptyCells(board).length > 0) {
		const [x, y] = cell.id.split("").map(Number);
		if (setMove(x, y, HUMAN)) {
			cell.innerHTML = "X";
			if (!gameOverAll(board)) aiTurn();
		}
	}

	if (gameOver(board, COMP)) {
		highlightWin(COMP);
		document.getElementById("message").innerHTML = "You lose!";
	} else if (emptyCells(board).length === 0) {
		document.getElementById("message").innerHTML = "Draw!";
	}

	if (gameOverAll(board) || emptyCells(board).length === 0) {
		button.value = "Restart";
		button.disabled = false;
	}
}

function highlightWin(player) {
	const winLines = [
		[[0, 0], [0, 1], [0, 2]],
		[[1, 0], [1, 1], [1, 2]],
		[[2, 0], [2, 1], [2, 2]],
		[[0, 0], [1, 0], [2, 0]],
		[[0, 1], [1, 1], [2, 1]],
		[[0, 2], [1, 2], [2, 2]],
		[[0, 0], [1, 1], [2, 2]],
		[[2, 0], [1, 1], [0, 2]],
	];
	for (const line of winLines) {
		if (line.every(([x, y]) => board[x][y] === player)) {
			line.forEach(([x, y]) => {
				document.getElementById(`${x}${y}`).style.color = "red";
			});
			break;
		}
	}
}

function resetCellColors() {
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			const cell = document.getElementById(`${x}${y}`);
			cell.style.color = "#000";
		}
	}
}

resetCellColors();

function restartBnt(button) {
	if (button.value === "Start AI") {
		aiTurn();
		button.disabled = true;
	} else if (button.value === "Restart") {
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				board[x][y] = 0;
				const cell = document.getElementById(`${x}${y}`);
				cell.innerHTML = "";
				cell.style.color = "#444";
			}
		}
		resetCellColors();
		document.getElementById("message").innerHTML = "";
		button.value = "Start AI";
		button.disabled = false;
	}
}
