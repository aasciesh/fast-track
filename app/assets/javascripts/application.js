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
    $(document).ready(  function(){
            $.get("/tree.txt", function(data){ findPopularRoute(data)});
    }
    );
    function findPopularRoute(data){
        /* Splitting into rows and going through each of them. lastNodes keeps track of last row nodes. */
        var rowSplit = data.split('\n'),
            rowSplitLength = rowSplit.length,
            lastNodes = [];
        for(var i = 0 ; i <  rowSplitLength; i++){
           if (i == 0) continue ;
           var nodes = rowSplit[i].split(' '),
               nodesCount = nodes.length,
               nodesWithPopularRoute = [];
            plotRow(nodes);
           /* Row split into nodes and going through each nodes */
           for(var j = 0; j < nodesCount; j++){
               var thisNode = parseInt(nodes[j]),
                   first = j == 0,
                   last = j == nodesCount- 1;
               /* Node chooses best route from top to itself by choosing best route between two parents possible
                    ( top most node has not parent, first and last node of the row/level can only have one parent),
                  And, Node's information is kept in nodesWithPopularRoute(and to lastNodes)
                  for use in determining best path for Nodes in next row */
               if (first && last){
                  nodesWithPopularRoute.push([thisNode, thisNode, [[i,j]]]);
               }
               else if(!first && !last){
                   var bestParentNode = chooseBestParentNode( lastNodes[j-1] , lastNodes[j]);
                   var parentNodePath = bestParentNode[2].slice(0);
                   parentNodePath.push([i,j]);
                   /* Node information consists of it's value, sum of nodes of best route to it and point of nodes of best route*/
                   nodesWithPopularRoute.push([thisNode, thisNode+bestParentNode[1], parentNodePath]);
               }else{
                   var parentIndex = first ? 0 : j-1
                   var parentNodePath = lastNodes[parentIndex][2].slice(0);
                   parentNodePath.push([i,j]);
                   nodesWithPopularRoute.push([thisNode, thisNode + lastNodes[parentIndex][1], parentNodePath]);
               }
           }

            lastNodes = nodesWithPopularRoute;
        }
        /* So, each of last row nodes will have information about most popular route to themselves.
        * Hence we select node with popular route which is also the best of all possible routes*/
        console.log(Math.max.apply(undefined, lastNodes.map(function(itm){  return itm[1]})));
        console.log(JSON.stringify(
            lastNodes.reduce(function(previousValue, currentValue){
                return previousValue[1] >= currentValue[1] ? previousValue : currentValue;
            })
        ))
        highLightPopularRoute(
            lastNodes.reduce(function(previousValue, currentValue){
            return previousValue[1] >= currentValue[1] ? previousValue : currentValue;
        })
        );

    }
    function chooseBestParentNode(first, second){
        return first[1] >= second[1] ? first : second ;
    }
    function plotRow(nodes){
        var newRow = $("<div class='row'></div>");
        $.each(nodes, function(index, itm){
            newRow.append($("<div></div>").addClass('cell').text(itm));
        });
        $("#show_pony").append(newRow);
    }
    function highLightPopularRoute(node){
        $.each($('#show_pony>.row'), function(indx){
            $(this).find('.cell').eq(node[2][indx][1]).addClass('highlighted');
        });
        $('#total').text(node[1]);
    }
})($);