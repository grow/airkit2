module.exports = {
  'extends': 'google',
  'parserOptions': {
    ecmaVersion: 6,
    sourceType: "module"
  },
  'rules': {
    'new-cap': [2, {
      newIsCapExceptionPattern: "Ctor$",
    }],
    'require-jsdoc': 0,
  },
};
