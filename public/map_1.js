{
  var options = {zoom: 17, center: new google.maps.LatLng(47.609722,-122.333056), mapTypeId: google.maps.MapTypeId.ROADMAP, disableDefaultUI:true};
  var map = new google.maps.Map(document.getElementById('map'), options);
  var infoWindow = new google.maps.InfoWindow();
    
  google.maps.event.addListener(map, 'dragend', function(){ loadData(); });
  var markers = {};
  var markerCount = 0;
  
  $('#location').change(function(){
    var parts = $(this).val().split(',');
    map.setCenter(new google.maps.LatLng(parseFloat(parts[0]),parseFloat(parts[1])));
    loadData();
  });
  
  function loadData(){
    if (markerCount > 500) {
      for(var id in markers){
        markers[id].setMap(null);
      }
      markers = {};
      markerCount = 0;
    }
    var center = map.getCenter();
    $.get('/api/nodes', {x: center.lng(), y: center.lat()}, gotData, 'json');
  }
  
  function gotData(nodes){
    var length = nodes.length;
    for(var i = 0; i < length; ++i) {
      var node = nodes[i];
      var id = node['_id']['$oid'];
      if (markers[id]) {continue;}
      
      var point = new google.maps.LatLng(node.loc[1], node.loc[0])
      var marker = new google.maps.Marker({position: point, map: map, clickable: true, raiseOnDrag:false});
      marker._tags = node.tags;
      google.maps.event.addListener(marker, 'click', showInfo);
      markers[id] = marker;
      ++markerCount;
    }
  }
  
  function showInfo(e){
    var marker = this;
    var content = '<div class="info">';
    for (var i = 0; i < marker._tags.length; ++i){
      var tag = marker._tags[i];
      content += '<div><label>' + tagLookup[tag[0]] + '</label>';
      content += '<span>' + tag[1] + '</span></div>';
    }
    content += '</div>';
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  }
  loadData();
}
