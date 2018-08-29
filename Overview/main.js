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

     a.href = "/joomla/index.php/explore/clusters#clusterID="+response["biggest_node_id"];
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