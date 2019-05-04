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

  var svgwidth= window.innerWidth;
  var svgheight= window.innerHeight*0.9;

  var margins =
  {
    top:30,
    bottom:40,
    left:10,
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

  var axname1 = ['Health','Marriage','Work 30 Hours Less','',
                '','','','','Income > 120,000','% Increase in Happiness'];

  var axname2 = ['30k-60k Income','60k-90k Income','90k-120k Income','','','','','',
                 '30 years older','30 years younger'];

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
           })
           .on('mouseout',function(d){
             d3.select(this).style('fill',function(d){
               return d3.interpolateBuGn(d)
             })
             .attr('stroke','grey')
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

  var healthbuttons = [0,0.5,1];
  var incomebuttons = [0,1,2,3,4];
  var marriedbuttons = [0,1];
  var workhoursbuttons = [20,40,60,80,100];
  var agebuttons = [20,40,60,80,100]

  var buttonrowmake = function(data,row){

    menuPlot.selectAll('.button'+row).data(data).enter().append('circle')
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
            .attr('fill',d3.interpolatePuBu(0.3));
  }


   buttonrowmake(healthbuttons,0);
   buttonrowmake(incomebuttons,1);
   buttonrowmake(marriedbuttons,2);
   buttonrowmake(workhoursbuttons,3);
   buttonrowmake(agebuttons,4);

}


//startone();
console.log(startone());
console.log(starttwo());
