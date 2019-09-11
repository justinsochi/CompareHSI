import React, { Component } from 'react';
import './SharpeRatio.scss';
import DatePicker from "react-datepicker";
import securitiesList from "./listOfSecurities.json"
import "react-datepicker/dist/react-datepicker.css";

class SharpeRatio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            stockCode: "1 CKH HOLDINGS",
            addStock: false,
            img: null,
            error: null
        };

    }
    stockList = []
    link = "https://2ebe12a5.ngrok.io/"

    submitList = () => {
        if(this.stockList.length === 0 ){
            this.setState({error: "Plesae select at least 1 stock!"})
            
        }
        else {
            this.setState({loading: true, img: null})
            fetch(`${this.link}SharpeRatio`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stockList: this.stockList,
                    startDate: this.state.startDate.toLocaleDateString("en-GB"),
                    endDate: this.state.endDate.toLocaleDateString("en-GB")
                })
            }).then(response => response.json()
            ).then(data => {
                console.log(data)
                this.setState({ img: data.img, ratio: data.ratio, loading: false })
            })
        }
       
    }
    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
      
    }
    checkStock = () => {
        if (!this.stockList.includes(this.state.stockCode)) {
            // console.log(this.stockList)
            // this.stockList.push(stockCode)
            this.setState({ addStock: true })
            this.stockList.push(this.state.stockCode)
        }
    }
    handleStartDateChange = (date) => {
        this.setState({
            startDate: date
        });
    }
    handleEndDateChange = (date) => {
        this.setState({
            endDate: date
        });
    }
    addStock = () => {
        const { addStock, } = this.state
        if (addStock) {
            return (
                this.stockList.map(stockCode => {
                    return (
                        <tr key={stockCode} className="tableItem" >
                            <td>{stockCode}</td>
                        </tr>
                    )
                })
            )
        }
    }
    stockRatio = () => {
        return (
            this.stockList.map((stockCode, i) => {
                return (
                    <tr key={stockCode} className="tableItem" >
                        <td>{stockCode}</td>
                        <td>{this.state.ratio[i]}</td>
                    </tr>
                )
            })
        )
    }
    stockOptions = () => {
        return (
            securitiesList.map(i => {
                return <option key={i["Stock Code"]} value={`${i["Stock Code"]} ${i["Name of Securities"]} `}>{i["Stock Code"]} {i["Name of Securities"]}</option>
            })
        )
    }
    render() {
        let { img, loading } = this.state
        return (
            <div className="SharpeRatioContainer">
                <div className="selector">
                    <h3>Sharpe Ratio</h3>
                    <div className="form-group">
                        <label htmlFor="stockCode">Stock Code</label>
                        <select name="stockCode" className="selectpicker form-control" data-live-search="true" onChange={this.handleInputChange}>
                            {this.stockOptions()}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={this.checkStock}>Add</button>
                </div >
                <div className="paper">
                    {this.stockList.length === 0 ? <span></span> : <table className="SharpeRatioTable">
                        <thead>
                            <tr>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.addStock()}
                        </tbody>

                    </table>}
                </div>
                <div>
                    <h4>Note that day trade is not yet supported!</h4>
                </div>
                <form>
                    <div className="form-group">
                        <label htmlFor="pwd">Buy Date</label>
                        <DatePicker
                            className="form-control"
                            selected={this.state.startDate}
                            onChange={this.handleStartDateChange}
                            maxDate={this.state.endDate}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwd">Sell Date</label>
                        <DatePicker
                            className="form-control"
                            minDate={this.state.startDate}
                            maxDate={new Date}
                            selected={this.state.endDate}
                            onChange={this.handleEndDateChange}
                        />
                    </div>
                </form>
                <div>
                    <button className="btn btn-success" onClick={this.submitList}>Find Sharpe Ratio</button>
                </div>
                <div><h4>{this.state.error}</h4></div>
                {loading && <h3>Loading.... (This may take a while)</h3>}
                {img === null ? <span></span> : <div>
                    <h3>Result</h3>
                    <div className="paper">
                    <table className="SharpeRatioTable">
                        <thead>
                            <tr>
                                <th>StockCode</th>
                                <th>Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.stockRatio()}
                        </tbody>

                    </table>
                    </div>
                    <img src={`data:image/jpeg;base64,${this.state.img}`} />
                </div>}

            </div >
        )

    }
}

export default SharpeRatio;