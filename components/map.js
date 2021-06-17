import { MapContainer, TileLayer,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility"
import React from 'react'
import data from '../location.json'
import MarkerClusterGroup from 'react-leaflet-markercluster';

const Map = () => {

  const [loc,setLoc] = React.useState({x:'',y:''})
  React.useEffect(()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
  },[])
  function showPosition(position){ 
    let long = position.coords.longitude;
    let lat = position.coords.latitude;
    setLoc({x:lat,y:long})
    const closest = data.reduce((a,b)=>distance(lat,long,a) < distance(lat,long,b) ? a : b);
    console.log(('The closest distance between you and coverage point  '+distanceInkm(lat,long,closest.A,closest.B)*1000)+'m')
    console.log(closest,'closest coverage point')
  }

  function distance(lat,long,all) {

    return Math.sqrt(Math.pow(lat - all.A, 2) + Math.pow(long - Number(all.B), 2))
  }
  function distanceInkm(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  
  return (
      <div >
              <MapContainer
    center={[41.2995, 69.2401]}
    scrollWheelZoom={true}
    zoom={13}
    style={{ height: "100vh", width: "100vw",margin:'0 auto' }}
  >
    <TileLayer
      url={`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
      attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
    />
    {/* <Marker position={[loc.x,loc.y]}></Marker> */}
   <MarkerClusterGroup>
    {data.map((e,i)=>{
        if(!e.A || e.A === 'a'){
            return
        }
        return(
      <Marker key={i} position={[e.A, parseFloat(e.B)]}  animate={true}>
        <Popup>{e.C}</Popup>
      </Marker>
    )})}
   </MarkerClusterGroup>
  </MapContainer>
  
      </div>

  );
};

export default Map;