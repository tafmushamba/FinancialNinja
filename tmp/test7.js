const { Mistral } = require('@mistralai/mistralai'); const client = new Mistral('dummy_key'); console.log(client.chat.complete); console.log(client.chat.stream);
