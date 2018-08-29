var marvin_popup;
var marvinSketcherInstance_popup;
var NPAID_global = '';
var imageDataSource_global = '';
var inchi_global = '';
var mrv_global = '';
var compoundObject_global = {};

function hideAllColumn() {
     jQuery('input:checkbox').attr( "checked" , true );

 }

jQuery(document).ready(function handleDocumentReady (e) {

	$(document).keyup(function(e) {
		 if (e.keyCode == 27) { // escape key maps to keycode `27`
			editorControl.close();
		}
	});
	
  jQuery("#close").bind("click", function() {
    editorControl.close();
  });
   editorControl.open();
//   compoundID_compName_All(allCompCB, "#loadingIcon");

 /* compoundID_compName_All("#loadingIcon").then(function(response) {
		allCompCB(response);
	}, function(error) {
  console.error("Failed!", error);
}); */
	example_mol();   	

});

jQuery(window).load(function () {
	compNameFunction();
	npaIDFunc();
});


var CompoundMap = {}; var compoundDuplicateMap = [];
var compoundNames = [];

var compPromise = compoundID_compName_All("#loadingIcon");
compPromise.done(function(data){
	allCompCB(data);
});


function allCompCB(data){
	
		CompoundMap = {};
		compoundNames = [];
	
		
		data.forEach(function(tempComp){
			if(!CompoundMap[tempComp[1]]){
				CompoundMap[tempComp[1]] = tempComp[0];
				compoundNames.push(tempComp[1]);
			}else{
				compoundDuplicateMap.push(tempComp[1]);
			}
			
			
		});
		
		autoComplete("compoundName", compoundNames);
}
// event listener
var ecform = document.getElementById('explorecompounds');
if (ecform.attachEvent) {
  ecform.attachEvent("submit", process_form);
} else {
  ecform.addEventListener("submit", process_form);
}


var editorControl = (function() {

  var currentPict = null;

  var controlObject = {
    "picture" : function picture(pict) {
      currentPict = pict;
    }

	,"open" : function openEditor() {
      if(currentPict != null) {
        
	//	jQuery('#sketchImg').hide();
		
		if (document.contains(document.getElementById('marvin_sketchContainer'))){
			document.getElementById("marvin_sketchContainer").remove();
		}
		var cp = currentPict;
        
		var image=document.createElement("img");
	//	var imgData = marvin_popup.ImageExporter.mrvToDataUrl(mrv,"image/png",{"width" : 600, "height" : 600});
		if(cp != null)
		{
			image.setAttribute("src", cp.src);
		//	image.setAttribute("alt",escape(mrv));
			
			//var image_container=document.createElement('div');
			//image_container.setAttribute("id",'marvin_'+'sketchContainer');
			var image_container=document.getElementById("sketchContainer");
			image_container.innerHTML="";
			image_container.style.display="inline-block";
			image_container.style.backgroundColor ="white";
			image_container.style.styleFloat ="left";
		//	image_container.setAttribute("class","image-container");
			image_container.appendChild(image);
		//	document.getElementById('sketchContainer').appendChild(image_container);
		
		}
		
		jQuery("#popup").css("visibility", "visible");
		jQuery("#popup").css("opacity", 1);
      }
      
    }
	
    ,"close" : function closeEditor() {

      jQuery("#popup").css("visibility", "hidden");
      jQuery("#popup").css("opacity", 0);
    }
  };
  return controlObject;
}());

function clickOnImage(pict) {
  editorControl.picture(pict);
  editorControl.open();
}

function create_compound_info_title(prefix,npaid){
	var title=document.getElementById('compound_title');
	if(prefix)
		title.innerHTML=prefix+" "+npaid;
	else
		title.innerHTML=npaid;
}


