"""
Game Runner - Entry point for the Financial Twin game
This module provides a simple entry point for Node.js to communicate with the Financial Twin game.
"""
import sys
import os
import json
import traceback

# Add the project root to the Python path to support both direct and relative imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    # Try importing from the updated module first
    from python_modules.financial_twin_updated import run_game_function
except ImportError:
    try:
        # Try importing as a module (when run as part of a package)
        from python_modules.financial_twin import run_game_function
    except ImportError:
        # Fall back to a local import (when run directly)
        try:
            from financial_twin_updated import run_game_function
        except ImportError:
            from financial_twin import run_game_function

def main():
    """Main entry point for the script when called from Node.js"""
    try:
        # Read the input data from stdin
        input_data = sys.stdin.read()
        
        # Log the received data for debugging
        with open('/tmp/python_game_input.log', 'a') as f:
            f.write(f"Received input: {input_data}\n")
        
        # Parse the JSON data
        data = json.loads(input_data)
        
        # Extract the function name and parameters
        function_name = data.get('function')
        params = data.get('params', {})
        
        # Log the extracted data
        with open('/tmp/python_game_params.log', 'a') as f:
            f.write(f"Function: {function_name}, Params: {params}\n")
        
        # Run the specified game function
        result = run_game_function(function_name, params)
        
        # Print the result as JSON to be captured by Node.js
        print(result)
        
    except Exception as e:
        # Log any errors
        error_msg = traceback.format_exc()
        with open('/tmp/python_game_error.log', 'a') as f:
            f.write(f"Error: {error_msg}\n")
        
        # Return an error message
        error_response = json.dumps({
            "content": f"Error running game: {str(e)}",
            "error": str(e)
        })
        print(error_response)

if __name__ == "__main__":
    main()