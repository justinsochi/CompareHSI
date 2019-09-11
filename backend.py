import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime
import pandas_datareader.data as web
import quandl
import io
import random
from flask import Flask, Response, send_file, jsonify, request
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from flask_cors import CORS, cross_origin
import json
# plt.show()
app = Flask(__name__)
cors = CORS(app)

date = None
dataDict = None


@app.route('/data',  methods=['GET', 'POST'])
@cross_origin()
def create_figure():
    data = request.data
    dataDict = json.loads(data)
    if len(dataDict["stockList"]):
        quandl.ApiConfig.api_key = "oVv3Y-xzfx8_dh-h-aou"

        plt.clf()

        fig = plt.figure(figsize=(16, 8)) 
        ax =  fig.add_subplot(1,1,1)

        fig2 = plt.figure(figsize=(16, 8)) 
        ax2 =  fig2.add_subplot(1,1,1)

        fig3 = plt.figure(figsize=(16, 8)) 
        ax3 =  fig3.add_subplot(1,1,1)

        profile = pd.DataFrame()

        for stock in dataDict['stockList']:
            start =  datetime.datetime.strptime(stock['startDate'], '%d/%m/%Y')
            end = datetime.datetime.strptime(stock['endDate'], '%d/%m/%Y')
            codeSplit = stock['stockCode'].split()

            code = "HKEX/" + str(int(codeSplit[0])).zfill(5)
            
            stockData = web.DataReader(code, 'quandl',start, end ,access_key="oVv3Y-xzfx8_dh-h-aou")
            stockData=stockData[::-1]

            ax.plot(stockData.index,stockData['NominalPrice'], label=stock['stockCode'])
            
            stockData['returns'] = stockData['NominalPrice'].pct_change(1)
            stockData['Cumulative Return'] = (1 + stockData['returns']).cumprod()
            ax2.plot(stockData.index,stockData['Cumulative Return'], label=stock['stockCode'])

            stockData['Market Value'] = stockData['NominalPrice']*int(stock['shares'])
            stockData = stockData[['Market Value']]
            stockData.columns = [code]
            profile = pd.concat([profile, stockData], axis=1)
            profile = profile.fillna(0)  
        
        profile['Total'] = profile.sum(axis=1)
        ax3.plot(profile.index,profile['Total'], label='Portfolio Market Value')
        print(profile)

        fig.legend()
        from io import BytesIO
        figfile = BytesIO()
        fig.savefig(figfile, format='png')
        figfile.seek(0)  
        import base64
        figdata_png = base64.b64encode(figfile.getvalue())

        fig2.legend()
        figfile2 = BytesIO()
        fig2.savefig(figfile2, format='png')
        figfile2.seek(0)  
        figdata_png2 = base64.b64encode(figfile2.getvalue())

        fig3.legend()
        figfile3 = BytesIO()
        fig3.savefig(figfile3, format='png')
        figfile3.seek(0)  
        figdata_png3 = base64.b64encode(figfile3.getvalue())
        
        return json.dumps({'img': figdata_png.decode("utf-8"),
                            'img2':figdata_png2.decode("utf-8") ,
                            'img3':figdata_png3.decode("utf-8")})


@app.route('/SharpeRatio',  methods=['GET', 'POST'])
@cross_origin()
def SharpRatio():
    data = request.data
    dataDict = json.loads(data)

    if len(dataDict["stockList"]):
        quandl.ApiConfig.api_key = "oVv3Y-xzfx8_dh-h-aou"

        plt.clf()

        fig = plt.figure(figsize=(16, 8)) 
        ax =  fig.add_subplot(1,1,1)

        profile = pd.DataFrame()

        start =  datetime.datetime.strptime(dataDict['startDate'], '%d/%m/%Y')
        end = datetime.datetime.strptime(dataDict['endDate'], '%d/%m/%Y')

        for stockCode in dataDict['stockList']:
            
            codeSplit = stockCode.split()

            code = "HKEX/" + str(int(codeSplit[0])).zfill(5)
            
            stockData = web.DataReader(code, 'quandl',start, end ,access_key="oVv3Y-xzfx8_dh-h-aou")
            stockData = stockData[['NominalPrice']]
            stockData.columns = [code]
            stockData=stockData[::-1]
            print(stockData.head())
            profile = pd.concat([profile, stockData], axis=1)
            profile = profile.fillna(0)  
        
        log_ret = np.log(profile/profile.shift(1))
        num_ports = 2500
        all_weights = np.zeros((num_ports,len(profile.columns)))
        ret_arr = np.zeros(num_ports)
        vol_arr = np.zeros(num_ports)
        sharpe_arr = np.zeros(num_ports)

        for ind in range(num_ports):

            # Create Random Weights
            weights = np.array(np.random.random(len(dataDict["stockList"])))

            # Rebalance Weights
            weights = weights / np.sum(weights)
            
            # Save Weights
            all_weights[ind,:] = weights

            # Expected Return
            ret_arr[ind] = np.sum((log_ret.mean() * weights) *252)

            # Expected Variance
            vol_arr[ind] = np.sqrt(np.dot(weights.T, np.dot(log_ret.cov() * 252, weights)))

            # Sharpe Ratio
            sharpe_arr[ind] = ret_arr[ind]/vol_arr[ind]

        print(sharpe_arr.max())

        plt.figure(figsize=(12,8))
        plt.scatter(vol_arr,ret_arr,c=sharpe_arr,cmap='plasma')
        plt.colorbar(label='Sharpe Ratio')
        plt.xlabel('Volatility')
        plt.ylabel('Return')

        max_sr_ret = ret_arr[sharpe_arr.argmax()]
        max_sr_vol = vol_arr[sharpe_arr.argmax()]

        # Add red dot for max SR
        plt.scatter(max_sr_vol,max_sr_ret,c='red',s=50,edgecolors='black')

        from io import BytesIO
        figfile = BytesIO()
        plt.savefig(figfile, format='png')
        figfile.seek(0)  
        import base64
        figdata_png = base64.b64encode(figfile.getvalue())
        
        ratio =  all_weights[sharpe_arr.argmax(),:].tolist()
        return json.dumps({'img': figdata_png.decode("utf-8"), 'highSharpeRatio': sharpe_arr.max(), 'ratio': ratio
        })

if __name__ == '__main__':
    app.debug = True
    app.run()
