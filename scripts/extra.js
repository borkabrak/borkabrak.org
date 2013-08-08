/*
 *  Supplemental functions for javascript.
 */

// We don't put things on Math.prototype, because Math is not a constructor.
Math.seq = function(x,y,step){
    // Return a sequence of integers
    //
    //      * Two parameters represent start and endpoints (non-inclusive) 
    //              (4,10)      => [4,5,6,7,8,9]
    //
    //      * One param (x) returns 0..x
    //              (10)        => [0,1,2,3,4,5,6,7,8,9]
    //
    //      * 'step' is the difference between each element (default: 1)
    //              (4,10,2)    => [4,6,8]
    //
    //      * If y > x, return a descending array
    //              (10,4)      => [10,9,8,7,6,5]
    //
    //      * You can give a negative step, but its absolute value is all that
    //      matters.  This prevents confusion (and endless loops), i.e., when
    //      counting down, do we make step negative?  Doesn't matter!
    //              (10,4,-2)   => [10,8,6]  
    //              (4,10,-2)   => [4,6,8]  This happens too, but do you CARE?
    //
    //      -jdc 11/2/2012

    var start = y ? x : 0;
    var end = y || x;
    step = (Math.abs(step) || 1) * ( (end > start) ? 1 : -1 );

    var range = [];
    for(var i = start; (end > start) ? (i < end) : (i > end); i += step){
        range.push(i); }

    return range;
}

String.prototype.reverse = function(){
    if (this.length < 2) { 
        return this.toString();
    };
    var x = this.substr(-1) + this.substr(0,this.length - 1).reverse();
    return x;
}

String.prototype.is_palindrome = function(){
    //console.log("this:%o typeof(this):%s",this,typeof(this))
    return (this.reverse() === this);
}

Math.roundNumber = function(n,p){ // Round n to p places

  p = p || 0 // Round to nearest integer by default 
  return Math.round( n * Math.pow(10,p)) / Math.pow(10,p)

}

Math.randomNumber = function(range){ // Return a random integer between 1 and range, inclusive
  return Math.floor(Math.random() * range) + 1;
}
