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
    
    # Debug - log input to a file for inspection
    with open("/tmp/python_debug.log", "a") as debug_file:
        debug_file.write(f"Input received: {input_json}\n")
    
    try:
        # Parse the input JSON
        params = json.loads(input_json)
        function_name = params.get("function", "")
        function_params = params.get("params", {})
        
        # Debug - log parsed parameters
        with open("/tmp/python_debug.log", "a") as debug_file:
            debug_file.write(f"Function: {function_name}, Params: {function_params}\n")
        
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
        
        # Debug - log the exception
        with open("/tmp/python_debug.log", "a") as debug_file:
            debug_file.write(f"Exception: {str(e)}\n")

if __name__ == "__main__":
    main()