function create_compound_info_table(compound_info,compound_info_id){
	document.getElementById(compound_info_id).innerHTML="";
  if (document.contains(document.getElementById(compound_info_id+"_table")))
  {
          document.getElementById(compound_info_id+"_table").remove();
  }
	if (document.contains(document.getElementById(compound_info_id+"_title")))
  {
          document.getElementById(compound_info_id+"_title").remove();
  }


	title=document.createElement("h3");	title.innerHTML="Compound Properties";	document.getElementById(compound_info_id).appendChild(title);
	title.setAttribute("id",compound_info_id+"_title");


	var table= document.createElement("table");	table.setAttribute("id",compound_info_id+"_table");	table.style.maxWidth = "540px";	table.style.tableLayout = "fixed"; table.style.border="0";

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.width = '40%'; th.style.textTransform= "uppercase";
	th.innerHTML="NPA ID";	line.appendChild(th);	var td=document.createElement("td");	 td.innerHTML=compound_info.npa_id;	line.appendChild(td);	table.appendChild(line);
	
	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Cluster ID";
	line.appendChild(th);	var td=document.createElement("td");
	
	var a= document.createElement('a');    a.innerHTML=compound_info.cluster_id;    a.title =compound_info.cluster_id;
   // a.href = "/joomla/index.php/explore/clusters#clusterID="+compound_info.cluster_id;
    a.href = "/joomla/index.php/explore/clusters#npaid="+compound_info.npa_id;
    td.appendChild(a);    line.appendChild(td);	table.appendChild(line);
	
	
	
	var line=document.createElement("tr");	var th=document.createElement("th");
	th.style.textTransform= "uppercase";	th.innerHTML="Node ID";	line.appendChild(th);	var td=document.createElement("td");
	
	var a= document.createElement('a');    a.innerHTML=compound_info.node_id;    a.title =compound_info.node_id;
   // a.href = "/joomla/index.php/explore/nodes#nodeID="+compound_info.node_id;
    a.href = "/joomla/index.php/explore/nodes#npaid="+compound_info.npa_id;
    td.appendChild(a);    line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr"); 	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Name(s)";	line.appendChild(th);
	var td=document.createElement("td");	td.innerHTML=compound_info.compound_names;	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Formula";
	line.appendChild(th);	var td=document.createElement("td");	td.innerHTML=compound_info.compound_molecular_formula;	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Molecular Weight (Da)";
	line.appendChild(th);	var td=document.createElement("td");	td.innerHTML=compound_info.compound_molecular_weight.toFixed(2);	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Accurate Mass (Da)";
	line.appendChild(th);	var td=document.createElement("td");	td.innerHTML=compound_info.compound_accurate_mass.toFixed(4);	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Origin Organism Type";
	line.appendChild(th);	var td=document.createElement("td");	td.innerHTML=compound_info.origin_type;	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Origin Genus";	line.appendChild(th);
	var td=document.createElement("td");	td.innerHTML=compound_info.genus;	line.appendChild(td);	table.appendChild(line);	var line=document.createElement("tr");
	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="Origin Species";	line.appendChild(th);	var td=document.createElement("td");
	td.innerHTML=compound_info.origin_species;	line.appendChild(td);	table.appendChild(line);	var line=document.createElement("tr");	var th=document.createElement("th");
	th.style.textTransform= "uppercase";	th.innerHTML="InchIKey";	line.appendChild(th);	var td=document.createElement("td");	td.innerHTML=compound_info.inchikey;
	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="InchI";	line.appendChild(th);	var td=document.createElement("td");	td.innerHTML=compound_info.compound_inchi;	td.style.maxWidth = "450px";	line.appendChild(td);	table.appendChild(line);

	var line=document.createElement("tr");	var th=document.createElement("th");	th.style.textTransform= "uppercase";	th.innerHTML="SMILES";	line.appendChild(th);
	var td=document.createElement("td");	td.innerHTML=compound_info.smiles;	td.style.maxWidth = "450px";	line.appendChild(td);	table.appendChild(line);
	document.getElementById(compound_info_id).appendChild(table);
}

function compNameFunction(){
	var compoundName = document.getElementById("compoundName").value;
	if (compoundName != "") {
      document.getElementById("npaid").readOnly='readOnly';
    }
	else
		document.getElementById("npaid").removeAttribute('readOnly');
}

function npaIDFunc(){
	var npaid = document.getElementById("npaid").value;
	if (npaid != "") {
      document.getElementById("compoundName").readOnly='readOnly';
    }
	else
		document.getElementById("compoundName").removeAttribute('readOnly');
}


function globalView(node_id, global_link_id){
	var div=document.getElementById(global_link_id);
	div.style.display="inline-block";
	
	var button=document.getElementById(global_link_id+"_button");
	jQuery(global_link_id).show();
	jQuery(global_link_id+"_button").show();
	button.setAttribute("onclick","window.location.href='/joomla/index.php/explore/global#nodeid="+node_id+"'");
 //	window.location='/joomla/index.php/explore/global#nodeid=1';
}

