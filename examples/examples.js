document.observe('dom:loaded', function(){
  
  new Ajax.CachedRequest("data.js", {
    name: "bob",    
    method: 'get',
    parameters: {a: '10', b: 20},    
    onComplete: function(transport)
    {
      alert(transport.responseText);
    }
  });
  
  $('request_one').observe('click', function(e){    
    e.stop();
    new Ajax.CachedRequest("data.js", {
      name: "bob",
      onSuccess: function(transport)
      {
        alert(transport.responseText);
      }
    });
    
  });
  
});
