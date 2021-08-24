import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  makeStyles,
  CircularProgress,
  Paper,
  Typography,
  Slider,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import axios from "axios";
import BootcampCard from "../components/BootcampCard";
import {useHistory, useLocation} from 'react-router-dom'

const BootcampsPage = () => {
  const useStyles = makeStyles({
    root: {
      marginTop: 20,
    },
    loader: {
      width: " 100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    paper: {
      marginBottom: "1rem",
      padding: "13px",
    },
    filters: {
      padding: "0 1.5rem",
    },
    priceRangeInputs: {
      display: "flex",
      justifyContent: "space-between",
    },
  });

  const classes = useStyles();
  const history = useHistory()
  const location = useLocation()

  const params = location.search ? location.search : null

  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sliderMax, setSliderMax] = useState(1000);
  const [priceRange, setPriceRange] = useState([25, 75]);
  const [priceOrder, setPriceOrder] = useState('descending')

  const [filter,setFilter] = useState("")
  const [sorting, setSorting] = useState("")
 
  const updateUIValues = (uiValues) =>{
      setSliderMax(uiValues.maxPrice)

      if(uiValues.filtering.price){
        let priceFilter = uiValues.filtering.price

        setPriceRange([Number(priceFilter.gte), Number(priceFilter.lte)])
      }

      if(uiValues.sorting.price){
        let priceSort = uiValues.sorting.price
        setPriceOrder(priceSort)
      }
  }


  useEffect(() => {
    let cancel;
    const fetchData = async () => {
      setLoading(true);
      try {
        let query

        if( params && !filter){
          query = params
        } else{
          query = filter
        }

        if(sorting){
          if(query.length ===0){
            query = `?sort=${sorting}`
          } else{
            query = query + "&sort" + sorting
          }
        }

        const { data } = await axios({
          method: "GET",
          url: `http://localhost:3001/api/v1/bootcamps${query}`,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        setBootcamps(data.data);
        setLoading(false);
        updateUIValues(data.uiValues)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => cancel()

  }, [filter, params, sorting]);

  const handlePriceInputChange = (e, type) => {
    let newRange

    if(type === 'lower'){

      newRange = [...priceRange]
      newRange[0] = Number(e.target.value)

      setPriceRange(newRange)
    }

    if(type === 'upper'){

     newRange = [...priceRange]
     newRange[1] = Number(e.target.value)

     setPriceRange(newRange)
   }
}


  const onSliderCommitHandler = (e, newValue) =>{
      buildRangeFilter(newValue)
  }

  const onTextFieldCommitHandler = () => {
   buildRangeFilter(priceRange)
  }

  const buildRangeFilter = (newValue) =>{
  const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`

  setFilter(urlFilter)

  history.push(urlFilter)
 }

 const handleSortChange = (e) => {
   setPriceOrder(e.target.value)

   if(e.target.value === "ascending"){
     setSorting("price")
   } else if(e.target.value === "descending"){
    setSorting("-price")
   }
 }


 
  return (
    <>
      <Container className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Filters</Typography>
              <div className={classes.filters}>
                <Slider
                  min={0}
                  max={sliderMax}
                  value={priceRange}
                  valueLabelDisplay="auto"
                  onChange={(e,newValue) => setPriceRange(newValue)}
                  onChangeCommitted={onSliderCommitHandler}
                  disabled= {loading}
                />
                <div className={classes.priceRangeInputs}>
                  <TextField
                    size="small"
                    id="lower"
                    label="Min Price"
                    variant="outlined"
                    type="number"
                    disable={loading}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceInputChange(e,"lower")}
                    onBlur= {onTextFieldCommitHandler}
                  />

                  <TextField
                    size="small"
                    id="upper"
                    label="Max Price"
                    variant="outlined"
                    type="number"
                    disable={loading}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceInputChange(e,"upper")}
                    onBlur= {onTextFieldCommitHandler}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Sort by</Typography>
              <FormControl component="fieldset" className={classes.filters}>
                <RadioGroup aria-label="price-order" name="price-order" value={priceOrder} onChange={handleSortChange}>
                  <FormControlLabel
                    value = "descending"
                    label="Price: Highest - Lowest"
                    disabled={loading}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value = "ascending"
                    label="Price: Lowest - Highest"
                    disabled={loading}
                    control={<Radio />}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={2}>
          {loading ? (
            <div className={classes.loader}>
              <CircularProgress size="3rem" thickness={5} />
            </div>
          ) : (
            bootcamps.map((bootcamp) => (
              <Grid item key={bootcamp._id} xs={12} sm={6} md={4} lg={3}>
                <BootcampCard bootcamp={bootcamp} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
};

export default BootcampsPage;
