import React from 'react'

class TickerStar extends React.Component{
    constructor(props){
        super(props); 
        this.state = {
            selected: false,
            star: 'far fa-star'
        }
    }

    selectHandler = (event) => {
        event.preventDefault(); 
        if(this.state.selected === false){
            this.setState({
                selected: true,
                star: 'fa fa-star'
            })       
            console.log(this.props.id)
         } else {
             this.setState({
                 selected: false,
                 star: 'far fa-star'
             })
         }
    }

    render(){
        return(
            <div>
                <i onClick={this.selectHandler} className={this.state.star}></i>
            </div> 
        )
    }
}

export default TickerStar