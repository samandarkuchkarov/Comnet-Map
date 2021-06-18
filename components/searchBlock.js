
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
      fontSize:'18px'
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

const SearchContainer = ({data,map}) =>{
    const classes = useStyles();
    const [results,setResult] = React.useState([])
    const [value,setValue] = React.useState('')

    React.useEffect(()=>{
        if(value.length<3&&value.length>0){
            let newData = data.filter((item)=>{
                let newString = item.C.slice(0,value.length)
                return newString === value
            })
            setResult(newData)
            }else if(value.length>=3){
            let newData = data.filter((item)=>{
                return item.C.includes(value)
            })
            setResult(newData)
            }
    },[value])

    const find = (item) =>{
        map.setView([Number(item.A),Number(item.B)],16)
        setValue(item.C)
    }

    return(
        <div className='searchBlock'>
            <div className='search'>
                <Divider className={classes.divider} orientation="vertical" />
                <InputBase
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
            <div className='resultBlock'>
            <div className='results'>
                    {results.map((item)=>(
                        <div onClick={()=>{find(item)}}  className='resultItem' key={item.C}>
                           <p  className='resultext'>{item.C}</p> 
                        </div>
                    ))}
            </div>
            </div>
        </div>
    )
}

export default SearchContainer