        
async function generateKeyResult(key, TargetName,  mode){
            //For some unkown reason if KeyResult is called later it breaks the whole asynchronous thing and nothing works. 
            var combinationData =  await getData('../data/combined_data_v2.csv').then(async function(data) {return data;});
            var keyResultBanner =  await getData('../data/keyResultBanerData.csv').then(async function(data) {return data;});
            var combinedPercentData = await getData('../data/combined_percentage_data.csv').then(async function(data){return data;});

            //console.log("data from generateobjectiv1", combinationData);
            combinationDataCSVGroup = d3.group(await d3.csvParse(combinationData), d => d.OKR, d => d.Name);
            var Object2DataSet = combinationDataCSVGroup.get(key).get(undefined);
            //console.log(Object2DataSet);
            var DataContainerElemenets = document.getElementsByName(TargetName)[0];
            //console.log("Data container", DataContainerElemenets)
            constructDataForMaps(Object2DataSet, DataContainerElemenets);
            
            combinedPercentDataCSV = d3.group(await d3.csvParse(combinedPercentData), d => d.OKR, d => d.Name);
            combinedCSV = combinedPercentDataCSV.get(key).get(undefined);

            //console.log("Combined Percent Data",combinedCSV );
            ArrayOfValues = await getCategoryDeptValues(combinedCSV, mode).then(async function(data){return data;});
            //console.log("Array of Values", ArrayOfValues);
            //console.log("document",DataContainerElemenets.getElementsByClassName("percentOnTime"));


            //console.log("key Rsult Banner CSV",  keyResultBannerCSV2);
            keyResultBannerCSV = d3.group(await d3.csvParse(keyResultBanner), d => d.OKR, d => d.Name);

            var keyResultBannerCSV = keyResultBannerCSV.get(key).get(undefined);
            //console.log("CSV GET KEY", keyResultBannerCSV[0]);
            ArrayofKeyResults = await getCategoryDeptValues(keyResultBannerCSV, mode).then(async function(data){return data;});
            //console.log("Data Containers",  DataContainerElemenets.getElementsByClassName("dataSectpercentData"));
            //console.log("Array of Resukts", ArrayofKeyResults);
            setIndicators(ArrayofKeyResults,  DataContainerElemenets.getElementsByClassName("dataSectpercentData"), "number");

            if(mode==1){
                setIndicators(ArrayOfValues[0], DataContainerElemenets.getElementsByClassName("percentOnTime"), "number");
                setIndicators(ArrayOfValues[0], DataContainerElemenets.getElementsByClassName("dot"), "color");
                setIndicators(ArrayOfValues[1], DataContainerElemenets.getElementsByClassName("dataSectDenominator"), "number");
            }
            if(mode==2){
                setIndicators(ArrayOfValues[0], DataContainerElemenets.getElementsByClassName("percentOnTime"), "number");
                setIndicators(ArrayOfValues[0], DataContainerElemenets.getElementsByClassName("dot"), "color");
                setIndicators(ArrayOfValues[1], DataContainerElemenets.getElementsByClassName("dataSectDenominator"), "number");
                setIndicators(ArrayOfValues[2], document.getElementsByName(TargetName)[0].getElementsByClassName("dataSectNumerator"), "number");
            }


        }
    async function constructDataForMaps(KeyResultDataSet, DataContainer){
        DataContainer = DataContainer.getElementsByTagName("CANVAS");
        //console.log(DataContainer);
       // console.log("KeyResultDataSet", KeyResultDataSet);
        filteredDataObject = d3.group(KeyResultDataSet, d => d.category_or_dept);
       // console.log('FILteD DATA IN BEFORE LOOP', filteredDataObject);
        var start = 0;
        filteredDataObject.forEach((DataFromObject, index) => {
                var ArrayOfValues = splitData(DataFromObject, "permits");
                  // filteredDataObject = d3.group(DataFromObject, d => d.category_or_dept);
                //console.log(DataFromObject);
                //console.log(ArrayOfValues);
                //console.log(index);
                //console.log(DataContainer[start].id);

                ChartJSGenrate(ArrayOfValues[0], ArrayOfValues[1], 'line',  DataContainer[start].id, index, 'Percent fixed',index, false, false, false, false, false, false, false, false, false, 22);
                  start = start +1;   
           });
    }

    async function getCategoryDeptValues(data, mode){
        var arrayOfValues = [];
        var arrayOfDenominator = [];
        var arrayOfNumerator = [];
        data = filteredDataObject = d3.group(data, d => d.category_or_dept);

        data.forEach((DataFromObject, index) => {

var start = 0;
//console.log("Data 1s", index, DataFromObject);

        for(i = 0; i<DataFromObject.length; i++){
                

                       //   console.log(element[0].category_or_dept);
                       //console.log("Category", DataFromObject[i]);
                     if (DataFromObject[i].category_or_dept == "title") {
                           //     console.log("TITLE REACHED");
                                                      //     console.log(DataFromObject, DataFromObject[i].value);
                           arrayOfValues.push(DataFromObject[i].value);

                           arrayOfDenominator.push(DataFromObject[i].out_of_total);
                           arrayOfNumerator.push(DataFromObject[i].on_time);
                       } else {
                           //console.log(DataFromObject, DataFromObject[i].value);
                           arrayOfValues.push(DataFromObject[i].value);

                           arrayOfDenominator.push(DataFromObject[i].out_of_total);
                           arrayOfNumerator.push(DataFromObject[i].on_time)
                       }
                                      start = start +1;   

                                    };

                   });
                       arrayOfValues = arrayOfValues.map(Number);
    return [arrayOfValues,arrayOfDenominator,arrayOfNumerator];

    };


        // Function: GetData from URL
        // URL: String type
        // Type: ASYNC
        async function getData(url) {
            const response = await fetch(url);
            const data = await response.text();

            return data;
        };
 
        async function getLotsOfData(url1,url2, url3){
            var data1 = await getData(url1);
            var data2 = await getData(url2);
            var data3 = await getData(url3);
            return [data1, data2, data3];
        };
        // Function: Generates a Chart JS Chart
        // xAxisLabel - Array of lables
        // xAxis - Array of labels for the x axis
        // type - String defines type of chart, see chartjs documentation for types
        // chartCanvasID - string, this corresponds with the Canvas ID you want the chart in
        // XscaleLabelName - String for the X label
        // YscaleLabelName - String for Y label
        // LegendLabel - String Label for the legend
        // displayLegend - Boolean, True or False to display legend
        // displayXScale - Boolean, True or False to display X Scale
        // displayYScale - Boolan, True or False to display Y Scale
        // displayXTicks - Boolean, True or False to display X ticks
        // displayYTicks - Boolean, True or False to display Y  ticks
        // displayBorderGridLinesXAxis - Boolean, True or False to display X axis gridlines
        // displayBorderGridLinesYAxis - Boolean, True or False to display y axis gridlines
        // displayGridLinesXAxis, displayGridLinesYAxis - Boolean, True or False
        // numberOfValues - number of value
        //TYPE: ASYNC 
        async function ChartJSGenrate(xAxisLabel, xAxis, type, chartCanvasID, XscaleLabelName, YscaleLabelName, LegendLabel, displayLegend, displayXScale, displayYScale, displayXTicks, displayYTicks, displayBorderGridLinesXAxis, displayBorderGridLinesYAxis, displayGridLinesXAxis, displayGridLinesYAxis, numberOfValues) {
            var numberOfValues = -Math.abs(numberOfValues);
            //  console.log(numberOfValues);
            var ctx = document.getElementById(chartCanvasID).getContext('2d');
            var chartOptions = {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 0,
                        right: 50,
                        top: 5,
                        bottom: 0
                    }
                },
                tooltips: {
                    mode: 'nearest',
                    intersect: false
                },
                legend: {
                    display: displayLegend,
                    position: 'top',
                    labels: {
                        boxWidth: 500,
                        fontColor: 'red'
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: displayXTicks
                        },
                        gridLines: {
                            drawBorder: displayBorderGridLinesXAxis,
                            display: displayGridLinesXAxis,
                            color: "black"
                        },
                        scaleLabel: {
                            display: displayXScale,
                            labelString: XscaleLabelName,
                            fontColor: "red"
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: displayYTicks,
                            min: -100,
                            max: 100
                        },
                        gridLines: {
                            drawBorder: displayBorderGridLinesYAxis,
                            display: displayGridLinesYAxis,
                            color: "black",
                            borderDash: [2, 2],
                        },
                        scaleLabel: {
                            display: displayYScale,
                            labelString: YscaleLabelName,
                            fontColor: "green"
                        }
                    }]
                }
            };
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: type,

                // The data for our dataset
                data: {
                    labels: xAxisLabel.slice(numberOfValues),
                    datasets: [{
                            label: LegendLabel,
                            backgroundColor: '#9dc8f1',
                            borderColor: '#7cb5ec',
                            data: xAxis.slice(numberOfValues),
                            pointBackgroundColor: 'black',
                            pointBorderWidth: 1,
                            pointHoverBorderWidth: 2,
                            pointRadius: 5,
                            pointHitRadius: 10,
                        }

                    ]
                },

                // Configuration options go here
                options: chartOptions
            });
        }
        // Function: Splits the data between a dataset value and the time period
        // dataSet: 2D array, holds the data
        // keyValue: String, data you want. 
        // Type: NOT ASYNC
        // Returns: Array. 
        function splitData(dataSet, keyValue) {
            var dateInArray = [];
            var dataInArray = [];
            for (index = 0; index < dataSet.length; index++) { 
                dataInArray.push(dataSet[index].value);
                dateInArray.push(dataSet[index].date_or_period); 
                } 
            dataInArray2 = dataInArray.map(Number);
            return [dateInArray, dataInArray2];
        };
        // Function: Gets the Text data of object from url
        // URL: String data
        // TYPE: ASYNC
        // Return: Text Data Object
        async function getData(url) {
            const response = await fetch(url);

            const data = await response.text();
            return data;
        };
        

        // Function: Loads data to pipe into function to generate all charts
        // filteredData: a multi D array that is only for the data subject you want
        // keyData: Array, is the Keys of the data set
        // domElement: DOM Object Array this is a array of canvas elements
        // TYPE: ASYNC
        async function loadCharts(filteredData, keyData, domElement){
           // console.log("DOM ELEMENT OF CANVAS", domElement);
           // console.log("FitredData in Load charts", filteredData);
            keyData.forEach((element, index)=>{
               // console.log("filteredData Map Call", filteredData.get(keyData[index]));
               // console.log("Canavas element", domElement[index]);
                var dataArray = splitData(filteredData.get(keyData[index]), "");
                ChartJSGenrate(dataArray[0], dataArray[1], 'line',  domElement[index].id, keyData[index], 'Percent fixed',keyData[index], false, false, false, false, false, false, false, false, false, 22);
            });
        };
        // Function: changes the color indicators based on the percent calculation
        // percentageCalculation: Array, numbers of the percent
        // domElementL is a Array of span tags in the elebt
        // TYPE: ASYNC
        
       async function setIndicators(percentageCalculation, domElement, typeToSet){
            //console.log("DOM ELEMENT OF SPAN", domElement);
            //console.log("FitredData in Load charts", percentageCalculation);

            if(typeToSet == "color"){
                [].slice.call(domElement).forEach((div, index)=> {
                    //   console.log("DIV COLOR INDICATORS", div);
                       
                       if( div!==undefined){
                           if(percentageCalculation[index]>=95){
                               div.className = "dot greendot";
                           }
                           if(percentageCalculation[index]<95 && percentageCalculation[index]>=74){
                               div.className = "dot yellowdot";
                           }
                           if(percentageCalculation[index]<74){
                               div.className = "dot reddot";
       
                           }  
                       }});
            };
            if(typeToSet == "number"){
                [].slice.call(percentageCalculation).forEach((element, index)=> {
                    if( domElement[index]!==undefined){
                       // console.log(element);
                        domElement[index].innerHTML  = element;
                }
            });
            };
           
        }
