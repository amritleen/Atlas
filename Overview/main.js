compOverview_query("#loadingIcon").then((response) => {
    jQuery('#noOfComp').text(response[0]);
    jQuery('#noOfBacteria').text(response[1]);
    jQuery('#noOfFungus').text(response[2]);
});
var showLegend = true;

$(document).ready(function () {
    if(jQuery(window).width() < 770)
        showLegend = false;    
});
top50Genus_All_query("#loadingIcon").then((response) => {
  
    createChart('pie',response, "#chartGenus", showLegend);
});
top50Bacteria_query("#loadingIcon").then((response) => {
  
    createChart('pie',response, "#chartBacteria", showLegend);
});
top50Fungus_query("#loadingIcon").then((response) => {
  
    createChart('pie',response, "#chartFungus", showLegend);
}); 
compByYear_query("#loadingIcon").then((response) => {
   var yearArr = []; var countArr = [];
   yearArr.push('x');
   countArr.push('count');
    for(var i=0; i< response.length; i++){
        yearArr.push(response[i][0]);
        countArr.push(response[i][1]);
   }

    createLineGraph([yearArr, countArr],"#compCountDiv", "Year","Number of Compounds");
});

clusterCount_query("#loadingIcon").then((response) => {
    jQuery('#noOfClusters').text(response["cluster_count"]);
});

biggestClusterInfo_query("#loadingIcon").then((response) => {
    var label = document.getElementById("biggestClusterID");

    var a= document.createElement('a');    a.innerHTML=response["biggest_cluster_id"];   a.title =response["biggest_cluster_id"];

     a.href = "/joomla/index.php/explore/clusters#clusterID="+response["biggest_cluster_id"];
     label.appendChild(a);
    jQuery('#biggestClusterCount').text(response["count_of_compounds"]);
});

numberOfClustersBySize_query("#loadingIcon").then((response) => {
    var sizeArr = []; var countArr = [];
    sizeArr.push('x');
    countArr.push('Total Clusters');
    for(var i=0; i< response.length; i++){
        sizeArr.push(response[i][0]);
        countArr.push(response[i][1]);
    }

    createLineGraph([sizeArr, countArr],"#chartCluster", "Cluster Size","Number of Clusters");
});

nodeCount_query("#loadingIcon").then((response) => {
    jQuery('#noOfNodes').text(response["node_count"]);
});

biggestNodeInfo_query("#loadingIcon").then((response) => {
    var label = document.getElementById("biggestNodeID");

    var a= document.createElement('a');    a.innerHTML=response["biggest_node_id"];   a.title =response["biggest_cluster_id"];

     a.href = "/joomla/index.php/explore/nodes#nodeID="+response["biggest_node_id"];
     label.appendChild(a);
    jQuery('#biggestNodeCount').text(response["count_of_compounds"]);
});

numberOfNodesBySize_query("#loadingIcon").then((response) => {
    var sizeArr = []; var countArr = [];
    sizeArr.push('x');
    countArr.push('Total Nodes');
    for(var i=0; i< response.length; i++){
        sizeArr.push(response[i][0]);
        countArr.push(response[i][1]);
    }

    createLineGraph([sizeArr, countArr],"#chartNode", "Node Size","Number of Nodes");
});
var compWtArr = [];
compMolWt_query("#loadingIcon").then((response) => {
    var molWtArr = response;
    var countArr = []; var count = 1; var compWt = parseInt(molWtArr[0]) + 20;  var beforeMolWt = parseInt(molWtArr[0]);
    countArr.push("No of Compounds");
    for(var i=1; i<molWtArr.length; i++){
        if(compWt >= 2021)
            break;        
        else if(molWtArr[i] < compWt){
            count++;
        }        
        else{
         //   compWtArr.push(beforeMolWt+'-'+compWt);
            compWtArr.push(beforeMolWt);
            beforeMolWt = compWt;
            compWt += 20;
            compWt = parseInt(compWt.toFixed(4));
            countArr.push(count);          
            count = 1;
        }
    }
//    createBarGraph([countArr], "#chartMolWt",compWtArr, "Number of Compounds");
});
function calcBinMolWt(molWtArr, minMolWt){
    var countArr = []; var count = 1; var compWt = parseInt(minMolWt) + 20;  var beforeMolWt = parseInt(molWtArr[0]);
  //  countArr.push("No of Compounds");
    for(var i=1; i<molWtArr.length; i++){
        if(compWt >= 2021)
            break;        
        else if(molWtArr[i] < compWt){
            count++;
        }        
        else{
         //   compWtArr.push(beforeMolWt+'-'+compWt);
            compWtArr.push(beforeMolWt);
            beforeMolWt = compWt;
            compWt += 20;
            compWt = parseInt(compWt.toFixed(4));
            countArr.push(count);          
            count = 1;
        }
    }
    return countArr;    
}

