var happiness = function(health,married,hours,age,income){

    if(income==0){
      return 0.3989+1.540*health+0.5037*married-0.01069*hours-0.07862*age+0.0007617*age*age
    }
    else if(income==1){
      return 0.3989+1.540*health+0.5037*married-0.01069*hours-0.07862*age+0.0007617*age*age+1.063
    }
    else if(income==2){
      return 0.3989+1.540*health+0.5037*married-0.01069*hours-0.07862*age+0.0007617*age*age+1.256
    }
    else if(income==3){
      return 0.3989+1.540*health+0.5037*married-0.01069*hours-0.07862*age+0.0007617*age*age+1.387
    }
    else if(income==4){
      return 0.3989+1.540*health+0.5037*married-0.01069*hours-0.07862*age+0.0007617*age*age+1.357
    }

}

var prob = function(individual){

  return 1/(1+Math.exp(-happiness(individual.health,individual.married,individual.hours,individual.age,individual.income)));

}



var newind = function(health,married,hours,age,income){
  return {
    health:health,
    married:married,
    hours:hours,
    age:age,
    income:income
  };
}

var startone = function(){

  //for the average individual...... they have a ____ higher chance to be happier if they are.. (healthy, etc)

  var avind0 = newind(0,0,40.7,47.5,0);
  var avind1 = newind(1,0,40.7,47.5,0);
  var avind2 = newind(0,1,40.7,47.5,0);
  var avind3 = newind(0,0,10.7,47.5,0);//work 30 hours less
  var avind4 = newind(0,0,40.7,77.5,0);//30 years older happiness
  var avind5 = newind(0,0,40.7,17.5,0);//30 years younger
  var avind6 = newind(0,0,40.7,47.5,1);//sixty
  var avind7 = newind(0,0,40.7,47.5,2);//ninety
  var avind8 = newind(0,0,40.7,47.5,3);//..
  var avind9 = newind(0,0,40.7,47.5,4);


  var probs = [prob(avind0),prob(avind1),prob(avind2),prob(avind3),prob(avind4),
               prob(avind5),prob(avind6),prob(avind7),prob(avind8),prob(avind9)];

  var differences = [probs[1]-probs[0],probs[2]-probs[0],probs[3]-probs[0],
                    probs[4]-probs[0],probs[5]-probs[0],probs[6]-probs[0],probs[7]-probs[0],
                    probs[8]-probs[0],probs[9]-probs[0],0];


  var svgheight= window.innerHeight*0.9;
  var svgwidth= window.innerWidth*0.50;

  var margins =
  {
    top:30,
    bottom:40,
    left:170,
    right:10
  }

  var width = svgwidth -margins.left - margins.right;
  var height = svgheight -margins.top - margins.bottom;

  var rscale = d3.scaleLinear().domain([0,0.35]).range([0,(height/2)-margins.top]);


  var svg = d3.select('.one').attr('width',svgwidth).attr('height',svgheight);

  var axlabel = [0.3,0.2,0.1,0.05];

  var axlabelcircle = [0.38,0.3,0.2,0.1,0.05]

  var names = ['Percent Effect','Health','Marriage','10 hours of less work',
              '20 years older','20 years younger','60,000 income','90,000 income',
              '120,000 income','>120,000 income'];

  var namesclass = ['Health','Marriage','10 hours of less work',
              '20 years older','20 years younger','60,000 income','90,000 income',
              '120,000 income','>120,000 income','Percent Effect'];

  var oscale = d3.scaleBand().domain(names).range([0,2*Math.PI]);
  var oscalearc = d3.scaleBand().domain(differences).range([0,2*Math.PI]);

  var overviewplot = svg.append('g').classed('plot',true)
                        .attr('transform',function(){
                            return 'translate('+margins.left+','+(margins.top)+')';
                        })

  var axislines = overviewplot.append('g').classed('axis',true)
                     .attr('transform',function(){
                       return 'translate('+width/3+','+(height/2)+')';
                     })

  axislines.selectAll('.lines').data(axlabelcircle).enter().append('circle')
           .classed('axline',true)
           .attr('cx',0)
           .attr('cy',0)
           .attr('r',function(d){
             return rscale(d);
           })
           .attr('fill',function(d){
             return d3.interpolatePuBu(d/1.8);
           })
           .style('stroke','white')
           .style('stroke-dasharray',('40','0'))
           .style('stroke-linecap','round')
           .style('stroke-width',1);

  var linegen = d3.line().x(function(d){return d.x;}).y(function(d){return d.y;});
  var arcgen = d3.arc().innerRadius(0).outerRadius(function(d){return rscale(d)})
                 .startAngle(function(d){return oscalearc(d)-0.15})
                 .endAngle(function(d){return oscalearc(d)+0.15})
                 .padAngle(0.03)
                 .cornerRadius(50);

  axislines.selectAll('.labeline').data(names).enter().append('path')
           .attr('d',linegen([{x:0,y:0},{x:0,y:rscale(0.30)}]))
           .style('stroke-width',0.7)
           .attr('stroke',d3.interpolatePuBu(0.9))
           .style('stroke-dasharray',('2','40'))
           .style('stroke-linecap','round')
           .attr('transform',function(d){
             return 'rotate('+oscale(d)*180/Math.PI+',0,0)';
           });

  var axname1 = ['Good Health','Marriage','Work 30 Hours Less','',
                '','','','','Income > 120k','% Increase in Happiness'];

  var axname2 = ['30k-60k Income','60k-90k Income','90k-120k Income','','','','','',
                 '30 years older','30 years younger'];

  var round = d3.format('.3n');

  axislines.selectAll('.axname1').data(names).enter().append('text')
           .classed('axname',true)
           .attr('x',0)
           .attr('y',-rscale(0.35))
           .text(function(d,i){
             return axname1[i]
           })
           .attr('transform',function(d,i){
             return 'rotate('+i*36+')';
           })
           .attr("text-anchor", "middle")
           .attr('fill',d3.interpolatePuBu(0.8));

 axislines.selectAll('.axname2').data(names).enter().append('text')
          .classed('axname',true)
          .attr('x',0)
          .attr('y',rscale(0.35))
          .text(function(d,i){
            return axname2[i]
          })
          .attr('transform',function(d,i){
            return 'rotate('+i*36+')';
          })
          .attr("text-anchor", "middle")
          .attr('fill',d3.interpolatePuBu(0.8));

  axislines.selectAll('.bars').data(differences).enter().append('path')
           .attr('d',arcgen)
           .attr('fill',function(d){
             return d3.interpolateBuGn(d)
           })
           .style('opacity',0.9)
           .attr('stroke','grey')
           .on('mouseover',function(d){
             d3.select(this).style('fill','white').attr('stroke','hotpink');

             svg.append('rect').attr('x',function(){
               return d3.mouse(this)[0]+25;
             })
             .attr('y',function(){
               return d3.mouse(this)[1]-25;
             })
             .attr('width',75)
             .attr('height',45)
             .classed('toptool',true)
             .attr('fill',d3.interpolatePuBu(0.9))
             .attr('rx',10)
             .style('opacity',0);

             svg.append('text').attr('x',function(){
               return d3.mouse(this)[0]+40;
             })
             .attr('y',function(){
               return d3.mouse(this)[1];
             })
             .text(function(){return round(d*100)+"%"})
             .classed('toptool',true)
             .attr('fill','white')
             .style('opacity',0)
             .style('font-family','Jura');

             d3.selectAll('.toptool').transition().duration(500).style('opacity',1);

           })
           .on('mouseout',function(d){
             d3.select(this).style('fill',function(d){
               return d3.interpolateBuGn(d)
             })
             .attr('stroke','grey');

             d3.selectAll('.toptool').transition().duration(50).style('opacity',0).remove();
           });

  axislines.selectAll('.percents').data(axlabel).enter().append('text')
           .classed('axtext',true)
           .attr('x',0)
           .attr('y',function(d){
             return rscale(-d)+5;
           })
           .text(function(d){
             return d*100+'%'
           })
           .attr('transform','rotate(-36,0,0)')
           .attr("text-anchor", "middle")
           .style('fill',function(d){
             return d3.interpolatePuBu(1-d/1.3)
           });





  //svg.selectAll()

  return differences;

}

