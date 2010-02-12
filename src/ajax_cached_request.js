Ajax.cache = {};
Ajax.CachedRequest = Class.create(Ajax.Request, {
  
  request: function($super, url) {
    if (this.options.name && Ajax.cache[this.options.name])
    {
      this.url    = url;
      this.method = this.options.method;      
      this.replay();
    }
    else
    {
      Ajax.cache[this.options.name] = {states: [], complete: false};
      $super(url);
    }
  },
  
  respondToReadyState: function($super, readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);
    Ajax.cache[this.options.name].states.push({state: state, response: response});
    $super(readyState);
    if (this._complete)
    {
      Ajax.cache[this.options.name].complete = true;
    }
  },
  
  replay: function()
  {
    var cache = Ajax.cache[this.options.name];
    if (!cache.complete)
    {
      setTimeout(this.replay.bind(this), 100);
    }
    else
    {
      cache.states.each(function(state){
        this.replay_state(state);
      }.bind(this))
    }
  },
  
  replay_state: function(data)
  {
    var state     = data.state;
    var response  = data.response;
      
    if (state == 'Complete') {
      try {
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }
  }
});