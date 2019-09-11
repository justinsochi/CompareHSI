import React, { Component } from 'react';
import './Selector.scss';
import DatePicker from "react-datepicker";
import securitiesList from "./listOfSecurities.json"
import "react-datepicker/dist/react-datepicker.css";
class Selector extends Component {
    // componentDidMount() {
    //     fetch(" https://a7c394a7.ngrok.io", {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             firstParam: 'yourValue',
    //             secondParam: 'yourOtherValue',
    //         })
    //     })
    // }
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            stockCode: "1 CKH HOLDINGS",
            shares: false,
            addStock: false,
            img: false,
            img2: false,
            img3: false,
            stockList: []
        };
    }
    link = "https://2ebe12a5.ngrok.io/"

    submitList = () => {
        if (this.state.stockList.length === 0)
            this.setState({ error: "Please select at least one stock!" })
        else {
            this.setState({ error: "", loading: true, img: false, img2: false, img3: false })
            fetch(`${this.link}data`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stockList: this.state.stockList
                })
            }).then(response => response.json()
            ).then(data => {
                console.log(data)
                this.setState({ img: data.img, img2: data.img2, img3: data.img3, loading: false })
            })
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
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    checkInput = (e) => {
        const { addStock, startDate, endDate, shares, stockCode, stockList } = this.state
        e.preventDefault()
        console.log(stockList)
        if (stockList.filter(e => e.stockCode === stockCode).length === 0) {
            stockList.push({ stockCode, shares, startDate: startDate.toLocaleDateString("en-GB"), endDate: endDate.toLocaleDateString("en-GB") })
            this.setState({ addStock: true, shares: false })
        }

    }

    addStock = () => {
        const { addStock, stockList } = this.state
        if (addStock) {
            return (
                stockList.map(i => {
                    return (
                        <tr key={i.stockCode} className="tableItem" >
                            <th>{i.stockCode}</th>
                            <th>{i.shares}</th>
                            <th>{i.startDate}</th>
                            <th>{i.endDate}</th>
                        </tr>
                    )
                })
            )
        }
    }
    stockOptions = () => {
        return (
            securitiesList.map(i => {
                return <option key={i["Stock Code"]} value={`${i["Stock Code"]} ${i["Name of Securities"]} `}>{i["Stock Code"]} {i["Name of Securities"]}</option>
            })
        )
    }
    render() {
        let { img, img2, img3, loading } = this.state
        return (
            <div className="selectorContainer">
                <form onSubmit={this.checkInput}>
                    <div className="selector">
                        <h3>Compare List</h3>
                        <div className="form-group">
                            <label htmlFor="stockCode">Stock Code</label>
                            <select name="stockCode" className="selectpicker form-control" data-live-search="true" onChange={this.handleInputChange}>
                                {this.stockOptions()}
                            </select>
                        </div>
                        <div>
                            <h4>Note that day trade is not yet supported!</h4>
                        </div>
                        <div className="form-group">
                            <p >Buy Date</p>
                            <DatePicker
                                className="form-control"
                                selected={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                maxDate={this.state.endDate}
                            />
                        </div>
                        <div className="form-group">
                            <p >Sell Date</p>
                            <DatePicker
                                className="form-control"
                                minDate={this.state.startDate}
                                maxDate={new Date}
                                selected={this.state.endDate}
                                onChange={this.handleEndDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="shares">Number of Shares</label>
                            <input type="number" className="form-control" id="shares" name="shares" value={this.state.shares} onChange={this.handleInputChange} required />
                        </div>
                    </div >
                    <button type="submit" className="btn btn-primary">Add</button>

                </form>
                <div className="paper">
                    <table className="StockTable">
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Number of Shares</th>
                                <th>Buying Date</th>
                                <th>Selling Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.addStock()}
                        </tbody>

                    </table>
                </div>
                <div>
                    <button className="btn btn-success" onClick={this.submitList}>Compare</button>
                    <div><h4>{this.state.error}</h4></div>
                    {loading && <h3>Loading.... (This may take a while)</h3>}
                </div>
                {img &&
                    <div>
                        <h3>Stock Price</h3>
                        <img src={`data:image/jpeg;base64,${this.state.img}`} />
                    </div>}
                {img2 &&
                    <div>
                        <h3>Cumulative Return</h3>
                        <img src={`data:image/jpeg;base64,${this.state.img2}`} />
                    </div>}
                {img3 &&
                    <div>
                        <h3>Total Market Price</h3>
                        <img src={`data:image/jpeg;base64,${this.state.img3}`} />
                    </div>}
            </div>
        )

    }
}

export default Selector;