function create_reference_info_table(reference_info){
	jQuery('#isolationReference').show();
	var span=document.getElementById("doiReference");
	span.innerHTML='';
	var a= document.createElement('a');
	a.innerHTML=reference_info.reference_doi;
	a.title =reference_info.reference_doi;
	a.href = "http://doi.org/"+reference_info.reference_doi;
	a.setAttribute("target","_blank");
	a.style.wordBreak = "break-all";
	
	span.appendChild(a);
	
	var span1=document.getElementById("citReference");
	
	var citation= reference_info.author_list+' <b>'+
								reference_info.reference_title+'</b> <i>'+
								reference_info.journal_title+'</i>, <b>'+
								reference_info.reference_year+'</b>, <i>';
	
	if(reference_info.reference_issue && reference_info.reference_pages){
		citation += reference_info.reference_volume+'</i> ('+
								reference_info.reference_issue+'), '+
								reference_info.reference_pages+'.';
	}
	else if(reference_info.reference_pages && !reference_info.reference_volume && !reference_info.reference_issue){
		citation += reference_info.reference_pages+'.';
	}
	else if(reference_info.reference_pages && reference_info.reference_volume && !reference_info.reference_issue){
		citation += reference_info.reference_volume+'</i>, '+
								reference_info.reference_pages+'.';
	}
	else if(reference_info.reference_volume && reference_info.reference_pages){
		citation += reference_info.reference_volume+'</i>, '+
								reference_info.reference_pages+'.';
	}
	else if(reference_info.reference_issue)
		citation += reference_info.reference_volume+'</i> ('+
								reference_info.reference_issue+'). ';
	else if(reference_info.reference_volume)
		citation += reference_info.reference_volume+'</i> .';
	
	span1.innerHTML=citation;	
}


function create_info_table(id,info,textToDisplay){
	
	var resultDivContainer = document.getElementById(id);
	resultDivContainer.innerHTML = '';
	
	if(info.length > 0){
		
		jQuery('#' + id).show();
		var div1 = document.createElement("div");
		div1.setAttribute("class","row-fluid");
		
		var div2 = document.createElement("div");
		div2.setAttribute("class","span12");
		div2.innerHTML='<h3 style="text-align: center;">' + textToDisplay + '<h3>';
		
		div1.appendChild(div2);
		resultDivContainer.append(div1);
		
		for(var counter=0; counter < info.length; counter++){
			
			var div1 = document.createElement("div");
			div1.setAttribute("class","row-fluid");
			
			var div2 = document.createElement("div");
			div2.setAttribute("class","span12 resultReassignmentCount");
			div2.setAttribute("style", "width: 97.86%;");
			div2.innerHTML="<h3 class='g-title'>#"+(parseInt(counter)+1).toString()+"<h3>";
			
			div1.appendChild(div2);
			resultDivContainer.append(div1);
			
			var div3 = document.createElement("div");
			div3.setAttribute("class","row-fluid");
			div3.setAttribute("style","display:flex");
			
			var div4 = document.createElement("div");
			div4.setAttribute("class","span2 backgroundColName");
			var label1 = document.createElement("label");
			label1.innerHTML = "CITATION";
			div4.appendChild(label1);
			
			div3.appendChild(div4);
			
			div5 = document.createElement("div");
			div5.setAttribute("class","span10 backgroundValue");
			div5.setAttribute("style","margin-left:0");
			span1 = document.createElement("span");
			
			span1.setAttribute("style","margin-left:0");
			
			var citation= info[counter].author_list+', <b>'+
							info[counter].reference_title+'</b>, <i>'+
							info[counter].journal_title+'</i>, <b>'+
							info[counter].reference_year+'</b>, <i>'+
							info[counter].reference_volume+'</i>, ('+
							info[counter].reference_issue+'), '+
							info[counter].reference_pages+', '+
							info[counter].reference_doi+'.';
		
		
			span1.innerHTML=citation;
			div5.appendChild(span1);
			
			div3.appendChild(div5);
			resultDivContainer.append(div3);
			
			// ==============
			
			var div6 = document.createElement("div");
			div6.setAttribute("class","row-fluid");
			div6.setAttribute("style","display:flex");
			
			var div7 = document.createElement("div");
			div7.setAttribute("class","span2 backgroundColName");
			var label2 = document.createElement("label");
			label2.innerHTML = "DOI";
			div7.appendChild(label2);
			
			div6.appendChild(div7);
			
			div8 = document.createElement("div");
			div8.setAttribute("class","span10 backgroundValue");
			div8.setAttribute("style","margin-left:0");
			span2 = document.createElement("span");
			
			var a= document.createElement('a');
			a.innerHTML=info[counter].reference_doi;
		//	a.title =reassignment_info[counter].reference_doi;
			a.href = "http://doi.org/"+info[counter].reference_doi;
			a.setAttribute("target","_blank");
			span2.appendChild(a);
			
			div8.appendChild(span2);
			
			div6.appendChild(div8);
			resultDivContainer.append(div6);
			
		}
	}
	
	
}