var starttwo = function(){

  var individuals = [];

  var svgwidth= window.innerWidth;
  var svgheight= window.innerHeight*0.9;

  var margins =
  {
    top:100,
    bottom:10,
    left:30,
    right:50
  }

  var marginmenu = {
    left:300,
    right:10


  }

  var width = svgwidth -margins.left - margins.right;
  var height = svgheight -margins.top - margins.bottom;


  var svg = d3.select('.two').attr('width',svgwidth).attr('height',svgheight);

  var menuPlot = svg.append('g').classed('menu',true)
                        .attr('transform',function(){
                            return 'translate('+margins.left+','+(margins.top)+')';
                        });

  var compareplot = svg.append('g').classed('compare',true)
                        .attr('transform',function(){
                            return 'translate('+marginmenu.left+','+(margins.top)+')';
                        });

  var agedomain = [];

  for (var i = 0; i < 96; i++) {
    agedomain.push(i);
  }

  var incomedomain = [0,1,2,3,4];

  var hoursdomain = [];
  for (var i = 0; i < 101; i++) {
    hoursdomain.push(i);
  }

  var healthdomain = [];
  for (var i = 0; i < 101; i++) {
    healthdomain.push(i/100)
  }
  //return healthdomain;

  var happyscale = d3.scaleLinear().domain([0,1]).range([0,height]);
  var menuxscale1 = d3.scaleLinear().domain([0,4]).range([0,marginmenu.left-margins.right]);

  var menuyscale = d3.scaleLinear().domain([0,4]).range([0,height/1.5]);

  var healthbuttons = [0,5,10];
  var incomebuttons = [0,1,2,3,4];
  var marriedbuttons = [0,1];
  var workhoursbuttons = [20,40,60,80,100];
  var agebuttons = [20,40,60,80,100]

  var buttonrowmake = function(data,row){

    menuPlot.selectAll('.button'+row).data(data).enter().append('circle')
            .classed('button'+row,true)
            .classed('clicked',false)
            .attr('data-name',function(d,i){
              return "name"+row+d;
            })
            .attr('cx',function(d,i){
              return menuxscale1(i);
            })
            .attr('cy',function(d,i){
              return menuyscale(row)
            })
            .attr('r',8)
            .attr('fill',d3.interpolatePuBu(0.3))
            .on('click',function(d){

              d3.selectAll('.button'+row).classed('clicked',false)
                .attr('fill',d3.interpolatePuBu(0.3));
              d3.select(this).classed('clicked',true);

            })
            .on('mouseover',function(d){
              d3.select(this).style('cursor','pointer');

            });

    menuPlot.selectAll('.button'+row).each(function(d){
      d3.select(this).classed('value'+row+d,true);
    })

    menuPlot.selectAll('.mentext'+row).data(data).enter().append('text')
            .classed('menutext',true)
            .attr('x',function(d,i){
              return menuxscale1(i);
            })
            .attr('y',function(d,i){
              return menuyscale(row)+(menuyscale(row+1)-menuyscale(row))/4
            })
            .text(function(d,i,ar){

              if(ar.length==3){
                if(d==0){return "Poor"}
                else if(d==5){return "Fair"}
                else if(d==10){return "Great"};
              }
              else if(ar.length==2){
                if(d==0){return "No"}
                else if(d==1){return "Yes"}
              }
              else if(ar.length==5){
                if(d==0){return "<30k"}
                else if(d==1){return "30k-60k"}
                else if(d==2){return "60k-90k"}
                else if(d==3){return "90k-120k"}
                else if(d==4){return ">120k"}
                else{return d}
              }
              else{return "test"};

            })
            .attr("text-anchor", "middle")
            .attr('fill',d3.interpolatePuBu(0.9));

    menuPlot.append('text')
            .attr('x',function(d){
                return menuxscale1(0.5);
            })
            .attr('y',function(d){
              return menuyscale(row)-(menuyscale(row+1)-menuyscale(row))/4
            })
            .classed('menutext',true)
            .text(function(d){
              if(row==0){
                return "Health"
              }
              else if(row==2){
                return 'Marriage'
              }
              else if(row==1){
                return "Income"
              }
              else if(row==3){return "Working Hours (Including Overtime)"}
              else if(row==4){return "Age"}
              else{return "test"};
            });
  }




   buttonrowmake(healthbuttons,0);
   buttonrowmake(incomebuttons,1);
   buttonrowmake(marriedbuttons,2);
   buttonrowmake(workhoursbuttons,3);
   buttonrowmake(agebuttons,4);

   menuPlot.append('rect').attr('x',menuxscale1(0)).attr('y',menuyscale(5))
           .classed('create',true)
           .attr('width',80).attr('height',30)
           .attr('fill',d3.interpolatePuBu(0.3))
           .on('click',function(d){
             d3.selectAll('.create').transition(500)
               .attr('fill','black').on('end',function(d){
                 d3.selectAll('.create').transition(500)
                   .attr('fill',d3.interpolatePuBu(0.3));
               });
              var newper = []
              if(d3.select('.value00').classed('clicked')){newper.push(0)}
              else if (d3.select('.value05').classed('clicked')) {newper.push(0.5)}
              else if (d3.select('.value010').classed('clicked')) {newper.push(1)}
              else{newper.push(0)};

              if(d3.select('.value20').classed('clicked')){newper.push(0)}
              else if (d3.select('.value21').classed('clicked')) {newper.push(1)}
              else{newper.push(0)};

              if(d3.select('.value320').classed('clicked')){newper.push(20)}
              else if (d3.select('.value340').classed('clicked')) {newper.push(40)}
              else if (d3.select('.value360').classed('clicked')) {newper.push(60)}
              else if (d3.select('.value380').classed('clicked')) {newper.push(80)}
              else if (d3.select('.value3100').classed('clicked')) {newper.push(100)}
              else{newper.push(0)};

              if(d3.select('.value420').classed('clicked')){newper.push(20)}
              else if (d3.select('.value440').classed('clicked')) {newper.push(40)}
              else if (d3.select('.value460').classed('clicked')) {newper.push(60)}
              else if (d3.select('.value480').classed('clicked')) {newper.push(80)}
              else if (d3.select('.value4100').classed('clicked')) {newper.push(100)}
              else{newper.push(20)};

              if(d3.select('.value10').classed('clicked')){newper.push(0)}
              else if (d3.select('.value11').classed('clicked')) {newper.push(1)}
              else if (d3.select('.value12').classed('clicked')) {newper.push(2)}
              else if (d3.select('.value13').classed('clicked')) {newper.push(3)}
              else if (d3.select('.value14').classed('clicked')) {newper.push(4)}
              else{newper.push(0)};

              console.log(newper);

              var mockind = newind(newper[0],newper[1],newper[2],newper[3],newper[4]);

              console.log(mockind);

              createInd(mockind);
           })
           .on('mouseover',function(d){
             d3.select(this).style('cursor','pointer');

           });

   menuPlot.append('rect').attr('x',menuxscale1(2)).attr('y',menuyscale(5))
           .classed('remove',true)
           .attr('width',80).attr('height',30)
           .attr('fill',d3.interpolatePuBu(0.3))
           .on('click',function(d){
             d3.selectAll('.remove').transition(500)
               .attr('fill','black').on('end',function(d){
                 d3.selectAll('.remove').transition(500)
                   .attr('fill',d3.interpolatePuBu(0.3));
               });

             compareplot.selectAll('.individual').transition().style('opacity',0 )
               .remove();

             compareplot.selectAll('.percentline').transition().style('opacity',0).remove();

             compareplot.selectAll('.percentnum').transition().style('opacity',0).remove();

             compareplot.selectAll('.tooltip').transition()
                        .duration(1000).style('opacity',0).remove();
           })
           .on('mouseover',function(d){
             d3.select(this).style('cursor','pointer');

           });

  menuPlot.append('text').attr('x',menuxscale1(0)+(menuxscale1(1)+menuxscale1(0))/2+7).attr('y',menuyscale(5)+(menuyscale(5)-menuyscale(4))/2)
          .text('New Individual')
          .attr('text-anchor','middle')
          .style('font-family','Advent Pro')
          .attr('fill',d3.interpolatePuBu(0.9));

  menuPlot.append('text').attr('x',menuxscale1(2)+(menuxscale1(1)+menuxscale1(0))/2+7).attr('y',menuyscale(5)+(menuyscale(5)-menuyscale(4))/2)
          .text('Remove All')
          .attr('text-anchor','middle')
          .style('font-family','Advent Pro')
          .attr('fill',d3.interpolatePuBu(0.9))

  return d3.select('.value00').classed('clicked');

}

