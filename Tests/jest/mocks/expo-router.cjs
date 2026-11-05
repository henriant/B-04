const React = require("react");

module.exports = {
  useFocusEffect: (effect) => React.useEffect(effect, [effect]),
};
