// moment.format();

d3.select("#heading").style("color","white");
d3.selectAll("p").style("color", "black");
d3.select("body").style("background-color", "#eee");
// d3.select("body").transition().duration(500)
// .style("background-color", "#eee");

console.log("Hurray");

var formTF = document.getElementById("newToDo");

$('#newToDo').on('keydown', function(e) {
	if(e.keyCode == 13){
		updateList( formTF.value );
		formTF.value = "";
	}
});


var updateList = function( todo ) {

	var list = localStorage.getItem('list');
	list = JSON.parse(list);
	var checked = localStorage.getItem('checked');
	checked = JSON.parse(checked);

	if(list == null) {
		list = new Array();
		checked = new Array();
		list.push(todo);
		checked.push(0);
	}else {
		if(todo == "clear") {
			localStorage.removeItem('list');
			localStorage.removeItem('checked');
			$('#TDL').html("");
			return;
		}
		list.push(todo);
		checked.push(0);
	}

	console.log(list);
	localStorage.setItem('list', JSON.stringify(list));
	localStorage.setItem('checked', JSON.stringify(checked));

	location.reload();
}

var getList = function() {
	
	var list = localStorage.getItem('list');
	var checked = localStorage.getItem('checked');
	list = JSON.parse(list);
	checked = JSON.parse(checked);


	console.log(checked);

	var TDL = $('#TDL');

	if(list != null && checked!=null) {
		for (var i = list.length - 1; i >= 0; i--) {
			var checkbox = '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect"' + 
			'  for="checkbox-' + i + ' "><input type="checkbox" id="checkbox-' + i + ' " ' + 
			' class="mdl-checkbox__input" onclick="toggleCheck( ' + i + ' );" ' + (checked[i] == 0 ? "unchecked" : "checked") + '><span '+
			'class="mdl-checkbox__label">'+
			(checked[i] !=0 ? '<strike>' : '') + list[i] + (checked[i] !=0 ? '</strike>' : '') + '</span></label>';
			TDL.append('<li class="mdl-list__item">'+ checkbox + '</li>' );
		}
	}
}
getList();


var toggleCheck = function( i ) {
	console.log(i);
	var checked = localStorage.getItem('checked');
	checked = JSON.parse(checked);
	checked[i] = checked[i] == 0 ? 1 : 0;
	localStorage.setItem('checked', JSON.stringify(checked));
	location.reload();
}






// D3 Stuff

var data = [4, 8, 15, 16, 23, 42, 31,  20,  14, 33];
var stats = localStorage.getItem('stats');
stats = JSON.parse(stats);
if(stats!= null) {
	if(stats.length <=10)data = stats;
	else data = stats.slice(stats.length - 11);
}
data = data.reverse();
$('#numdays').html('Last ' + data.length + ' days performance');

var x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, Math.floor($('.chart').width())] );

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });



var now = moment().format('DD MMMM YYYY'); // December 4th 2016, 12:06:26 am
console.log(now);
$('#today').html(now);



// console.log(moment("20111031", "YYYYMMDD").fromNow()); // 5 years ago
// console.log(moment("20120620", "YYYYMMDD").fromNow()); // 4 years ago
console.log(moment().startOf('day').fromNow());        // 14 minutes ago
console.log(moment().endOf('day').fromNow());          // in a day
// console.log(moment().startOf('hour').fromNow());       // 14 minutes ago


var manageDate = function() {
	var str = localStorage.getItem('current');
	var today = moment().format('DD MMMM YYYY');
	if(str == null) {
		localStorage.setItem('current',today);
		return;
	}
	console.log("STORED: "+str);
	var prev  = moment(str, 'DD MMMM YYYY');

	if(prev.isSame(today)) {
		console.log("Same day");
	}else {
		localStorage.setItem('current',today);
		
		updateStats();
		newDay();
	}
}
manageDate();


var updateStats = function() {
	var arr = localStorage.getItem('checked');
	arr = JSON.parse(arr);

	var stats = localStorage.getItem('stats');
	stats = JSON.parse(stats);

	if(stats == null) {
		stats = new Array() ;
	}

	console.log("STATS:"+stats);

	if(arr.length == 0) {
		stats.push(100);
	}else {
		var total = arr.length;
		var completed = 0;
		for (var i = 0; i < arr.length; i++) {
			if(arr[i] == 1)completed++;
		}
		var per = completed/total * 100;
		stats.push(per);
	}
	localStorage.setItem('stats', JSON.stringify(stats) );
}


var newDay = function() {
	localStorage.removeItem('list');
	localStorage.removeItem('checked');
	location.reload();
}