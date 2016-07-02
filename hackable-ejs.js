function compile(template) {
  if (!template) return () => null;
  // Would be used by compile_token_by_token
  var status_stack = [];
  var mode = {
    code: 1,
    str:  2,
    eval: 3
  };
  var src_code = "";
  ////////////////////////////////
  var self = this;
  var buf = template;
  var token;
  var lookfor_map = {"<%=" : -1, "<%" : -1, "%>" : -1};
  var inverse_lookfor_map = {};
  self.error = null;
  for(var i = 0; i < buf.length;) {
    for (var key in lookfor_map) {
      lookfor_map[key] = buf.indexOf(key, i);
    }
    while (buf[lookfor_map["<%"]+2] === '=' && lookfor_map["<%"] !== -1) {
      var index = lookfor_map["<%"]+1;
      lookfor_map["<%"] = buf.indexOf("<%", index);
    }
    var pos = [];
    for (var key in lookfor_map) {
      pos.push(lookfor_map[key]);
      inverse_lookfor_map[lookfor_map[key]] = key;
    }
    pos.sort((a,b) => a - b);
    while (pos.length && pos[0] == -1) {
      pos.shift();
    }
    if (pos.length == 0) {
      token = buf.substr(i);
    } else {
      if (i != pos[0]) {
        token = buf.substr(i, pos[0]-i);
      } else {
        token = inverse_lookfor_map[pos[0]];
      }
    }
    compile_token_by_token(token);
    i += token.length;
  }
  src_code = wrap_scr_code(src_code);
  try {
    var fn = new Function("locals", src_code);
  } catch (e) {
    if (self.error == null) self.error = "bad syntax !!!" + e.toString();
    fn = () => null;
  } finally {
    return fn
  }
  function compile_token_by_token (token) {
    switch(token) {
      case "<%=":
        status_stack.push(mode.eval);
        break;
      case "<%":
        status_stack.push(mode.code);
        break;
      case "%>":
        status_stack.pop();
        break;
      default: 
        var status = status_stack.length ? status_stack[status_stack.length - 1] : mode.str;
        switch (status) {
          case mode.eval:
            src_code += "; __append(" + token +")" + "\n";
            break;
          case mode.str:
            src_code += "; __append(\"" + escape(token) + "\")" + "\n";
            break;
          case mode.code:
            src_code += check_include(token) + "\n";
        } // switch status
    } // switch token
  } //compile_token_by_token\
  function escape(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\n/g, '\\n');
    str = str.replace(/\r/g, '\\r');
    str = str.replace(/"/g, '\\"');
    return str
  }
  function wrap_scr_code(src_code) {
    var pre = "", suf = "";
    pre += "var __output = []" + "\n";
    pre += "var __append = __output.push.bind(__output);" + "\n";
    pre += "with(locals || {}) {" + "\n";
    suf += "}"+ "\n";
    suf += "return __output.join(\"\");";
    return src_code = pre + src_code + suf;
  }
  function check_include(str) {
    var include;
    var include_template;
    if ((include = str.match(/^\s*include\s*\(\s*(\S+?)\s*,\s*(\S+?)\s*\)/))) {
      include_template = do_include(include[1].replace(/^"(.+)"$/,'$1').replace(/^'(.+)'$/,'$1'));
      var render = compile(include_template);
      var run_time_imm_render = "(" + render.toString() + ")(" + include[2] + ")";
      return "; __append(" + run_time_imm_render + ")" + "\n";
    } else if ((include = str.match(/^\s*include\s*\(\s*(\S+)\s*\)/))) {
      include_template = do_include(include[1].replace(/^"(.+)"$/,'$1').replace(/^'(.+)'$/,'$1'));
      return "; __append(`" + compile(include_template)() + "`)" + "\n";
    } else {
      return str;
    }
  }
  function do_include(file_path) {
    var include_template;
    try {
      var path = require('path');
      var full_path = path.resolve(__dirname, file_path);
      var filename = full_path.replace(/^.*[\\\/]/, '');
      var ext = path.extname(filename);
      if (!ext) {
        full_path += '.ejs';
      }
      include_template = require('fs').readFileSync(full_path).toString();
    } catch(e) {
      if (self.error == null) self.error = "bad include path : " + file_path + " !!!";
    } finally {
      return include_template;
    }
  }
} // compile

if (exports != undefined) {
  exports.compile = compile;
}


