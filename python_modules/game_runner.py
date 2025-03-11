"""
Game Runner - Entry point for the Financial Twin game
This module provides a simple entry point for Node.js to communicate with the Financial Twin game.
"""
import sys
import json
from financial_twin import run_game_function

def main():
    """Main entry point for the script when called from Node.js"""
    try:
        # Get the JSON input from command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({
                "content": "Error: Missing parameters",
                "error": "No input parameters provided"
            }))
            return
        
        # Parse the input JSON
        input_json = json.loads(sys.argv[1])
        function_name = input_json.get("function_name")
        params = input_json.get("params", {})
        
        if not function_name:
            print(json.dumps({
                "content": "Error: Missing function name",
                "error": "Function name not provided"
            }))
            return
        
        # Run the specified game function with the provided parameters
        result = run_game_function(function_name, params)
        print(result)
        
    except json.JSONDecodeError as e:
        print(json.dumps({
            "content": "Error: Invalid JSON input",
            "error": f"JSON parsing error: {str(e)}"
        }))
    except Exception as e:
        print(json.dumps({
            "content": "Error: Game execution failed",
            "error": f"Unexpected error: {str(e)}"
        }))

if __name__ == "__main__":
    main()