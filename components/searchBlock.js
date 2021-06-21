
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useMap } from 'react-leaflet'
const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      height:'50px',
      fontSize:'16px'
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 32,
      margin: 4,
    },
    icon:{
        height:'30px',
        width:'30px'
    }
  }));

const SearchContainer = ({data,map,distanceM,type,setCordinate}) =>{
    const classes = useStyles();
    const [results,setResult] = React.useState([])
    const [value,setValue] = React.useState('')
    const RefX = React.useRef()
    const RefY = React.useRef()
    const findWithCordinate = ()=>{
        const lat = Number(RefX.current.childNodes[0].value)
        const long = Number(RefY.current.childNodes[0].value)
        map.setView([lat,long],18)

    }
    React.useEffect(()=>{
        if(value.length<3&&value.length>0){
            let newData = data.filter((item)=>{
                let newString = item.C.slice(0,value.length)
                return newString === value
            })
            setResult(newData)
            }else if(value.length>=3){

            let newData = data.filter((item)=>{
                let newString = item.C.toLowerCase().replace(/ /g,'')
                let words = value.split(' ')
                let newWords = words.filter((elem)=>{
                   return newString.includes(elem.toLowerCase().replace(/ /g,''))
                })
                return newWords.length===words.length
                // let newString = item.C.toLowerCase()
                // return newString.includes(value.toLowerCase().replace(/ /g,''))
            })
            setResult(newData)
            }
    },[value])

    const find = (item) =>{
        map.setView([Number(item.A),Number(item.B)],18)
        setValue(item.C)
    }
    const [style,setStyle] = React.useState(true)
    return(
    <div>
        <div className ='burger' onClick={()=>{setStyle(true)}} style={{backgroundImage:'url(../burger.png)'}}>

        </div>
        <div style={{transform: !style?'translatex(-100%)':'translatex(0)'}}  className='searchBlock'>
           
            <div className='search'>
            <div className='exit' onClick={()=>{setStyle(false)}} style={{backgroundImage:'url(/close.png)'}}></div>
                <Divider className={classes.divider} orientation="vertical" />
                <InputBase
                    spellCheck={false}
                    onChange={(e)=>{setValue(e.target.value)}}
                    value={value}
                    className={classes.input}
                    placeholder="Введите Ваш адрес"
                    inputProps={{ 'aria-label': 'Введите Ваш адрес' }}
                />
                <IconButton  type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon className={classes.icon} />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
            </div>
            <div className='coordinateBlock' style={{display:type==='company'?'flex':'none'}}>
            <div className='coordinate'>
                <Divider className={classes.divider} orientation="vertical" />
                <InputBase
                        type='number'
                        spellCheck={false}
                        className={classes.input}
                        placeholder="X"
                        ref={RefX}
                        inputProps={{ 'aria-label': 'Введите Ваш адрес' }}
                    />
                <Divider className={classes.divider} orientation="vertical" />
            </div>
            <div className='coordinate'>
                <Divider className={classes.divider} orientation="vertical" />
                <InputBase
                        type='number'
                        spellCheck={false}
                        className={classes.input}
                        placeholder="Y"
                        ref={RefY}
                        inputProps={{ 'aria-label': 'Введите Ваш адрес' }}
                    />
                <Divider className={classes.divider} orientation="vertical" />
            </div>
            <div className='submit' onClick={()=>{findWithCordinate()}}><p>Submit</p></div>
            </div>
            <div className='resultBlock'>
            <div className='results'>
                    {results.map((item)=>(
                        <div onClick={()=>{find(item)}}  className='resultItem' key={item.C}>
                           <p  className='resultext'>{item.C} {typeof item.D !== 'undefined'?item.D:''}</p> 
                        </div>
                    ))}
            </div>
            </div>
        </div>
        <div className='info'>
           <div  className='infoContent' style={{display:distanceM<500?'none':'flex'}}>
           <p className='infoText'>Уточните возможность подключения у оператора, по номеру телефона <span style={{color:'#EC6A6A'}}>712058888</span> </p>
           </div>
           <div style={{display:distanceM<500?'flex':'none'}} className='infoContent'>
                <p className='infoText'>Ваш дом находится в зоне покрытия Comnet!</p>
                <div className='button'><p>Оставить заявку</p></div>
           </div>     
        </div>
    </div>
    )
}

export default SearchContainer