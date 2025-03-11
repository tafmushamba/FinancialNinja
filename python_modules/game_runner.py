"""
Game Runner - Entry point for the Financial Twin game
This module provides a simple entry point for Node.js to communicate with the Financial Twin game.
"""
import sys
import json
from python_modules.financial_twin import run_game_function

def main():
    """Main entry point for the script when called from Node.js"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No function specified"}))
        return
    
    # Get function name and parameters from command line arguments
    try:
        # The first argument is the function name
        function_name = sys.argv[1]
        
        # If there's a second argument, it's the JSON parameters
        params = {}
        if len(sys.argv) > 2:
            params = json.loads(sys.argv[2])
        
        # Run the specified function
        result = run_game_function(function_name, params)
        print(result)
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()