compMolWtBac_Fungi_query("#loadingIcon").then((response) => {
    var bacMolWtArr = []; var fungiMolWtArr = [];
    for(var i=0; i<response.length; i++){
        if(response[i][1] === 1)
            bacMolWtArr.push(response[i][0]);
        else
            fungiMolWtArr.push(response[i][0]);
    }
    
    var countBacArr = calcBinMolWt(bacMolWtArr, Math.min(parseInt(bacMolWtArr[0]),parseInt(fungiMolWtArr[0])));
    var countFungArr = calcBinMolWt(fungiMolWtArr, Math.min(parseInt(bacMolWtArr[0]),parseInt(fungiMolWtArr[0])));
    var originArr = [];
    for(var i = 0; i < countBacArr.length; i++){
        originArr.push(countBacArr[i] + countFungArr[i]);
    }

    countBacArr.unshift('Bacteria');
    countFungArr.unshift('Fungus');
    originArr.unshift('Total');
 
    createBarGraph([countBacArr,countFungArr,originArr], "#chartMolWt",compWtArr, "Number of Compounds");
});

function createChart(chartType,columnsArray, divID, showLegend){
	
	var chart = c3.generate({
		data: {
			columns : columnsArray,
			type : chartType,
			onclick: function (d, i) { 
            },
            
			onmouseover: function (d, i) { 
	
			},
			onmouseout: function (d, i) { 
//			console.log("onmouseout", d, i); 
			}
        },
        legend: {
            show: showLegend,
            position : "right"
        },
		 bindto: divID
	});
}

function createLineGraph(columnsArray, divID,xLabel, yLabel){
    var chart = c3.generate({
        data: {
            x: 'x',
            columns: columnsArray
        },
        axis: {
            y: {
                label: 
                {
                    text: yLabel,
                    position: 'outer-middle'
                }                
            },
            x: {
                label: 
                {
                    text: xLabel,
                    position: 'outer-center'
                }                
            },
        },
        bindto: divID
    });
}
function createBarGraph(columnsArray, divID,categoryArr, yLabel){
    var chart = c3.generate({
        data: {
            columns: columnsArray,
            type: 'bar',
            groups: [
                ['Bacteria', 'Fungus', 'Total']
            ]
        },
        axis: {
            x: {
                type: 'category',
                categories: categoryArr,
                tick: {
                //    rotate: -30,
                    multiline: false,
                    culling: {
                        max: 10 // the number of tick texts will be adjusted to less than this value
                    }
                },
                label: 
                {
                    text: "Molecular Weight",
                    position: 'outer-center'
                } 
            //    height: 100
            },
            y: {
                label: 
                {
                    text: yLabel,
                    position: 'outer-middle'
                }                
            }
        },
        bar: {
            width: {
                ratio: 0.6
            }            
        },
        // legend: {
        //     show: false
        // },
        tooltip: {
            format: {
                title: function (d) { 
                    return  compWtArr[d] + "-"+ (compWtArr[d]+20);
                }
            }
        },       
        bindto: divID
    });
}