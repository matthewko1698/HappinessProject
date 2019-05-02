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

var individuals = [];

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
  var avind3 = newind(0,0,30.7,47.5,0);//work 10 hours less
  var avind4 = newind(0,0,40.7,67.5,0);//20 years older happiness
  var avind5 = newind(0,0,40.7,47.5,0);
  var avind6 = newind(0,0,40.7,47.5,1);//sixty
  var avind7 = newind(0,0,40.7,47.5,2);//ninety
  var avind8 = newind(0,0,40.7,47.5,3);//..
  var avind9 = newind(0,0,40.7,47.5,4);


  return [prob(avind0),prob(avind1),prob(avind2),prob(avind3),prob(avind4),
    prob(avind5),prob(avind6),prob(avind7),prob(avind8),prob(avind9)];

}
console.log(startone());
