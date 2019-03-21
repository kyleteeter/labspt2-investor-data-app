import React from 'react'
import axios from 'axios'
import TickerStar from './TickerStar'
import { Loading, Row, TickerContainer, StockSymbol, Star } from '../Styles/Dashboard/LiveTickerStyles' 

class LiveTicker extends React.Component{
    constructor(){
        super();
        this.state = {
            timeStamp: {},
            companies: ['DJI', 'NDAQ', 'SPX', 'AAPL', 'AMZN'], // stock company symbols
            stocks: [],
        }
    }
      
    componentDidMount(){
        let promises = this.state.companies.map(company =>   // map that sends array of companies through axios to invoke external API
            axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${company}&interval=5min&apikey=ZV7Y9QKGXRHCY0A4`));
        this.fetchStocks(promises)
    }
      
    fetchStocks = (promises) => {  // Receives array of companies and returns values of the stock symbols from the api 
        let stocks = []
        let timeStamp
        axios
            .all(promises)
            .then(results => {
                results.forEach(result => {  // loops through keys to access targeted values of stock(s)
              
                    if (result.data.Note) {
                      throw new Error()
                    }
      
                    let data = result.data['Time Series (Daily)'] //Accesses correct object within API
                    let timeStamps = Object.keys(data)
                    let current = data[timeStamps[0]]
                    timeStamp = timeStamps[0]  
                    
                    stocks.push({
                        company: result.data['Meta Data']['2. Symbol'], // Collects stock symbol
                        values: current
                    })
                });
      
                this.setState({
                    stocks,
                    timeStamp
                });
            })
            .catch(error => {
                console.error('There was an error with the network requests', error)
            });
    }
      
    
    changePercent = (close, start) => {  // function for calculating the change of a stocks gain/loss by %
        let deduct = close - start
        let divide = deduct / start 
        let solution = divide * 100
            if(solution > 0){
                return "+" + solution.toFixed(2)
            }
            return solution.toFixed(2)
    }

    changePoints = (close, start) => {  // calculates the change of a stocks gain/loss by points
        let solution = close - start;
            if(solution > 0){
                return "+" + solution.toFixed(1)
            }
            return solution.toFixed(1)
    }

    decimalToFixed = ( input ) => {  // truncates the numbers following the decimal to two digits 
        input = parseFloat(input).toFixed(2)
            return input
    }

    shortenVolume = (num) => {  // Crunches the length of the volume into a smaller number while inserting a decimal point and character representing the amount
        let str,
            suffix = '';
        
        let decimalPlaces = 2 || 0;

        num = +num;
        
        let factor = Math.pow(10, decimalPlaces);
        
        if (num < 1000) {
            str = num;
        } else if (num < 1000000) {
            str = Math.floor(num / (1000 / factor)) / factor;
            suffix = 'K';
        } else if (num < 1000000000) {
            str = Math.floor(num / (1000000 / factor)) / factor;
            suffix = 'M';
        } else if (num < 1000000000000) {
            str = Math.floor(num / (1000000000 / factor)) / factor;
            suffix = 'B';
        } 
            return str + suffix;
        }
    

    render() {
        if(!this.state.stocks.length) {  // returns loading sign while data is being retrieved from API
            return <Loading>Loading Stocks...</Loading>
        }
    
        let rows = [];
        
        const open = '1. open'
        const close = '4. close'
        const volume = '5. volume'
    
        this.state.stocks.forEach( (stock, index) => {  // Loops through array of stock values and creates a table
            console.log(stock)
            rows.push(
                <TickerContainer key={index}>
                    <Row>
                        <StockSymbol>        
                            <p>{stock.company}</p> 
                        </StockSymbol> 
                        <Star>
                            <TickerStar id={stock.company} /> 
                        </Star> 
                    </Row> 
                    <br />
                    <Row>
                        <p>Price: ${`${this.decimalToFixed(stock.values[close])}`}</p>
                        <p>Change: {`${this.changePoints(stock.values[close], stock.values[open])}`}</p>
                    </Row> 
                    <Row> 
                        <p>Volume: {`${this.shortenVolume(stock.values[volume])}`}</p> 
                        <p>Change %: {`${this.changePercent(stock.values[close], stock.values[open])}`}</p>
                    </Row> 
                    <br />
                    <hr/> 
                </TickerContainer>
            )
        });
    
        return (
            <div>
                { rows }  
            </div> 
        )
    }
}

export default LiveTicker