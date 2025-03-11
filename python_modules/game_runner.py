"""
Game Runner - Entry point for the Financial Twin game
This module provides a simple entry point for Node.js to communicate with the Financial Twin game.
"""
import sys
import json
from financial_twin import run_game_function

def main():
    """Main entry point for the script when called from Node.js"""
    # Read input from stdin (passed from Node.js)
    input_json = sys.stdin.read()
    
    try:
        # Parse the input JSON
        params = json.loads(input_json)
        function_name = params.get("function", "")
        function_params = params.get("params", {})
        
        # Run the appropriate game function
        if function_name:
            result = run_game_function(function_name, function_params)
            
            # Write the result to stdout for Node.js to read
            sys.stdout.write(result)
            sys.stdout.flush()
        else:
            error = {"error": "No function specified"}
            sys.stdout.write(json.dumps(error))
            sys.stdout.flush()
            
    except Exception as e:
        # Handle any exceptions and return an error message
        error = {"error": str(e)}
        sys.stdout.write(json.dumps(error))
        sys.stdout.flush()

if __name__ == "__main__":
    main()