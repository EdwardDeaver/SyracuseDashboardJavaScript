
// Function: Generate Key Result
// Purpose to genrate the data in a key result
// Variables:
// Key (String): Used to determine what objective and key result will be retrived from the combination csv data set
// TargetName(String): This is a name element of the container for the key result you want to target.
// mode(int): There are three different types for the side number data that are currently in use(FIND EXAMPLES OF EACH)
// keyMode(int): There are two different types of top level title inforation styles for key results.(FIND EXAMPLES OF EACH).
// combinationData(Data Object): Data object for the full data CSV
// keyResultBanner(Data Object): Data object for the key result titles data CSV
// combinedPercentData(Data Object): Data object for the left side numbers and the middle number data CSV
       async function generateKeyResult(key, TargetName, mode, keyMode, combinationData, keyResultBanner, combinedPercentData,money)
       {
       //	console.log("data from generateobjectiv1", combinationData);
       	combinationDataCSVGroup = d3.group(await d3.csvParse(combinationData), d => d.OKR, d => d.Name);
       	var Object2DataSet = combinationDataCSVGroup.get(key).get(undefined);
       	//console.log("the comimbination data csv", Object2DataSet);
		   var DataContainerElements = document.getElementsByName(TargetName)[0];
		   console.log("DATA CONTAINER ELEMNT TYPE");
		   console.log( typeof DataContainerElements);
       	//console.log("Data container", DataContainerElements)

       	combinedPercentDataCSV = d3.group(await d3.csvParse(combinedPercentData), d => d.OKR, d => d.Name);
       	combinedCSV = combinedPercentDataCSV.get(key).get(undefined);

       	//console.log("Combined Percent Data", combinedCSV);
       	ArrayOfValues = await getCategoryDeptValues(combinedCSV, mode).then(async function (data)
       	{
       		return data;
       	});
       	//console.log("Array of Values", ArrayOfValues);
       	//console.log("document",DataContainerElements.getElementsByClassName("percentOnTime"));


       	//console.log("key Rsult Banner CSV",  keyResultBannerCSV2);
       	keyResultBannerCSV = d3.group(await d3.csvParse(keyResultBanner), d => d.OKR, d => d.Name);

       	var keyResultBannerCSV = keyResultBannerCSV.get(key).get(undefined);
       	//console.log("CSV GET KEY", keyResultBannerCSV[0]);
       	ArrayofKeyResults = await getCategoryDeptValues(keyResultBannerCSV, keyMode).then(async function (data)
       	{
       		return data;
           });
           //console.log("KEY RESULTS DATA", ArrayofKeyResults);
       	//console.log("Data Containers",  DataContainerElements.getElementsByClassName("dataSectpercentData"));
       	//console.log("Array of Resukts", ArrayofKeyResults);
       	if (mode == 3)
       	{
       		//            console.log("OBJECTIVE 1 KR 2");
       		//          console.log("Objective 1 kr 2", ArrayofKeyResults);
       		ArrayOfValues2 = await getCategoryDeptValues(combinedCSV, mode).then(async function (data)
       		{
       			return data;
       		});
       		constructDataForMaps(Object2DataSet, DataContainerElements);
       		setIndicators(ArrayOfValues2[0], DataContainerElements.getElementsByClassName("project_dollars"), "money");
       		setIndicators(ArrayOfValues2[1], DataContainerElements.getElementsByClassName("authorized_dollars"), "money");
       		setIndicators(ArrayOfValues2[2], DataContainerElements.getElementsByClassName("spent_dollars"), "money");
       		setIndicators(ArrayOfValues2[3], DataContainerElements.getElementsByClassName("unspent_dollars"), "money");
       		setIndicators(ArrayOfValues[4], DataContainerElements.getElementsByClassName("percentOnTime"), "number");
       		setIndicators(ArrayOfValues[4], DataContainerElements.getElementsByClassName("dot"), "color", 1);
			   setIndicators(ArrayOfValues[5], DataContainerElements.getElementsByClassName("dataTitle"), "number");

       	}
       	else
       	{
       		constructDataForMaps(Object2DataSet, DataContainerElements);

       	}

       	if (keyMode == 1)
       	{
       		setIndicators(ArrayofKeyResults[0], DataContainerElements.getElementsByClassName("dataSectTitlePercentData"), "number");
       	}
       	if (keyMode == 2)
       	{
       		setIndicators(ArrayofKeyResults[0], DataContainerElements.getElementsByClassName("dataSectTitlePercentData"), "number");
       		setIndicators(ArrayofKeyResults[1], DataContainerElements.getElementsByClassName("dataSectTitleNumeratorData"), "number");
       		setIndicators(ArrayofKeyResults[2], DataContainerElements.getElementsByClassName("dataSectTitleDenominatorData"), "number");

           }
       	if (mode == 1)
       	{
       		setIndicators(ArrayOfValues[0], DataContainerElements.getElementsByClassName("percentOnTime"), "number");
			   setIndicators(ArrayOfValues[0], DataContainerElements.getElementsByClassName("dot"), "color", 1);
			   if(money==1){
				setIndicators(ArrayOfValues[1], DataContainerElements.getElementsByClassName("dataSectDenominator"), "money");

			   }
			   else{
				setIndicators(ArrayOfValues[1], DataContainerElements.getElementsByClassName("dataSectDenominator"), "number");

			   }
			   setIndicators(ArrayOfValues[3], DataContainerElements.getElementsByClassName("dataTitle"), "number");

       	}
       	if (mode == 2)
       	{
			   console.log(ArrayOfValues, DataContainerElements.getElementsByClassName("dataSectNumerator"));
       		setIndicators(ArrayOfValues[0], DataContainerElements.getElementsByClassName("percentOnTime"), "number");
			   setIndicators(ArrayOfValues[0], DataContainerElements.getElementsByClassName("dot"), "color", 1);
			if(money==1){
       		setIndicators(ArrayOfValues[1], DataContainerElements.getElementsByClassName("dataSectDenominator"), "money");
			   setIndicators(ArrayOfValues[2], DataContainerElements.getElementsByClassName("dataSectNumerator"), "money");
			}
			else{
				setIndicators(ArrayOfValues[1], DataContainerElements.getElementsByClassName("dataSectDenominator"), "number");
				setIndicators(ArrayOfValues[2], DataContainerElements.getElementsByClassName("dataSectNumerator"), "number");
			}
			   setIndicators(ArrayOfValues[3], DataContainerElements.getElementsByClassName("dataTitle"), "number");
		   }
		   

       }
