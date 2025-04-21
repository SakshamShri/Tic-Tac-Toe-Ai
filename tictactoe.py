"""
Tic Tac Toe Player
"""

import math

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    #counting the number of the X and O 
    cnt_x = sum(row.count(X) for row in board)
    cnt_o = sum(row.count(O) for row in board)

    #if X >= O then the X's turn else the O's turn
    return X if cnt_x == cnt_o else O



def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    #making a set of possible actions that we can play in a particular state of the board
    possible_actions = set()

    #checking and adding the possible actions for a board
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                possible_actions.add((i, j))
    return possible_actions


def result(board, action):
    """
    Returns the board that results from making the move (i, j) on the board.
    """
    #created a new board so that the original board did not gets affected
    new_board = [row[:] for row in board]

    #action that we need to perform
    i, j = action

    #calling the player function to check whose turn is next
    current_player = player(board)

    #checking if the i,j move is valid or not
    if new_board[i][j] != EMPTY:
        raise ValueError("Invalid action: Cell is not empty.")

    #assigning the X or O according to the move
    new_board[i][j] = current_player
    
    return new_board


    


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    # All the possible winning combinations (rows, columns, diagonals)
    winning_combos = [
        [(0, 0), (0, 1), (0, 2)],  # Row 1
        [(1, 0), (1, 1), (1, 2)],  # Row 2
        [(2, 0), (2, 1), (2, 2)],  # Row 3
        [(0, 0), (1, 0), (2, 0)],  # Column 1
        [(0, 1), (1, 1), (2, 1)],  # Column 2
        [(0, 2), (1, 2), (2, 2)],  # Column 3
        [(0, 0), (1, 1), (2, 2)],  # Diagonal 1
        [(0, 2), (1, 1), (2, 0)]   # Diagonal 2
    ]
    
    # Check all the winning combinations
    for combo in winning_combos:
        a, b, c = combo
        # Check if all three cells in the combo are the same (either X or O)
        if board[a[0]][a[1]] == board[b[0]][b[1]] == board[c[0]][c[1]] and board[a[0]][a[1]] != EMPTY:
            return board[a[0]][a[1]]  # Return the winner (either 'X' or 'O')
    
    # If no winner, return None
    return None



def terminal(board):
    """
    Returns True if the game is over, False otherwise.
    """
    # Check if there is a winner (if the winner is not None, the game is over)
    if winner(board) is not None:
        return True
    
    # Check if the board is full (i.e., no empty cells left)
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                return False  # The game is still ongoing (empty cells exist)
    
    # If no winner and no empty cells, it's a tie
    return True



def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    winner_player = winner(board)  # Get the winner (either 'X', 'O', or None)
    
    if winner_player == 'X':
        return 1
    elif winner_player == 'O':
        return -1
    return 0



def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """

    if terminal(board):
        return None

    turn = player(board)

    def max_value(board, alpha, beta):
        if terminal(board):
            return utility(board), None
        v = float('-inf')
        best_move = None
        for action in actions(board):
            min_result, _ = min_value(result(board, action), alpha, beta)
            if min_result > v:
                v = min_result
                best_move = action
            alpha = max(alpha, v)
            if beta <= alpha:
                break
        return v, best_move

    def min_value(board, alpha, beta):
        if terminal(board):
            return utility(board), None
        v = float('inf')
        best_move = None
        for action in actions(board):
            max_result, _ = max_value(result(board, action), alpha, beta)
            if max_result < v:
                v = max_result
                best_move = action
            beta = min(beta, v)
            if beta <= alpha:
                break
        return v, best_move

    # X is maximizing player
    if turn == X:
        _, move = max_value(board, float('-inf'), float('inf'))
    else:
        _, move = min_value(board, float('-inf'), float('inf'))

    return move

