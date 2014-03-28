// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


!(function($){
    $.get("/example.txt", function(data){ findPath(data)});
    function findPath(data){
        var rowSplited = data.split('\n'),
            rowSplitedLength = rowSplited.length,
            lastNodes = [];
        for(var i = 0 ; i <  rowSplitedLength; i++){
           if (i == 0) continue ;
           var nodes = rowSplited[i].split(' '),
               nodesCount = nodes.length,
               nodesWithBestPath = [];
            plotRow(nodes);
           for(var j = 0; j < nodesCount; j++){
               var thisNode = parseInt(nodes[j]),
                   first = j == 0,
                   last = j == nodesCount- 1;
               if (first && last){
                  nodesWithBestPath.push([thisNode, thisNode, [[i,j]]]);
               }
               else if(first){
                  var parentNodePath = lastNodes[0][2].slice(0);
                      parentNodePath.push([i,j]);
                  nodesWithBestPath.push([thisNode, thisNode + lastNodes[0][1], parentNodePath]);
               }
               else if(last){
                   var parentNodePath = lastNodes[j-1][2].slice(0);
                   parentNodePath.push([i,j]);
                   nodesWithBestPath.push([thisNode, thisNode + lastNodes[j-1][1], parentNodePath]);
               }
                else{
                   var bestParentNode = chooseBestUpperNode( lastNodes[j-1] , lastNodes[j]);
                   var parentNodePath = bestParentNode[2].slice(0);
                       parentNodePath.push([i,j]);
                   nodesWithBestPath.push([thisNode, thisNode+bestParentNode[1], parentNodePath]);
               }
           }
            lastNodes = nodesWithBestPath;
        }
        console.log(Math.max.apply(undefined, lastNodes.map(function(itm){  return itm[1]})));
        console.log(JSON.stringify(
            lastNodes.reduce(function(previousValue, currentValue, index, array){
                return previousValue[1] >= currentValue[1] ? previousValue : currentValue;
            })
        ))
    }
    function chooseBestUpperNode(first, second){
        return first[1] >= second[1] ? first : second ;
    }
    function plotRow(nodes){

    }
    function highLightPath(){

    }
})($)