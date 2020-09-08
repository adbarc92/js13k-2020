/**
 * Core File for IN2 execution.
 *
 * Add overrides here.
 */

let addLine = text => {
  console.log(text);
};

let catcher = new (function () {
  let cb = () => {};
  this.setK = _cb => (cb = _cb);
  window.addEventListener('keydown', ev => {
    if (this.disabled) {
      return;
    }
    cb(String.fromCharCode(ev.which));
  });
})();

let lastChooseNodeId;
let lastChooseNodesSelected;
var core = /*eslint-disable-line*/ {
  init() {
    lastChooseNodeId = null;
    lastChooseNodesSelected = [];
  },

  async say(text, cb) {
    if (typeof text === 'object') {
      if (text.length === 1) {
        addLine(text);
      } else {
        core.say(text[0], () => {
          core.say(text.slice(1), cb);
        });
        return;
      }
    } else {
      if (text.length <= 1) {
        cb && cb();
        return;
      } else {
        addLine(text);
      }
    }

    return new Promise(resolve => {
      addLine();
      addLine('&nbsp&nbsp&nbsp&nbsp&nbspPress any key to continue...');
      catcher.setK(() => {
        cb && cb();
        resolve();
      });
    });
  },
  async choose(text, nodeId, choices) {
    return new Promise(resolve => {
      const sep = '----------';
      if (text) {
        addLine(text);
        addLine();
      }
      addLine(sep, 'choiceStyle');
      const actualChoices = choices.filter(choice => {
        if (choice.c()) {
          return true;
        } else {
          return false;
        }
      });
      if (lastChooseNodeId !== nodeId) {
        lastChooseNodeId = nodeId;
        lastChooseNodesSelected = [];
      }
      let ctr = 1;
      actualChoices.forEach(choice => {
        addLine('<b>  ' + ctr + '.) ' + choice.t + '</b>', 'choiceStyle');
        ctr++;
      });
      addLine(sep, 'choiceStyle');
      catcher.setK(async key => {
        const choice = actualChoices[key - 1];
        if (choice) {
          lastChooseNodesSelected.push(choice.t);
          catcher.setK(() => {});
          addLine();
          addLine(choice.t, 'chosenStyle');
          addLine();
          await choice.cb();
          resolve();
        }
      });
    });
  },
  async defer(func, args) {
    args = args || [player.get('curIN2n'), player.get('curIN2f')];
    await func.apply(null, args);
  },

  exit() {},
};

var player = /*eslint-disable-line*/ {
  state: {
    //curIN2n
    //curIN2f
    //lasIN2f
    //event
    //nextFile
  },
  get(path) {
    let _helper = (paths, obj) => {
      let k = paths.shift();
      if (!paths.length) {
        return obj[k] === undefined ? undefined : obj[k];
      }

      let nextObj = obj[k];
      if (nextObj !== undefined) {
        return _helper(paths, nextObj);
      } else {
        return undefined;
      }
    };

    return _helper(path.split('.'), this.state);
  },
  set(path, val) {
    val = val === undefined ? true : val;
    let _helper = (keys, obj) => {
      let k = keys.shift();
      if (k === undefined) {
        return;
      }
      if (!keys.length) {
        obj[k] = val;
        return;
      }

      if (!obj[k]) {
        obj[k] = {};
      }
      _helper(keys, obj[k]);
    };

    _helper(path.split('.'), this.state);
  },
  setIfUnset(path, val) {
    if (this.get(path) === null) {
      this.set(path, val);
    }
  },
};
