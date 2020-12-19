module.exports = (...args) => async (context) => args.includes(context.data.action)