var createInd = function(individual){

  var svgwidth= window.innerWidth;
  var svgheight= window.innerHeight*0.9;

  var margins =
  {
    top:100,
    bottom:10,
    left:30,
    right:50
  }

  var marginmenu = {
    left:300,
    right:10


  }

  var width = svgwidth -margins.left - margins.right;
  var height = svgheight -margins.top - margins.bottom;

  var compareplot = d3.select('.compare');

  var happyYscale = d3.scaleLinear().domain([0,1]).range([height,0]);

  var round = d3.format('.3n');

  var linegen = d3.line().x(function(d){return d.x;}).y(function(d){return d.y;}).curve(d3.curveCatmullRom);

  compareplot.append('circle')
             .attr('cx',function(d){
               return (width-marginmenu.left)/2;
             })
             .attr('cy',function(d){
               return happyYscale(prob(individual))
             })
             .attr('r',10)
             .classed('individual',true)
             .style('opacity',0)
             .style('fill',function(d){

               return d3.interpolateRdYlGn(prob(individual));
             })
             .style('stroke-width',1)
             .style('stroke','black')
             .on('mouseover',function(d){

               compareplot.append('path')
                          .attr('d',linegen(
                            [{x:(width-marginmenu.left)/2+60,y:happyYscale(1)},
                             {x:(width-marginmenu.left)/2+50,y:happyYscale(0.98)},
                             {x:(width-marginmenu.left)/2+35,y:happyYscale(prob(individual))-10},
                             {x:(width-marginmenu.left)/2+20,y:happyYscale(prob(individual))},
                             {x:(width-marginmenu.left)/2+35,y:happyYscale(prob(individual))+10},
                             {x:(width-marginmenu.left)/2+50,y:happyYscale(0.03)},
                             {x:(width-marginmenu.left)/2+60,y:happyYscale(0)}]))
                          .style('stroke-width',0.75)
                          .attr('stroke','black')
                          .attr('fill','none')
                          .classed('tooltip',true);

               compareplot.append('text')
                          .attr('x',function(d){
                            return (width-marginmenu.left)/2+230;
                          })
                          .attr('y',happyYscale(0.88))
                          .text(function(d){
                            return 'Probability of Happiness: '+round(prob(individual)*100) + '%'
                          })
                          .classed('tooltip',true)
                          .classed('tooltext',true)
                          .attr('text-anchor','middle');

               compareplot.append('text')
                          .attr('x',function(d){
                            // return (width)-(marginmenu.left)*1.75
                            return (width-marginmenu.left)/2+220;

                          })
                          .attr('y',happyYscale(0.72))
                          .text(function(d){
                            if(individual.health==0){return "Health: Poor"}
                            else if(individual.health==0.5){return "Health: Fair"}
                            else if(individual.health==1){return "Health: Great"}
                          })
                          .classed('tooltip',true)
                          .classed('tooltext',true)
                          .attr('text-anchor','middle');

               compareplot.append('text')
                          .attr('x',function(d){
                            // return (width)-(marginmenu.left)*1.75
                            return (width-marginmenu.left)/2+220;
                          })
                          .attr('y',happyYscale(0.56))
                          .text(function(d){
                            if(individual.income==0){return "Income: <30k"}
                            else if(individual.income==1){return "Income: 30k-60k"}
                            else if(individual.income==2){return "Income: 60k-90k"}
                            else if(individual.income==3){return "Income: 90k-120k"}
                            else if(individual.income==4){return "Income: >120k"}
                          })
                          .classed('tooltip',true)
                          .classed('tooltext',true)
                          .attr('text-anchor','middle');

               compareplot.append('text')
                          .attr('x',function(d){
                            // return (width)-(marginmenu.left)*1.75
                            return (width-marginmenu.left)/2+220;
                          })
                          .attr('y',happyYscale(0.40))
                          .text(function(d){
                            if(individual.married==0){return "Married: No"}
                            else if(individual.married==1){return "Married: Yes"}
                          })
                          .classed('tooltip',true)
                          .classed('tooltext',true)
                          .attr('text-anchor','middle');

               compareplot.append('text')
                          .attr('x',function(d){
                            // return (width)-(marginmenu.left)*1.75
                            return (width-marginmenu.left)/2+220;
                          })
                          .attr('y',happyYscale(0.24))
                          .text(function(d){
                            return "Hours: "+individual.hours;
                          })
                          .classed('tooltip',true)
                          .classed('tooltext',true)
                          .attr('text-anchor','middle');

               compareplot.append('text')
                          .attr('x',function(d){
                            // return (width)-(marginmenu.left)*1.75
                            return (width-marginmenu.left)/2+220;
                          })
                          .attr('y',happyYscale(0.08))
                          .text(function(d){
                            return "Age: "+individual.age;
                          })
                          .classed('tooltip',true)
                          .classed('tooltext',true)
                          .attr('text-anchor','middle');

               compareplot.selectAll('.tooltip').style('opacity',0);
               compareplot.selectAll('.tooltip').transition()
                          .duration(500).style('opacity',1);
             })
             .on('mouseout',function(d){

               compareplot.selectAll('.tooltip').transition()
                          .duration(50).style('opacity',0).remove();

             });




  compareplot.append('text')
            .attr('x',function(d){
              return 100;
            })
            .attr('y',function(d){
              return happyYscale(prob(individual))+6
            })
            .text(function(d){
              return round(prob(individual)*100)+'%';
            })
            .classed('menutext',true)
            .classed('percentnum',true)
            .style('opacity',0);


  compareplot.append('path')
             .attr('d',linegen(
               [{x:(width-marginmenu.left)/2-20,y:happyYscale(prob(individual))},
                {x:160,y:happyYscale(prob(individual))}]))
             .classed('percentline',true)
             .style('stroke-width',0.7)
             .style('stroke-dasharray',('2','20'))
             .attr('stroke','black')
             .style('opacity',0);

  compareplot.selectAll('.individual').transition().duration(750).style('opacity',0.7);
  compareplot.selectAll('.percentline').transition().duration(500).style('opacity',1);
  compareplot.selectAll('.percentnum').transition().duration(250).style('opacity',1);

  console.log(compareplot.classed('compare'));
}

//startone();
console.log(startone());
console.log(starttwo());