function example_mol(){
	minmax_query(cbMinMax2, "#loadingIcon");
	function cbMinMax2(minmax){
		var url_params_object=get_url_params();
		if (!jQuery.isEmptyObject(url_params_object)){ //something in the url
			var tempNPAID = Object.keys(url_params_object);
			if(tempNPAID[0].toLowerCase() == "npaid"){				
				var mol=url_params_object[tempNPAID[0]];
				var dum=(mol.match(/\d+/g).map(Number))[0];
				if (dum >= parseInt(minmax['id_min']) && dum <= parseInt(minmax['id_max'])){
					document.getElementById('npaid').value=mol;
					var id = mol.match(/\d+/g).map(Number);
					drawCompProperties(id);
				}				
				else {					
					var error = "<h3> URL Compound not found in the NP Atlas Database.</h3>" +
								"<p> Please enter a properly formated NPA ID or a number between "+minmax["id_min"]+" and "+minmax["id_max"]+ ".</p> ";
					errorMsg(error);
				}
			}
		}
		else	
			jQuery('#enterDetails').show();
	}
}

function errorMsg(error){
	jQuery('.explore_results').show();
	jQuery('#error_msg').show();
	document.getElementById("error_msg").innerHTML=error;
	jQuery('#compound_title').hide();
	jQuery('#compound_info').hide();
	jQuery('#enterDetails').hide();
	
	jQuery('#lit_info').hide();
	jQuery('#isolationReference').hide();
	jQuery('#compReassignment').hide();
	jQuery('#totalSynthesis').hide();
}

function process_form(e){
	if (e.preventDefault) e.preventDefault();//safety

  // get form data
  var form_data= objectifyForm('explorecompounds');
	if(form_data.npaid){
		jQuery('.explore_results').show();
		jQuery('#compNotPresentDiv').hide();
		var response = compoundIDCheck(form_data.npaid);
		if(response == -1){
			minmax_query(cbMinMax,"#loadingIcon");
			function cbMinMax(minmax){
				var error = "<h3> Bad NPA ID provided.</h3>"+
										"<p> Your NPA ID is: "+form_data.npaid.trim()+". NPA ID are formated as follow: NPA123456."+
										" Please enter a properly formated NPA ID or a number between "+minmax["id_min"]+" and "+minmax["id_max"]+
										".</p> ";
				errorMsg(error);
			}
		}
		else{
			id = response;
			jQuery('#enterDetails').hide();
			jQuery('#isolationReference').hide();
			minmax_query(cbMinMax1,"#loadingIcon");
			function cbMinMax1(minmax){
				if (id >= minmax['id_min'] && id<= minmax['id_max']){
					window.location.hash='#npaid='+form_data.npaid;
					drawCompProperties(id);
				}
					
				else{
					var error = 
								"<h3> The provided NPA ID has not been found in the Natural Product Atlas Database.</h3>"+
								"<p> Your NPA ID is: NPA"+id.toString().padStart(6,"0")+". The Natural Product Atlas Database contains "+minmax['id_max']+
								" compounds, the last NPA ID is: NPA"+minmax['id_max'].toString().padStart(6,"0")+".</p> ";
					errorMsg(error);
				} 
			}
		}
	}
	else if(form_data.compoundName){
		if(compoundDuplicateMap.indexOf(form_data.compoundName) == -1){
			var npaid = CompoundMap[form_data.compoundName];
			if(npaid){
				drawCompProperties(npaid);
				jQuery('#enterDetails').hide();
				jQuery('#compNotPresentDiv').hide();
				window.location.hash='#npaid='+npaid;
			}
			else{
				jQuery('.explore_results').hide();
				jQuery('#compNotPresentDiv').show();
				jQuery('#enterDetails').hide();
				jQuery('.explore_results').hide();
			}
		}else{
			jQuery('.explore_results').hide();
			jQuery('#compNotPresentDiv').show();
			jQuery('#enterDetails').hide();
			jQuery('.explore_results').hide();
		}


	}
}

