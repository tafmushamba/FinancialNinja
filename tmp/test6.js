const { Mistral } = require('@mistralai/mistralai'); const client = new Mistral('dummy_key'); console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(client.chat)));
