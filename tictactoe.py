class TicTacToe:
    """
    An object of this class represents a TicTacToe board.
    
    Attributes:
        board - a representation of the board.
    
    Methods:
        __init__ - Constructor for the board. Default empty, can accept existing board.
        __str__ - String representation. Prints the board with every space X, O, or ·.
        get_board - Returns the board.
        get_square - Returns the value at a specific space on the board.
        make_local_move - Returns a new post-move board.
        check_local_state - Determines the status of the game.
    """
    
    def __init__(self, board = None):
        """
        The constructor for the class. Creates an empty board or implements
        an existing one.
        
        Inputs:
            board - Optional input. By default is None.
        """
        if board == None:
            self.board = []
            for num1 in range(3):
                self.board.append([])
                for num2 in range(3):
                    self.board[-1].append(None)
        else:
            self.board = board
    
    def __str__(self):
        """
        The string representation of the class. Turns the board into a grid of
        Xs and Os. · represents an empty space.
        
        Inputs:
            None
            
        Returns a string representation of the board.
        """
        symbols = ""
        for row in self.board:
            for num in range(3):
                if row[num] == 1:
                    symbols += "X"
                elif row[num] == -1:
                    symbols += "O"
                else:
                    symbols += "·"
                if num < 2:
                    symbols += " "
            symbols += "\n"
        return symbols

    def get_board(self):
        """
        Getter for the board.
        
        Inputs:
            None
        
        Returns a copy of the board.
        """
        return self.board.copy()
    
    def get_square(self, row, col):
        """
        Getter for a specific square.
        
        Inputs:
            row - The row of the square to be returned.
            col - The column of the square to be returned.
        
        Returns the value (1, -1, or None) at the given location.
        """
        return self.board[row][col]
    
    def make_local_move(self, player, row, col):
        """
        Makes a given move for the given player on the board.
        
        Inputs:
            player - Either 1 or -1 to represent the player who's moving.
            row - The row of the move being played.
            col - The column of the move being played.
        
        Returns a board identical to the existing board but with the move played.
        """
        new_board = self.board.copy()
        new_board[row][col] = player
        return TicTacToe(new_board)
    
    def check_local_state(self):
        """
        Checks the status of the game on the board.
        
        Inputs:
            None
        
        Returns 1 or -1 if the related player has won the game, 0 if the game
        ended with a tie, or None if the game has not been completed.
        """
        for row in self.board:
            if row[0] == row[1] == row[2] != None:
                return row[0]
        
        for col in range(3):
            if self.board[0][col] == self.board[1][col] == self.board[2][col] != None:
                return self.board[0][col]
            
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != None:
            return self.board[1][1]
        
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != None:
            return self.board[1][1]
        
        for row in self.board:
            for col in range(3):
                if row[col] == None:
                    return None
        
        return 0
    

#This is a script that will run it like a game of TicTacToe for testing purposes.

# game = TicTacToe()

# player = 1

# while game.check_local_state() == None:
#     #for row in game.get_board():
#       #   print(row)
#     print(game)
    
#     while True:
#         row_input = input("Please type the row you'd like to play.")
#         col_input = input("Please type the column you'd like to play.")
#         if 0 <= int(row_input) <= 2 and 0 <= int(col_input) <= 2:
#             if game.get_square(int(row_input), int(col_input)) == None:
#                 break
#             else:
#                 print("Please input a valid move.")
#         else:
#             print("Please input a valid move.")
        
#     game = TicTacToe(game.make_local_move(player, int(row_input), int(col_input)))
    
#     player *= -1

# print("Congratulations!", game.check_local_state(), "has won!")