function drawCompProperties(id){
	jQuery('.explore_results').show();
	jQuery('#compound_title').show();
	jQuery('#compound_info').show();
	jQuery('#lit_info').show();
	jQuery('#error_msg').hide();

	// get compounds info + draw it and trace it
	compound_info_query(id, cbCompoundInfo,"#loadingIcon");
	function cbCompoundInfo(compound_info){
		compoundObject_global = compound_info;
		inchi_global = compound_info.compound_inchi;
		NPAID_global = compound_info.npa_id;
		console.log(NPAID_global);
		create_compound_info_title("Compound:",compound_info.npa_id);
	
		create_compound_info_table(compound_info,"compound_info_table");
			
		fetchCompoundStructure(compound_info.npa_id, "structure_container");

		globalView(compound_info.node_id,"global_link");
	}
	
	total_synthesis_info_query(id, cbTotalSynthesisInfo,"#loadingIcon");
	function cbTotalSynthesisInfo(synthesis_info){
			create_info_table("totalSynthesis",synthesis_info,"Total Synthesis");
	}

	// get reference info and table it
	reference_info_query(id, cbReferenceInfo,"#loadingIcon");
	function cbReferenceInfo(reference_info){
		create_reference_info_table(reference_info);
	}



	// get reassignment info and table it
	 reassignment_info_query(id,abc,"#loadingIcon");
	function abc(reassignment_info){
		 create_info_table("compReassignment",reassignment_info,"Compound Reassignment");
	}
}

function process_url_params(e){
	var url_params_object=get_url_params();
	if (!jQuery.isEmptyObject(url_params_object)) //something in the url
	{
		console.log('url_params_object: ',url_params_object);

		//fill form inputs
		document.getElementById('npaid').value=url_params_object['npaid'];

		//check the good search type

		process_form(jQuery('#btn-submit').trigger("click"));


	}// else do nothing
}

function downloadStructurePNG(){
	
	var filename = NPAID_global+".png";
	var element = document.createElement('a');
    element.setAttribute('href', imageDataSource_global);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
	
	
}

function downloadMol(){
	getMol(inchi_global,NPAID_global, cbMol,"#loadingIcon");
}

function cbMol(npaID,response){
//	console.log(response);
	var filename = npaID+".mol";
	var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function fetchCompoundStructure(npa_id, structureContainer){
			if (document.contains(document.getElementById('marvin_structure_title'))){
					document.getElementById('marvin_structure_title').remove();
			}
			if (document.contains(document.getElementById('marvin_'+structureContainer))){
					document.getElementById('marvin_'+structureContainer).remove();
			}
			var image=document.createElement("img");
			imageDataSource_global = "/custom/explore/compounds/png/"+ npa_id+"_hw500.png";
			image.setAttribute("src", imageDataSource_global);
			image.setAttribute("onclick","clickOnImage(this)");
			
			var structure_container=document.getElementById(structureContainer);
			var title=document.createElement("h3");
			title.setAttribute("id","marvin_structure_title");
			title.innerHTML="Compound Structure";
			var image_container=document.createElement('div');
			image_container.setAttribute("id",'marvin_'+"structure_container");
			image_container.innerHTML="";
			image_container.style.display="block";
			image_container.setAttribute("class","image-container");
			image_container.appendChild(image);
			image_container.style.cursor = "pointer";
			structure_container.insertBefore(title,structure_container.childNodes[0]);
			structure_container.insertBefore(image_container,structure_container.childNodes[1]);
}

function autoComplete(elementID, data){
	var $ = jQuery;
	var $input = $("#" + elementID);
	$input.typeahead({
		source: data,
		autoSelect: false
	});
}

function resetForm(){
	document.getElementById("explorecompounds").reset();
	jQuery('#enterDetails').show();
	jQuery('.explore_results').hide();
	document.getElementById("compoundName").removeAttribute('readOnly');
	document.getElementById("npaid").removeAttribute('readOnly');
	window.location.hash='';
}

function downloadTsv(){
	//console.log(compoundObject_global);
	downloadCSV(compoundObject_global.npa_id, compoundObject_global.inchikey, compoundObject_global.origin_type, compoundObject_global.genus, compoundObject_global.compound_names ,compoundObject_global.compound_molecular_weight.toFixed(2) ,compoundObject_global.compound_molecular_formula ,compoundObject_global.compound_inchi ,compoundObject_global.cluster_id ,compoundObject_global.compound_accurate_mass.toFixed(4));
}

function downloadCSV(npaid, inchiKey,origin,genus,compNames,compMolWt,compMolFormula,compInchi,clusterID,accMass,smiles){
	var compData = [
        {
            "NPA ID": npaid,
            "CLUSTER ID": clusterID,
            "NAME(S)": compNames,
			"FORMULA": compMolFormula,
			"MOLECULAR WEIGHT": compMolWt,
			"ACCURATE MASS": accMass,
			"GENUS": genus,
			"ORIGIN TYPE": origin,
			"INCHIKEY": inchiKey,
			"INCHI": compInchi
		//	"SMILES": smiles,
		}
    ];
	
	downloadCSVBrowser({data: compData,
	npaid :npaid });
}