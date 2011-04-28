Fargo = new JS.Module('Fargo');

Fargo.extend({
  Runtime: new JS.Class({
    initialize: function() {
      this.stack = new this.klass.Stackless();
      this.scope = new this.klass.TopLevel(this);
    },
    
    define: function(name, value) {
      return this.scope.define(name, value);
    },
    
    syntax: function(name, value) {
      return this.scope.syntax(name, value);
    },
    
    run: function(path) {
      return this.scope.run(path);
    }
  }),
  
  clone: function(value) {
    if (value && value.clone) return value.clone();
    return value;
  },
  
  evaluate: function(expression, scope) {
    if (expression && expression.klass === Fargo.Runtime.Value)
      return expression.value;
    
    if (!expression || !expression.eval) return expression;
    return expression.eval(scope);
  },
  
  freeze: function(value) {
    if (value && value.freeze) value.freeze();
    return value;
  },
          
  dirname: function(path) {
    return path.replace(/\/[^\/]*$/g, '');
  },
  
  path: function() {
    return Array.prototype.join.call(arguments, '/')
           .replace(/\/+/g, '/');
  },
  
  puts: function(string) {
    if (typeof require === 'function') require('sys').puts(string);
  },
  
  loadJavaScript: function(path) {
    if (typeof require === 'function') require(path);
    else eval(this.readFile(path));
  },
  
  readFile: function(path) {
    if (typeof require === 'function')
      return require('fs').readFileSync(path).toString();
    
    var data = null,
        xhr  = window.ActiveXObject
             ? new ActiveXObject("Microsoft.XMLHTTP")
             : new XMLHttpRequest();
    
    xhr.open('GET', path, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      data = xhr.responseText;
      xhr.onreadystatechange = function() {};
      xhr = null;
    };
    xhr.send(null);
    return data;
  }
});
