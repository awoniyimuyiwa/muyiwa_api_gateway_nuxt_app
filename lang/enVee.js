// Custom vee-validate en dictionary
// See node_modules/vee-validate/dist/locale/en.js for examples on how to structure validation messages
const messages = {
  required: field => `Hey there, you must provide a value for ${field}`
};

const atrributes = {
  email: "Email Address"
};

const dictionary = {
  name: "en",
  messages,
  atrributes
};

export default dictionary;