// Function: constructDataForMaps
// Purpose construct the data and generate the charts
// Variables:
// KeyResultDataSet (MAP): the sorted csv of the key result data. 
// DataContainer(String): DOM element of the container you want to target.
       async function constructDataForMaps(KeyResultDataSet, DataContainer)
       {
       	DataContainer = DataContainer.getElementsByTagName("CANVAS");
       	//console.log(DataContainer);
       	// console.log("KeyResultDataSet", KeyResultDataSet);
       	filteredDataObject = d3.group(KeyResultDataSet, d => d.category_or_dept);
       	// console.log('FILteD DATA IN BEFORE LOOP', filteredDataObject);
       	var start = 0;
       	filteredDataObject.forEach((DataFromObject, index) =>
       	{
       		var ArrayOfValues = splitData(DataFromObject, "permits");
       		// filteredDataObject = d3.group(DataFromObject, d => d.category_or_dept);
       		//console.log(DataFromObject);
       		//console.log(ArrayOfValues);
       		//console.log(index);
       		//console.log("DataContainer ID", DataContainer[start].id);
       		//console.log(index.includes("_"));
       		if (index.includes("_"))
       		{
       		//	console.log(index);
       			index = index.substr(0, index.lastIndexOf("_"));
       		//	console.log(index);

       		}
       		try
       		{
       			ChartJSGenrate(ArrayOfValues[0], ArrayOfValues[1], 'line', DataContainer[start].id, index, 'Percent fixed', index, false, false, false, false, false, false, false, false, false, 22);
       			start = start + 1;
       		}
       		catch (error)
       		{
       		//	console.log(error.message);
       			start = start + 1;
       		}


       	});
       }

       async function getCategoryDeptValues(data, mode)
       {
       	if (mode == 1 || mode == 2)
       	{
       		var arrayOfValues = [];
       		var arrayOfDenominator = [];
			   var arrayOfNumerator = [];
			var nameOfCategory = [];
       		data = filteredDataObject = d3.group(data, d => d.category_or_dept);

       		data.forEach((DataFromObject, index) =>
       		{

       			var start = 0;
       			//console.log("Data 1s", index, DataFromObject);

       			for (i = 0; i < DataFromObject.length; i++)
       			{


       				//   console.log(element[0].category_or_dept);
       				//console.log("Category", DataFromObject[i]);
       				if (DataFromObject[i].category_or_dept == "title")
       				{
       					//     console.log("TITLE REACHED");
       					//     console.log(DataFromObject, DataFromObject[i].value);
       					arrayOfValues.push(DataFromObject[i].value);

       					arrayOfDenominator.push(DataFromObject[i].out_of_total);
       					arrayOfNumerator.push(DataFromObject[i].on_time);
       				}
       				else
       				{
       					//console.log(DataFromObject, DataFromObject[i].value);
       					arrayOfValues.push(DataFromObject[i].value);

       					arrayOfDenominator.push(DataFromObject[i].out_of_total);
						   arrayOfNumerator.push(DataFromObject[i].on_time);
						   nameOfCategory.push(DataFromObject[i].category_or_dept);
       				}
       				start = start + 1;

       			};

       		});
       		arrayOfValues = arrayOfValues.map(Number);
       		return [arrayOfValues, arrayOfDenominator, arrayOfNumerator, nameOfCategory];
       	}
       	if (mode == 3)
       	{
       		var project_dollars = [];
       		var authorized_dollars = [];
       		var spent_dollars = [];
       		var unspent_dollars = [];
			   var value = [];
			   var nameOfCategory = [];
       		data = filteredDataObject = d3.group(data, d => d.category_or_dept);

       		data.forEach((DataFromObject, index) =>
       		{

       			var start = 0;
       			//console.log("Data 1s", index, DataFromObject);

       			for (i = 0; i < DataFromObject.length; i++)
       			{


       				//   console.log(element[0].category_or_dept);
       				//console.log("Category", DataFromObject[i]);

       				//     console.log("TITLE REACHED");
       				//console.log("DataFromObject", DataFromObject[i]);
       				project_dollars.push(DataFromObject[i].project_dollars);

       				authorized_dollars.push(DataFromObject[i].authorized_dollars);
       				spent_dollars.push(DataFromObject[i].spent_dollars);
       				unspent_dollars.push(DataFromObject[i].unspent_dollars);
       				value.push(DataFromObject[i].value);
					   nameOfCategory.push(DataFromObject[i].category_or_dept);
       				start = start + 1;

       			};

       		});
       		return [project_dollars, authorized_dollars, spent_dollars, unspent_dollars, value, nameOfCategory];


		   }
		   
		   if (mode == 4)
       	{
       		var cardDescription = [];
       		var on_time = [];
       		var out_of_total = [];
       		var dataDescription = [];
			   var timeDescription = [];
			   var movement = [];
			   var color = [];
       		//data = filteredDataObject = d3.group(data, d => d.category_or_dept);
			console.log('Getting the array values', data);
       			for (i = 0; i < data.length; i++)
       			{
					console.log("Data from object", data[i]);


       				//   console.log(element[0].category_or_dept);
       				//console.log("Category", DataFromObject[i]);

       				//     console.log("TITLE REACHED");
       				//console.log("DataFromObject", DataFromObject[i]);
       				cardDescription.push(data[i].cardDescription);

       				on_time.push(data[i].on_time);
       				out_of_total.push(data[i].out_of_total);
       				dataDescription.push(data[i].dataDescription);
					   timeDescription.push(data[i].timeDescription);
					   movement.push(data[i].movement);
					   color.push(data[i].color);



       			};

       		return [cardDescription, on_time, out_of_total, dataDescription, timeDescription,movement,color];


		   }
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
       async function ChartJSGenrate(xAxisLabel, xAxis, type, chartCanvasID, XscaleLabelName, YscaleLabelName, LegendLabel, displayLegend, displayXScale, displayYScale, displayXTicks, displayYTicks, displayBorderGridLinesXAxis, displayBorderGridLinesYAxis, displayGridLinesXAxis, displayGridLinesYAxis, numberOfValues)
       {
       	var numberOfValues = -Math.abs(numberOfValues);
       	//  console.log(numberOfValues);
       	var ctx = document.getElementById(chartCanvasID).getContext('2d');
       	var chartOptions = {
       		maintainAspectRatio: false,
       		layout:
       		{
       			padding:
       			{
       				left: 0,
       				right: 50,
       				top: 5,
       				bottom: 0
       			}
       		},
       		tooltips:
       		{
       			mode: 'nearest',
       			intersect: false
       		},
       		legend:
       		{
       			display: displayLegend,
       			position: 'top',
       			labels:
       			{
       				boxWidth: 500,
       				fontColor: 'red'
       			}
       		},
       		scales:
       		{
       			xAxes: [
       			{
       				ticks:
       				{
       					display: displayXTicks
       				},
       				gridLines:
       				{
       					drawBorder: displayBorderGridLinesXAxis,
       					display: displayGridLinesXAxis,
       					color: "black"
       				},
       				scaleLabel:
       				{
       					beginAtZero: true,
       					display: displayXScale,
       					labelString: XscaleLabelName,
       					fontColor: "red"
       				}
       			}],
       			yAxes: [
       			{
       				ticks:
       				{
       					beginAtZero: true,
       					display: true,
       					suggestedMin: 0,
       					suggestedMax: 100,
       				},
       				gridLines:
       				{
       					drawBorder: displayBorderGridLinesYAxis,
       					display: displayGridLinesYAxis,
       					color: "black",
       					borderDash: [2, 2],
       				},
       				scaleLabel:
       				{
       					display: displayYScale,
       					labelString: YscaleLabelName,
       					fontColor: "green"
       				}
       			}]
       		}
       	};
       	var chart = new Chart(ctx,
       	{
       		// The type of chart we want to create
       		type: type,

       		// The data for our dataset
       		data:
       		{
       			labels: xAxisLabel.slice(numberOfValues),
       			datasets: [
       				{
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
       function splitData(dataSet, keyValue)
       {
       	var dateInArray = [];
       	var dataInArray = [];
       	var months = ["July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
       	for (index = 0; index < dataSet.length; index++)
       	{
       		dataInArray.push(dataSet[index].value);
       		dateInArray.push(dataSet[index].date_or_period);
       	}
       	dataInArray2 = dataInArray.map(Number);
       	dateInArray = dateInArray.map(Number);
       	//console.log(dateInArray);
       	if (dateInArray[dateInArray.length - 1] <= 12)
       	{
       		for (i = 0; i < dateInArray.length; i++)
       		{
       			dateInArray[i] = months[i];
       			//console.log(dateInArray[i]);
       		}
       	}
       	else
       	{
       		for (i = 0; i < dateInArray.length; i++)
       		{
       			d = new Date(dateInArray[i] * 1000);
       			dateInArray[i] = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
       			//console.log(dateInArray[i]);
       		}
       	}
       //	console.log(dateInArray);
       	return [dateInArray, dataInArray2];
       };
// Function: Gets the Text data of object from url
// Variables:
// URL: String data
// TYPE: ASYNC
// Return: Text Data Object
       async function getData(url)
       {
       	const response = await fetch(url,
       	{
       		cache: "no-cache"
       	});
       	const data = await response.text();
       	return data;
       };


       // Function: changes the color indicators based on the percent calculation
       // percentageCalculation: Array, numbers of the percent
       // domElementL is a Array of span tags in the elebt
       // TYPE: ASYNC

       async function setIndicators(percentageCalculation, domElement, typeToSet, mode)
       {
       	//console.log("DOM ELEMENT OF SPAN", domElement);
       	//console.log("FitredData in Load charts", percentageCalculation);

		if (typeToSet == "money")
		{
			[].slice.call(percentageCalculation).forEach((element, index) =>
			{
				if (domElement[index] !== undefined)
				{
				 console.log(element);
					domElement[index].innerHTML = formatMoney(element);
				}
			});
		};	
       	if (typeToSet == "color"){
			if(mode==1){
				[].slice.call(domElement).forEach((div, index) =>{
					//   console.log("DIV COLOR INDICATORS", div);
					if (div !== undefined){
						if (percentageCalculation[index] >= 95)
						{
							div.className = "dot greendot";
						}
						if (percentageCalculation[index] < 95 && percentageCalculation[index] >= 74)
						{
							div.className = "dot yellowdot";
						}
						if (percentageCalculation[index] < 74)
						{
							div.className = "dot reddot";

						}
					}
				});
			}
			if(mode==2){
				[].slice.call(domElement).forEach((div, index) =>{
					   console.log("DIV COLOR INDICATORS", div.getElementsByClassName("progesssMessage"));
					if (div !== undefined){
						divProgresssMessage = div.getElementsByClassName("progesssMessage");

						if (percentageCalculation[index] ==2)
						{
							div.className = "card-header bg-success";
							divProgresssMessage[0].innerHTML = "Success";
							console.log("DIV PROGRESS ", divProgresssMessage);
						}
						if (percentageCalculation[index] == 1)
						{
							divProgresssMessage = div.getElementsByClassName("On Our Way");
							div.className = "card-header  bg-warning";
						}
						if (percentageCalculation[index] ==0)
						{
							div.className = "card-header bg-danger";
							divProgresssMessage = div.getElementsByClassName("Problem Solving");

						}
					}
				});
			}

			if(mode==3){
				[].slice.call(domElement).forEach((div, index) =>{
					   console.log("DIV COLOR INDICATORS", div);
					if (div !== undefined){
						if (percentageCalculation[index] ==1)
						{
							div.className = "indicator fas  fa-arrow-up";
						}
						if (percentageCalculation[index] == 0)
						{
							div.className = "indicator fas  fa-arrows-alt-h";
						}
						if (percentageCalculation[index] ==-1)
						{
							div.className = "indicator fas fa-arrow-down";

						}
					}
				});
			}
       	};
       	if (typeToSet == "number")
       	{

       		[].slice.call(percentageCalculation).forEach((element, index) =>
       		{
       			if (domElement[index] !== undefined)
       			{
       				// console.log(element);
       				domElement[index].innerHTML = element;
       			}
       		});
		   };
		

		   if (typeToSet == "date")
       	{
       		for(i =0; i<domElement.length;i++){
				   domElement[i].innerHTML = percentageCalculation;
			   }
       	};

	   }
	   async function generateKeyBoxResult(key, TargetName, data)       {
       //	console.log("data from generateobjectiv1", combinationData);
	   dataCSV = d3.group(await d3.csvParse(data), d => d.obj, d => d.Name);
	   console.log(dataCSV);
       	var dataCSVGrouped = dataCSV.get(key).get(undefined);
       	console.log("the comimbination data csv", dataCSVGrouped);
       	var DataContainerElements = document.getElementsByName(TargetName)[0];
       	console.log("Data container", DataContainerElements)

       	ArrayOfValues = await getCategoryDeptValues(dataCSVGrouped, 4).then(async function (data)
       	{
       		return data;
		   });
		   console.log("MOVEMENT", ArrayOfValues[5]);

		   ArrayOfValues[5] = ArrayOfValues[5].map(Number);
		   ArrayOfValues[6] = ArrayOfValues[6].map(Number);

		   console.log("MOVEMENT", ArrayOfValues[5]);
console.log("Array of values in generate", ArrayOfValues);
console.log(DataContainerElements);
console.log(DataContainerElements.getElementsByClassName("goalMessage"));
setIndicators(ArrayOfValues[0], DataContainerElements.getElementsByClassName("goalMessage"), "number");
setIndicators(ArrayOfValues[1], DataContainerElements.getElementsByClassName("dataSectNumerator"), "number");
setIndicators(ArrayOfValues[2], DataContainerElements.getElementsByClassName("dataSectDenominator"), "number");
setIndicators(ArrayOfValues[3], DataContainerElements.getElementsByClassName("dataDescription"), "number");
setIndicators(ArrayOfValues[4], DataContainerElements.getElementsByClassName("timeDescription"), "number");
setIndicators(ArrayOfValues[6], DataContainerElements.getElementsByClassName("card-header"), "color", 2);
setIndicators(ArrayOfValues[5], DataContainerElements.getElementsByClassName("indicator"), "color", 3);


	   }

async function setDateData(url,TargetName){
	//var dateData =  dateData(url).then(function(data) {
	//	console.log("inside function data", data)
	//	return data;
	//});
	var dateData =    await getData(url).then(async function(data) {return data;});
	console.log(dateData);
	dateData = JSON.parse(dateData);
	date = new Date(dateData[0].commit.author.date );
	months = ["January", "February","March","April","May","June","July","Auguest","September","October","November","December"]
	dateYouWant =  ""+months[date.getMonth()]+" "+date.getDate();
	var DataContainerElements = document.getElementsByName(TargetName)[0];
	setIndicators(dateYouWant, DataContainerElements.getElementsByClassName("date"), "date");


}

//formats money
function formatMoney(number) {
	number = parseInt(number,10);
	return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }