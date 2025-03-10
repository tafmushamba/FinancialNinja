import os
from dotenv import load_dotenv
from abacusai import ApiClient

# Load environment variables
load_dotenv()

def run_financial_chat_assistant(message):
    from agents.financial_chat_assistant import chat_response_function
    response = chat_response_function(message)
    return response

def run_financial_twin(message):
    from agents.financial_twin import chat_response_function
    response = chat_response_function(message)
    return response

def main():
    print("AI Financial Twin Project")
    print("1. Financial Chat Assistant")
    print("2. AI Financial Twin")
    choice = input("Select an agent (1/2): ")
    
    while True:
        message = input("Enter your message (or 'quit' to exit): ")
        if message.lower() == 'quit':
            break
            
        if choice == '1':
            response = run_financial_chat_assistant(message)
        else:
            response = run_financial_twin(message)
            
        print("\nResponse:", response)

if __name__ == "__main__":
    main()