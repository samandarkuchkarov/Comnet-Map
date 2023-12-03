import { MapContainer, TileLayer,Marker,Popup,useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility"
import React, { useEffect } from 'react'
import data from '../location.json'
import MarkerClusterGroup from 'react-leaflet-markercluster';
import SearchBlock from './searchBlock'
import list from '../list5.json'
const XLSX = require('xlsx');
import axios from 'axios'
function MyComponent({setMap}) {
  const map = useMap()
  setMap(map)
  return null
}
const Map = () => {

  const [loc,setLoc] = React.useState({x:'41.325847',y:'69.262067'})
  const [map,setMap] = React.useState()
  const [distanceM,setDistance] = React.useState(10000)
  
  useEffect(() => {
    const fetch = async() =>{
      let arr = list
      let result = []
      
      for (let index = 0; index < arr.length; index++) {
        let location = arr[index].A.split(',')
        let x = Number(location[0])
        let y = Number(location[1])
        let elem = {
          cor:arr[index].A,
        }
       
        let loca = await findPlacebyCosdinate(y,x)
        // loca = loca?.split(',')
        let New = {...elem}
        if(loca){
          New.loc = loca.name,
          New.desc = loca.description
        }
        result.push(New)
      }
      const worksheet = XLSX.utils.json_to_sheet(result);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'x.csv';
      downloadLink.click();

    }
    fetch()
    return () => {
      
    }
  }, [])
  const keys = ['c77aee5c-73e5-4ac0-b610-5a1e1754a1f2','dbbc2d40-280e-4ebd-bfb0-2f1668d9abfd','694d4194-2775-4e99-a56a-8fad6686e5d1','e2f81c7a-5710-4fba-a8eb-e67602285704','aef87fd7-ca32-4a95-afa3-b1876e78fe53','3fe3c3d2-4cd8-4eea-976b-581be083da47','9fbf4a34-9ba2-4daa-b1f0-86327cf0d045','fcbf8eb3-63f8-401c-83cc-466b5274d674']
  const findPlacebyCosdinate = async(longitude,latitude)=>{
    const apiKey = keys[4]
    const apiUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${longitude},${latitude}`;
    return  await axios.get(apiUrl)
    .then(response => {
      const data = response.data;
      const featureMember = data.response.GeoObjectCollection.featureMember[0];
      const address = featureMember.GeoObject.description;
      const name = featureMember.GeoObject.name
      return featureMember.GeoObject
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

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
    let newDistance = distanceInkm(lat,long,closest.A,closest.B)*1000
    setDistance(newDistance)
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
        <SearchBlock type='tashkent'  distanceM={distanceM} data={data} map={map}/>
        <MapContainer
        center={[41.2995,69.2401]}
        scrollWheelZoom={true}
        zoom={12}
        style={{ height: "100vh", width: "100vw",margin:'0 auto' }}
        >
          <MyComponent setMap={setMap}/>
          <TileLayer
            url={`http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
            attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
          />
          <MarkerClusterGroup>
            {data.map((e,i)=>{
                if(!e.A || e.A === 'a'){
                    return
                }
                return(
              <Marker  key={i} position={[e.B, parseFloat(e.C)]}  animate={true}>
                <Popup >{e.C} </Popup>
              </Marker>
            )})}
          </MarkerClusterGroup>
        </MapContainer>
  
      </div>

  );
};

export default Map;