function submit_line(){

  $("#error").hide();

  var output = evaluate_postfix($("#postfix_line")[0].value);

  if (output.toString().match(/[^\d-\.]/)) {
    show("result", output);
  } else {
    show("result", Math.roundNumber(output,3));
  }
}

function evaluate_postfix(str){
  
  var stack = [];
  var token = {
    current: "",
    remainder: str
  };

  while(token = next_token(token)){

    if (is_value(token.current)){

      stack.push(token.current);

    } else {
      //token is an operator
      if (stack.length < 2){ 
        return report_error("Too many operators, not enough values")
      }
      stack.push(do_operator(token.current,stack.pop(),stack.pop()));

    }
  }

  //We've parsed all the tokens, so we should just have the answer on the stack.

  if (stack.length > 1){ 
      return report_error("Too many values, not enough operators");
  }

  return stack.shift();

}

function next_token(t){

  if (t.remainder == "") {
    // if there are no more tokens, return false
    return false
  }

  //For now, tokens are delimited by whitespace
  var tokarr = t.remainder.split(/\s+/);
  return {
    current: tokarr[0],
    remainder: tokarr.slice(1,tokarr.length).join(" ")
  }
  
}

function do_operator(operator,operand1,operand2){

  operand1 = parseFloat(operand1);
  operand2 = parseFloat(operand2);
  switch (operator){
    case "+":
      return operand2 + operand1;
    case "-":
      return operand2 - operand1;
    case "*":
      return operand2 * operand1;
    case "/":
      return operand2 / operand1;
    default:
      return report_error("Unknown operator: '" + operator + "'");
  }

}

function is_value(str){
  if (str.match(/\d+/)) {
    return true
  }
  return false
}

function show(id,content){
  var container = $("#" + id);
  container.fadeOut(200,function(){
    container[0].innerHTML = content;
    container.fadeIn(200);
  });
}

$(document).ready(function(){

  //Bind the enter key to evaluate the answer
  $("#postfix_line").bind("keypress", function(e){
    if (e.keyCode == 13){
      submit_line()
    }
  });

  //Bind evaluation to the button
  $("#go_button").bind("click", submit_line);

  //Set initial focus
  $("#postfix_line").focus();

  $("#infix_line").bind("keypress", function(e){
    if (e.keyCode == 13){
      submit_infix()
    }
  });
});

Math.roundNumber = function(n,p){
  // Round n to p places
  var r = Math.round( n * Math.pow(10,p)) / Math.pow(10,p)
  return r;
}

function report_error(txt){
  $("#error")[0].innerHTML = txt;
  console.log("showing:" + txt + "..");
  $("#error").show();
  return("ERROR");
}
